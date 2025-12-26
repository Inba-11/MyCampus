from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Dict, List, Union
from sqlalchemy.orm import Session
from ..db import get_db
from ..models import Timetable as TimetableModel
import json

router = APIRouter()

TimetableEntry = Union[Dict[str, str], str, None]

class Timetable(BaseModel):
    id: int
    section: str
    data: Dict[str, List[TimetableEntry]]  # day -> entries

    class Config:
        from_attributes = True

@router.get('/timetables', response_model=Timetable)
def get_timetable(section: str = 'CSBS', db: Session = Depends(get_db)):
    row = db.query(TimetableModel).filter(TimetableModel.section == section).first()
    if not row:
        raise HTTPException(status_code=404, detail='Timetable not found')
    data = json.loads(row.data)
    return Timetable(id=row.id, section=row.section, data=data)

class PatchCell(BaseModel):
    day: str
    periodIndex: int
    subjectId: str
    faculty: str

@router.patch('/timetables/{timetable_id}/cell', response_model=Timetable)
def patch_cell(timetable_id: int, payload: PatchCell, db: Session = Depends(get_db)):
    row = db.get(TimetableModel, timetable_id)
    if not row:
        raise HTTPException(status_code=404, detail='Timetable not found')
    data = json.loads(row.data)
    day_list = list(data.get(payload.day, []))
    while len(day_list) <= payload.periodIndex:
        day_list.append(None)
    day_list[payload.periodIndex] = { 'subjectId': payload.subjectId, 'faculty': payload.faculty }
    data[payload.day] = day_list
    row.data = json.dumps(data)
    db.commit()
    return Timetable(id=row.id, section=row.section, data=data)
