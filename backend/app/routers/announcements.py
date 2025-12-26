from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List
from sqlalchemy.orm import Session
from ..db import get_db
from ..models import Announcement as AnnouncementModel

router = APIRouter()

class Announcement(BaseModel):
    id: int
    title: str
    content: str
    date: str
    postedBy: str

    class Config:
        from_attributes = True

@router.get('/announcements', response_model=List[Announcement])
def list_announcements(db: Session = Depends(get_db)):
    rows = db.query(AnnouncementModel).order_by(AnnouncementModel.date.desc()).all()
    return rows

class MarkReadRequest(BaseModel):
    pass

@router.post('/announcements/{announcement_id}/read')
def mark_as_read(announcement_id: int, _: MarkReadRequest | None = None):
    # Placeholder: would create per-user read receipt
    return {"status": "ok"}
