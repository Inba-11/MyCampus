from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy.orm import Session
from datetime import datetime
from ..db import get_db
from ..models import ChatRoom as ChatRoomModel, Message as MessageModel
from fastapi import WebSocket, WebSocketDisconnect

class ConnectionManager:
    def __init__(self):
        self.rooms: dict[int, set[WebSocket]] = {}

    async def connect(self, room_id: int, websocket: WebSocket):
        await websocket.accept()
        self.rooms.setdefault(room_id, set()).add(websocket)

    def disconnect(self, room_id: int, websocket: WebSocket):
        conns = self.rooms.get(room_id)
        if conns and websocket in conns:
            conns.remove(websocket)
            if not conns:
                self.rooms.pop(room_id, None)

    async def broadcast(self, room_id: int, message: dict):
        for ws in list(self.rooms.get(room_id, set())):
            try:
                await ws.send_json(message)
            except Exception:
                # Drop broken connections
                self.disconnect(room_id, ws)

manager = ConnectionManager()

router = APIRouter()

class ChatRoom(BaseModel):
    id: int
    name: str
    type: str
    class Config:
        from_attributes = True

class Message(BaseModel):
    id: int
    room_id: int
    sender_id: str
    sender_name: str
    content: str
    timestamp: str
    class Config:
        from_attributes = True

@router.get('/chatrooms', response_model=List[ChatRoom])
def list_chatrooms(db: Session = Depends(get_db)):
    return db.query(ChatRoomModel).order_by(ChatRoomModel.id.asc()).all()

@router.get('/messages/{room_id}', response_model=List[Message])
def list_messages(room_id: int, offset: int = 0, limit: int = 100, user_id: Optional[str] = None, db: Session = Depends(get_db)):
    from ..models import UserMessageState as UMS, RoomUserState as RUS
    q = db.query(MessageModel).filter(MessageModel.room_id == room_id, MessageModel.deleted == 0)
    # Exclude cleared messages
    if user_id:
        rus = db.query(RUS).filter(RUS.room_id == room_id, RUS.user_id == user_id).first()
        if rus:
            q = q.filter(MessageModel.timestamp > rus.cleared_at)
        # Exclude hidden messages for this user
        hidden_ids = db.query(UMS.message_id).filter(UMS.user_id == user_id).subquery()
        q = q.filter(~MessageModel.id.in_(hidden_ids))
    q = q.order_by(MessageModel.id.asc())
    return q.offset(offset).limit(limit).all()

class SendMessage(BaseModel):
    sender_id: str
    sender_name: str
    content: str
    type: Optional[str] = "text"
    meta: Optional[dict] = None

