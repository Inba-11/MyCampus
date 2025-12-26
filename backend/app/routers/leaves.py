from fastapi import APIRouter, HTTPException, Query, Depends
from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy.orm import Session
from ..db import get_db
from ..models import Leave as LeaveModel

router = APIRouter()

class LeaveRequest(BaseModel):
    id: int
    studentName: str
    studentId: str
    department: str
    mentorName: str
    parentPhone: str
    leaveType: str
    fromDate: str
    toDate: str
    totalDays: int
    reason: str
    status: str

    class Config:
        from_attributes = True

@router.get('/leaves', response_model=List[LeaveRequest])
def list_leaves(
    mine: Optional[bool] = Query(default=False),
    studentId: Optional[str] = None,
    status: Optional[str] = None,
    department: Optional[str] = None,
    mentorName: Optional[str] = None,
    board: Optional[bool] = False,
    db: Session = Depends(get_db)
):
    q = db.query(LeaveModel)
    if mine and studentId:
        q = q.filter(LeaveModel.studentId == studentId)
    if status:
        q = q.filter(LeaveModel.status == status)
    if department:
        q = q.filter(LeaveModel.department == department)
    if mentorName:
        q = q.filter(LeaveModel.mentorName == mentorName)
    return q.order_by(LeaveModel.id.desc()).all()

@router.post('/leaves', response_model=LeaveRequest)
def create_leave(payload: LeaveRequest, db: Session = Depends(get_db)):
    row = LeaveModel(**payload.dict())
    db.add(row)
    db.commit()
    return row

class UpdateStatus(BaseModel):
    status: str

@router.patch('/leaves/{leave_id}/status', response_model=LeaveRequest)
def update_leave_status(leave_id: int, payload: UpdateStatus, db: Session = Depends(get_db)):
    row = db.get(LeaveModel, leave_id)
    if not row:
        raise HTTPException(status_code=404, detail='Leave not found')
    row.status = payload.status
    db.commit()
    db.refresh(row)
    return row
