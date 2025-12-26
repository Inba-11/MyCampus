<div align="center">
  <h1>🎓 MyCampus</h1>
  <p><strong>A Comprehensive Campus Management System</strong></p>
  <p>Full-stack application for managing academic activities, student services, and campus communication</p>
  
  [![React](https://img.shields.io/badge/React-19.1.1-61DAFB?logo=react)](https://react.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178C6?logo=typescript)](https://www.typescriptlang.org/)
  [![FastAPI](https://img.shields.io/badge/FastAPI-0.115.4-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
  [![Python](https://img.shields.io/badge/Python-3.11+-3776AB?logo=python)](https://www.python.org/)
  [![Vite](https://img.shields.io/badge/Vite-6.2.0-646CFF?logo=vite)](https://vitejs.dev/)
</div>

---

## 📋 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [User Roles](#-user-roles)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 About

**MyCampus** is a modern, full-stack campus management system designed to streamline academic operations, student services, and campus communication. It provides a centralized platform for students, teachers, administrators, and mentors to manage their academic activities efficiently.

### Key Highlights
- 🚀 **Modern Tech Stack**: Built with React 19, TypeScript, and FastAPI
- 🎨 **Responsive Design**: Mobile-first approach with dark/light theme support
- 🔐 **Role-Based Access**: Secure authentication with multiple user roles
- 🤖 **AI Integration**: Built-in AI assistant powered by Google Gemini
- 💬 **Real-time Chat**: Interactive chat system for campus communication
- 📱 **Progressive Web App**: Works seamlessly on desktop and mobile devices

---

## ✨ Features

### 🏠 Core Features

#### **Dashboard & Navigation**
- Personalized home dashboard
- Responsive sidebar navigation
- Mobile-friendly bottom navigation
- Theme switcher (Light/Dark/System)
- Real-time notifications

#### **Academic Management**
- **Subjects**: View all subjects with faculty details and ongoing chapters
- **Timetable**: Interactive weekly timetable with subject schedules
- **Syllabus**: Centralized syllabus management
- **Teacher Profiles**: Browse faculty information and contact details
- **Resources**: Access study materials and reference books

#### **Leave Management System**
- Apply for leave requests (Emergency, Sick, Casual, On Duty, Permission)
- Track leave status in real-time
- Leave approval workflow for mentors/admins
- Leave board for viewing all requests
- Automatic leave day calculation

#### **Events & Announcements**
- **Events Calendar**: View and manage campus events
- **Announcements**: Important campus updates and notifications
- Event filtering by type (Academic, Holiday, Cultural, etc.)
- Date-based event organization

#### **Communication**
- **Quick Chat**: Real-time messaging system
- Group chat rooms
- Private messaging
- Chat history and search
- File sharing support

#### **AI Assistant**
- Integrated Google Gemini AI
- Academic queries and assistance
- Study help and explanations
- General campus information

#### **Additional Features**
- **Reminders**: Task and deadline management
- **Links**: Quick access to important resources
- **Settings**: User preferences and account management
- **Achievements**: Student achievement tracking

---

## 🛠 Tech Stack

### Frontend
- **React 19.1.1** - UI library
- **TypeScript 5.8.2** - Type safety
- **Vite 6.2.0** - Build tool and dev server
- **React Router** - Navigation
- **Google Gemini AI** - AI assistant integration

### Backend
- **FastAPI 0.115.4** - Python web framework
- **SQLAlchemy 2.0.36** - ORM and database management
- **Uvicorn** - ASGI server
- **Pydantic 2.9.2** - Data validation
- **Python 3.11+** - Runtime

### Database
- **SQLite** - Development database (easily switchable to PostgreSQL for production)

### Development Tools
- **TypeScript** - Static type checking
- **Vite** - Fast HMR and optimized builds
- **ESLint/Prettier** - Code formatting (recommended)

---

## 📂 Project Structure

```
mycampus/
├── components/                 # React UI components
│   ├── pages/                  # Route components
│   └── *.tsx                   # Shared components
├── backend/
│   └── app/
│       ├── routers/            # API endpoints
│       ├── models.py           # SQLAlchemy models
│       └── main.py             # FastAPI app entrypoint
├── api.ts                      # Frontend API client
├── types.ts                    # TypeScript definitions
└── vite.config.ts              # Build configuration
```

---

## 👥 User Roles & Permissions

| Role    | Permissions |
|--------|-------------|
| **STUDENT** | View subjects, apply leaves, chat, AI assistant |
| **TEACHER** | Student + manage subjects, view leaves |
| **MENTOR** | Teacher + approve/reject leaves |
| **ADMIN** | Full system access |

---

## 📦 Tech Stack — Deep Dive

| Layer      | Technology  | Purpose |
|-----------|-------------|--------|
| **Frontend** | React 19 | UI rendering |
| **Language** | TypeScript | Type safety |
| **Build Tool** | Vite | Fast HMR & bundling |
| **Backend** | FastAPI | REST API |
| **ORM** | SQLAlchemy | Database abstraction |
| **Database** | SQLite | Data persistence |
| **AI** | Gemini API | Assistant features |

---

## 👤 Author

**Inba-11** — [@Inba-11](https://github.com/Inba-11)

---

<div align="center">

**Built with ⚡ by developers, for developers**

[⭐ Star](https://github.com/Inba-11/MyCampus) • [🐛 Report Bug](https://github.com/Inba-11/MyCampus/issues) • [💡 Request Feature](https://github.com/Inba-11/MyCampus/issues)

</div>