@router.post('/messages/{room_id}', response_model=Message)
def send_message(room_id: int, payload: SendMessage, db: Session = Depends(get_db)):
    # basic room existence check
    room = db.get(ChatRoomModel, room_id)
    if not room:
        raise HTTPException(status_code=404, detail='Room not found')
    import json
    row = MessageModel(
        room_id=room_id,
        sender_id=payload.sender_id,
        sender_name=payload.sender_name,
        type=payload.type or 'text',
        content=payload.content,
        meta=(None if payload.meta is None else json.dumps(payload.meta)),
        timestamp=datetime.utcnow().isoformat(timespec='seconds') + 'Z'
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    # Broadcast new message event
    import anyio
    async def _notify():
        await manager.broadcast(room_id, {
            'type': 'message:new',
            'data': {
                'id': row.id,
                'room_id': room_id,
                'sender_id': row.sender_id,
                'sender_name': row.sender_name,
                'content': row.content,
                'type': row.type,
                'meta': row.meta,
                'timestamp': row.timestamp,
            }
        })
    try:
        anyio.from_thread.run(_notify)
    except Exception:
        pass
    return row

class HideMessage(BaseModel):
    user_id: str

@router.post('/messages/{message_id}/hide')
def hide_message(message_id: int, payload: HideMessage, db: Session = Depends(get_db)):
    from ..models import UserMessageState as UMS
    now = datetime.utcnow().isoformat(timespec='seconds') + 'Z'
    exists = db.query(UMS).filter(UMS.message_id == message_id, UMS.user_id == payload.user_id).first()
    if not exists:
        db.add(UMS(message_id=message_id, user_id=payload.user_id, hidden_at=now))
        db.commit()
    return {"status": "ok"}

class ClearRoom(BaseModel):
    user_id: str

@router.post('/chatrooms/{room_id}/clear')
def clear_room(room_id: int, payload: ClearRoom, db: Session = Depends(get_db)):
    from ..models import RoomUserState as RUS
    now = datetime.utcnow().isoformat(timespec='seconds') + 'Z'
    row = db.query(RUS).filter(RUS.room_id == room_id, RUS.user_id == payload.user_id).first()
    if row:
        row.cleared_at = now
    else:
        db.add(RUS(room_id=room_id, user_id=payload.user_id, cleared_at=now))
    db.commit()
    return {"status": "ok"}

@router.websocket('/ws/{room_id}')
async def ws_room(websocket: WebSocket, room_id: int):
    await manager.connect(room_id, websocket)
    try:
        while True:
            msg = await websocket.receive_json()
            mtype = msg.get('type')
            if mtype in ('typing:start', 'typing:stop'):
                user = msg.get('user', {})
                await manager.broadcast(room_id, {
                    'type': mtype,
                    'user': user,
                    'ts': datetime.utcnow().isoformat(timespec='seconds') + 'Z'
                })
            # ignore other client events for now
    except WebSocketDisconnect:
        manager.disconnect(room_id, websocket)

# File uploads (attachments)
from fastapi import UploadFile, File
import os

@router.post('/uploads')
def upload_file(file: UploadFile = File(...)):
    base_dir = os.path.dirname(os.path.dirname(__file__))  # backend/app
    uploads_dir = os.path.join(base_dir, 'uploads')
    os.makedirs(uploads_dir, exist_ok=True)
    filename = f"{int(datetime.utcnow().timestamp())}_{file.filename}"
    dest = os.path.join(uploads_dir, filename)
    with open(dest, 'wb') as f:
        f.write(file.file.read())
    # Construct static URL (served by Starlette static files later or raw file path if proxied)
    url = f"/uploads/{filename}"
    return {
        'filename': file.filename,
        'stored_as': filename,
        'url': url,
        'mime': file.content_type,
        'size': os.path.getsize(dest),
    }

# ---- Additional endpoints: rooms, membership, dm, receipts, delete, search ----

class CreateRoom(BaseModel):
    name: str
    type: str  # 'group'|'private'
    visibility: str = "all"
    meta: Optional[dict] = None

@router.post('/chatrooms', response_model=ChatRoom)
def create_chatroom(payload: CreateRoom, db: Session = Depends(get_db)):
    row = ChatRoomModel(name=payload.name, type=payload.type, visibility=payload.visibility, meta=(None if payload.meta is None else __import__('json').dumps(payload.meta)))
    db.add(row)
    db.commit()
    db.refresh(row)
    return row

class UpdateMembers(BaseModel):
    add: Optional[list[str]] = None
    remove: Optional[list[str]] = None

@router.post('/chatrooms/{room_id}/members')
def update_members(room_id: int, payload: UpdateMembers, db: Session = Depends(get_db)):
    from ..models import RoomMember as RoomMemberModel
    # add members
    if payload.add:
        for uid in payload.add:
            exists = db.query(RoomMemberModel).filter(RoomMemberModel.room_id == room_id, RoomMemberModel.user_id == uid).first()
            if not exists:
                db.add(RoomMemberModel(room_id=room_id, user_id=uid))
    # remove members
    if payload.remove:
        db.query(RoomMemberModel).filter(RoomMemberModel.room_id == room_id, RoomMemberModel.user_id.in_(payload.remove)).delete(synchronize_session=False)
    db.commit()
    return {"status": "ok"}

class CreateDM(BaseModel):
    user_a: str
    user_b: str

@router.post('/dm', response_model=ChatRoom)
def create_or_get_dm(payload: CreateDM, db: Session = Depends(get_db)):
    from ..models import RoomMember as RoomMemberModel
    import json
    # find private room containing both users
    sub_a = db.query(RoomMemberModel.room_id).filter(RoomMemberModel.user_id == payload.user_a).subquery()
    sub_b = db.query(RoomMemberModel.room_id).filter(RoomMemberModel.user_id == payload.user_b).subquery()
    existing = db.query(ChatRoomModel).filter(ChatRoomModel.type == 'private', ChatRoomModel.id.in_(sub_a)).filter(ChatRoomModel.id.in_(sub_b)).first()
    if existing:
        return existing
    # create
    row = ChatRoomModel(name=f"DM:{payload.user_a}:{payload.user_b}", type='private', visibility='all', meta=json.dumps({"dm": True, "users": [payload.user_a, payload.user_b]}))
    db.add(row)
    db.commit()
    db.refresh(row)
    db.add_all([
        RoomMemberModel(room_id=row.id, user_id=payload.user_a),
        RoomMemberModel(room_id=row.id, user_id=payload.user_b),
    ])
    db.commit()
    return row

class MarkRead(BaseModel):
    user_id: str

@router.post('/messages/{message_id}/read')
def mark_read(message_id: int, payload: MarkRead, db: Session = Depends(get_db)):
    from ..models import ReadReceipt as ReadReceiptModel
    now = datetime.utcnow().isoformat(timespec='seconds') + 'Z'
    rr = db.query(ReadReceiptModel).filter(ReadReceiptModel.message_id == message_id, ReadReceiptModel.user_id == payload.user_id).first()
    if rr:
        rr.read_at = now
    else:
        rr = ReadReceiptModel(message_id=message_id, user_id=payload.user_id, delivered_at=now, read_at=now)
        db.add(rr)
    db.commit()
    return {"status": "ok"}

@router.delete('/messages/{message_id}')
def delete_message(message_id: int, db: Session = Depends(get_db)):
    row = db.get(MessageModel, message_id)
    if not row:
        raise HTTPException(status_code=404, detail='Message not found')
    row.deleted = 1
    db.commit()
    # Broadcast deletion
    import anyio
    async def _notify():
        await manager.broadcast(row.room_id, { 'type': 'message:deleted', 'id': row.id })
    try:
        anyio.from_thread.run(_notify)
    except Exception:
        pass
    return {"status": "ok"}

@router.get('/messages/{room_id}/search', response_model=List[Message])
def search_messages(room_id: int, q: str, limit: int = 50, db: Session = Depends(get_db)):
    query = db.query(MessageModel).filter(MessageModel.room_id == room_id, MessageModel.deleted == 0)
    if q:
        like = f"%{q}%"
        query = query.filter(MessageModel.content.like(like))
    return query.order_by(MessageModel.id.desc()).limit(limit).all()

class EditMessage(BaseModel):
    content: str

@router.patch('/messages/{message_id}', response_model=Message)
def edit_message(message_id: int, payload: EditMessage, db: Session = Depends(get_db)):
    import json
    row = db.get(MessageModel, message_id)
    if not row:
        raise HTTPException(status_code=404, detail='Message not found')
    row.content = payload.content
    # mark edited in meta
    meta = {}
    try:
        if row.meta:
            meta = json.loads(row.meta)
    except Exception:
        meta = {}
    meta['edited'] = True
    meta['edited_at'] = datetime.utcnow().isoformat(timespec='seconds') + 'Z'
    row.meta = json.dumps(meta)
    db.commit()
    db.refresh(row)
    # Broadcast edited
    import anyio
    async def _notify():
        await manager.broadcast(row.room_id, {
            'type': 'message:edited',
            'data': {
                'id': row.id,
                'content': row.content,
                'meta': row.meta,
            }
        })
    try:
        anyio.from_thread.run(_notify)
    except Exception:
        pass
    return row
