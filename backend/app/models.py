from sqlalchemy import Column, Integer, String, Text, Date, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from .db import Base

class Announcement(Base):
    __tablename__ = "announcements"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    date: Mapped[Date] = mapped_column(Date, nullable=False)
    postedBy: Mapped[str] = mapped_column(String(255), nullable=False)

class Event(Base):
    __tablename__ = "events"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    type: Mapped[str] = mapped_column(String(64), nullable=False)
    start: Mapped[str] = mapped_column(String(32), nullable=False)
    end: Mapped[str | None] = mapped_column(String(32), nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)

class Leave(Base):
    __tablename__ = "leaves"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=False)
    studentName: Mapped[str] = mapped_column(String(255), nullable=False)
    studentId: Mapped[str] = mapped_column(String(64), nullable=False)
    department: Mapped[str] = mapped_column(String(128), nullable=False)
    mentorName: Mapped[str] = mapped_column(String(255), nullable=False)
    parentPhone: Mapped[str] = mapped_column(String(32), nullable=False)
    leaveType: Mapped[str] = mapped_column(String(32), nullable=False)
    fromDate: Mapped[str] = mapped_column(String(16), nullable=False)
    toDate: Mapped[str] = mapped_column(String(16), nullable=False)
    totalDays: Mapped[int] = mapped_column(Integer, nullable=False)
    reason: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[str] = mapped_column(String(16), nullable=False)

class Subject(Base):
    __tablename__ = "subjects"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    faculty: Mapped[str] = mapped_column(String(255), nullable=False)
    ongoingChapters: Mapped[str] = mapped_column(Text, nullable=False)
    type: Mapped[str] = mapped_column(String(16), nullable=False)  # 'Theory' | 'Lab'

class Timetable(Base):
    __tablename__ = "timetables"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    section: Mapped[str] = mapped_column(String(64), unique=True, nullable=False)
    data: Mapped[str] = mapped_column(Text, nullable=False)  # JSON string

# --- Chat ---
class ChatRoom(Base):
    __tablename__ = "chat_rooms"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    type: Mapped[str] = mapped_column(String(32), nullable=False)  # 'group' | 'private'
    visibility: Mapped[str] = mapped_column(String(32), nullable=False, default="all")  # 'all'|'student'|'teacher'|'mentor'
    meta: Mapped[str | None] = mapped_column(Text, nullable=True)  # JSON string

class Message(Base):
    __tablename__ = "messages"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    room_id: Mapped[int] = mapped_column(Integer, ForeignKey("chat_rooms.id"), nullable=False)
    sender_id: Mapped[str] = mapped_column(String(128), nullable=False)
    sender_name: Mapped[str] = mapped_column(String(255), nullable=False)
    type: Mapped[str] = mapped_column(String(16), nullable=False, default="text")  # 'text'|'image'|'audio'|'video'|'document'
    content: Mapped[str] = mapped_column(Text, nullable=False)
    meta: Mapped[str | None] = mapped_column(Text, nullable=True)  # JSON string
    timestamp: Mapped[str] = mapped_column(String(32), nullable=False)  # ISO string
    deleted: Mapped[int] = mapped_column(Integer, nullable=False, default=0)  # 0/1

class RoomMember(Base):
    __tablename__ = "room_members"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    room_id: Mapped[int] = mapped_column(Integer, ForeignKey("chat_rooms.id"), nullable=False)
    user_id: Mapped[str] = mapped_column(String(128), nullable=False)
    role: Mapped[str] = mapped_column(String(16), nullable=False, default="member")  # 'member'|'moderator'

class ReadReceipt(Base):
    __tablename__ = "read_receipts"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    message_id: Mapped[int] = mapped_column(Integer, ForeignKey("messages.id"), nullable=False)
    user_id: Mapped[str] = mapped_column(String(128), nullable=False)
    delivered_at: Mapped[str | None] = mapped_column(String(32), nullable=True)
    read_at: Mapped[str | None] = mapped_column(String(32), nullable=True)

class UserMessageState(Base):
    __tablename__ = "user_message_state"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    message_id: Mapped[int] = mapped_column(Integer, ForeignKey("messages.id"), nullable=False)
    user_id: Mapped[str] = mapped_column(String(128), nullable=False)
    hidden_at: Mapped[str] = mapped_column(String(32), nullable=False)

class RoomUserState(Base):
    __tablename__ = "room_user_state"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    room_id: Mapped[int] = mapped_column(Integer, ForeignKey("chat_rooms.id"), nullable=False)
    user_id: Mapped[str] = mapped_column(String(128), nullable=False)
    cleared_at: Mapped[str] = mapped_column(String(32), nullable=False)
