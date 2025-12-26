from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class LoginRequest(BaseModel):
    username: str
    password: str
    role: str | None = None

class User(BaseModel):
    id: str
    name: str
    role: str
    department: str | None = None
    subjectHandled: str | None = None

class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user: User

@router.post("/auth/login", response_model=LoginResponse)
def login(payload: LoginRequest):
    role = payload.role or "STUDENT"
    user = User(id="USR-0001", name=payload.username, role=role, department="CSBS")
    return LoginResponse(access_token="demo-token", token_type="bearer", user=user)

@router.get("/auth/me", response_model=User)
def me():
    return User(id="USR-0001", name="Demo User", role="STUDENT", department="CSBS")
