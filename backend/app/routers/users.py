from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

router = APIRouter()

class Teacher(BaseModel):
    id: str
    name: str
    subject: str | None = None
    dob: str | None = None
    education: str | None = None
    username: str | None = None

class Mentor(BaseModel):
    id: str
    name: str

TEACHERS: List[Teacher] = [
    Teacher(id='T-BS', name='Dr. S. Nanthitha', subject='Business Statistics', username='nanthitha'),
    Teacher(id='T-FDS', name='Ms. Padmapriya', subject='Foundation of Data Science', username='padmapriya'),
]
MENTORS: List[Mentor] = [
    Mentor(id='M-001', name='Seema Mam'),
    Mentor(id='M-002', name='Tamilarasu Sir'),
    Mentor(id='M-003', name='Priya Mam'),
]

@router.get('/users/teachers', response_model=List[Teacher])
def get_teachers():
    return TEACHERS

@router.get('/users/mentors', response_model=List[Mentor])
def get_mentors():
    return MENTORS
