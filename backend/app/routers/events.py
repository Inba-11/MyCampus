from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import and_
from ..db import get_db
from ..models import Event as EventModel

router = APIRouter()

class Event(BaseModel):
    id: int
    title: str
    type: str
    start: str
    end: Optional[str] = None
    description: Optional[str] = None

    class Config:
        from_attributes = True

@router.get('/events', response_model=List[Event])
def list_events(from_: Optional[str] = None, to: Optional[str] = None, db: Session = Depends(get_db)):
    q = db.query(EventModel)
    # Note: start/end are stored as strings 'YYYY-MM-DD'; simple filters
    if from_:
        q = q.filter(EventModel.start >= from_)
    if to:
        q = q.filter((EventModel.end == None) | (EventModel.end <= to))
    return q.order_by(EventModel.start.asc()).all()

@router.post('/events', response_model=Event)
def create_event(payload: Event, db: Session = Depends(get_db)):
    row = EventModel(**payload.dict())
    db.add(row)
    db.commit()
    db.refresh(row)
    return row

@router.put('/events/{event_id}', response_model=Event)
def update_event(event_id: int, payload: Event, db: Session = Depends(get_db)):
    row = db.get(EventModel, event_id)
    if not row:
        raise HTTPException(status_code=404, detail='Event not found')
    for k, v in payload.dict().items():
        setattr(row, k, v)
    db.commit()
    db.refresh(row)
    return row

@router.delete('/events/{event_id}')
def delete_event(event_id: int, db: Session = Depends(get_db)):
    row = db.get(EventModel, event_id)
    if not row:
        raise HTTPException(status_code=404, detail='Event not found')
    db.delete(row)
    db.commit()
    return {"status": "ok"}
