from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List
from sqlalchemy.orm import Session
from ..db import get_db
from ..models import Subject as SubjectModel

router = APIRouter()

class Subject(BaseModel):
    id: int
    name: str
    faculty: str
    ongoingChapters: str
    type: str  # 'Theory' | 'Lab'

    class Config:
        from_attributes = True

@router.get('/subjects', response_model=List[Subject])
def list_subjects(db: Session = Depends(get_db)):
    return db.query(SubjectModel).all()

class UpdateOngoing(BaseModel):
    ongoingChapters: str

@router.put('/subjects/{subject_id}/ongoing', response_model=Subject)
def update_ongoing(subject_id: int, payload: UpdateOngoing, db: Session = Depends(get_db)):
    row = db.get(SubjectModel, subject_id)
    if not row:
        raise HTTPException(status_code=404, detail='Subject not found')
    row.ongoingChapters = payload.ongoingChapters
    db.commit()
    db.refresh(row)
    return row
