from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .routers import auth, users, announcements, events, leaves, subjects, timetable, chat
from .db import engine, Base, SessionLocal
from . import models
import json
from datetime import date as date_cls

app = FastAPI(title="MyCampus API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(users.router, prefix="/api")
app.include_router(announcements.router, prefix="/api")
app.include_router(events.router, prefix="/api")
app.include_router(leaves.router, prefix="/api")
app.include_router(subjects.router, prefix="/api")
app.include_router(timetable.router, prefix="/api")
app.include_router(chat.router, prefix="/api")

# Serve uploads directory
import os
uploads_dir = os.path.join(os.path.dirname(__file__), 'uploads')
os.makedirs(uploads_dir, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")

# Root route that redirects to /docs
@app.get("/", include_in_schema=False)
async def root():
    return RedirectResponse(url="/docs")

# Create tables on startup (simple approach; replace with Alembic in production)
@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)
    # Seed minimal data if tables are empty (preserve previous behavior)
    db = SessionLocal()
    try:
        # --- Lightweight migrations for existing SQLite DBs ---
        with engine.connect() as conn:
            def _exec(sql: str):
                try:
                    conn.exec_driver_sql(sql)
                except Exception:
                    pass
            # chat_rooms: add visibility, meta
            _exec("ALTER TABLE chat_rooms ADD COLUMN visibility VARCHAR(32) NOT NULL DEFAULT 'all'")
            _exec("ALTER TABLE chat_rooms ADD COLUMN meta TEXT")
            # messages: add type, meta, deleted
            _exec("ALTER TABLE messages ADD COLUMN type VARCHAR(16) NOT NULL DEFAULT 'text'")
            _exec("ALTER TABLE messages ADD COLUMN meta TEXT")
            _exec("ALTER TABLE messages ADD COLUMN deleted INTEGER NOT NULL DEFAULT 0")
        # Announcements
        if db.query(models.Announcement).count() == 0:
            db.add_all([
                models.Announcement(title='Mid-term Exam Schedule Published', content='Schedule published. Check Events.', date=date_cls(2025, 8, 15), postedBy='Admin Office'),
                models.Announcement(title='Annual Sports Day Registration', content='Register before Aug 20th.', date=date_cls(2025, 8, 10), postedBy='Student Council'),
            ])
        # Events
        if db.query(models.Event).count() == 0:
            db.add_all([
                models.Event(title='Opening Day', type='Academic Event', start='2025-07-14'),
                models.Event(title='Independence Day', type='Holiday', start='2025-08-15'),
            ])
        # Subjects
        if db.query(models.Subject).count() == 0:
            db.add_all([
                models.Subject(id=1, name='Business Statistics', faculty='Dr. S. Nanthitha', ongoingChapters='Unit 2: Probability\nUnit 3: Hypothesis Testing', type='Theory'),
                models.Subject(id=2, name='Foundation of Data Science', faculty='Ms. Padmapriya', ongoingChapters='Unit 1: Introduction to Data Science', type='Theory'),
                models.Subject(id=3, name='Full Stack Development', faculty='Dr. A. Priya', ongoingChapters='Unit 3: React Hooks\nUnit 4: State Management', type='Theory'),
                models.Subject(id=7, name='Foundation of Data Science Lab', faculty='Mr. P. TamilArasu', ongoingChapters='Experiment 3: Data Visualization with Matplotlib', type='Lab'),
            ])
        # Timetable
        if db.query(models.Timetable).count() == 0:
            sample = {
                'Monday': [ {'subjectId': '1', 'faculty': 'Dr. S. Nanthitha'}, {'subjectId': '2', 'faculty': 'Ms. Padmapriya'}, 'Break', {'subjectId': '3', 'faculty': 'Dr. A. Priya'} ],
                'Tuesday': [ {'subjectId': '3', 'faculty': 'Dr. A. Priya'}, {'subjectId': '1', 'faculty': 'Dr. S. Nanthitha'}, 'Break', {'subjectId': '2', 'faculty': 'Ms. Padmapriya'} ],
            }
            db.add(models.Timetable(section='CSBS', data=json.dumps(sample)))
        # Chat seed
        if db.query(models.ChatRoom).count() == 0:
            db.add(models.ChatRoom(name='General', type='group'))
        db.commit()
    finally:
        db.close()
