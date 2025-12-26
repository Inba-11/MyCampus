import type { ReactElement } from 'react';

export enum UserRole {
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
  MENTOR = 'MENTOR',
}

export type NavigationItem = {
  name: string;
  // Fix: Replaced JSX.Element with ReactElement to resolve namespace issue.
  icon: (props: { className: string }) => ReactElement;
  roles: UserRole[];
};

export type LinkCategory = 'Academic' | 'Institute' | 'General';

export type LinkItem = {
  title: string;
  url: string;
  description: string;
  category: LinkCategory;
};

export type Reminder = {
  id: number;
  title: string;
  dueDate: string;
  completed: boolean;
};

export type ChatMessage = {
  id: number;
  sender: 'me' | 'assistant';
  text: string;
  timestamp: string;
  isLoading?: boolean;
};

export type Theme = 'light' | 'dark' | 'system';

export enum LeaveType {
    EMERGENCY = 'Emergency',
    SICK = 'Sick',
    CASUAL = 'Casual',
    ON_DUTY = 'On Duty',
    PERMISSION = 'Permission',
}

export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';

export type LeaveRequest = {
    id: number;
    studentName: string;
    studentId: string;
    department: string;
    mentorName: string;
    parentPhone: string;
    leaveType: LeaveType;
    fromDate: string;
    toDate: string;
    totalDays: number;
    reason: string;
    attachment?: File;
    status: LeaveStatus;
};

export type NotificationBubble = {
    id: number;
    message: string;
    type: 'success' | 'pending';
    timestamp: number;
};

export type User = {
    name: string;
    id: string;
    role: UserRole;
    department: string;
    subjectHandled?: string;
};

export type Student = {
  rollNo: string;
  name: string;
  username: string;
  password: string;
};

export type Subject = {
    id: number;
    name: string;
    faculty: string;
    ongoingChapters: string;
    type: 'Theory' | 'Lab';
};

export type TeacherProfile = {
    id: string;
    name: string;
    subject: string;
    dob: string;
    education: string;
    username: string;
};

export type TimetableEntry = {
  subjectId: number;
  faculty: string;
} | 'Break' | 'Lunch' | null;

export type TimetableData = {
  [day: string]: TimetableEntry[];
};

export enum EventType {
    HOLIDAY = 'Holiday',
    EXAM = 'Exam',
    ACADEMIC = 'Academic Event',
    INTERNAL_TEST = 'Internal Test',
}

export type CalendarEvent = {
    id: number;
    title: string;
    start: string; // ISO string e.g., '2025-07-06'
    end?: string;   // ISO string, for multi-day events
    type: EventType;
    description?: string;
};

export type TheoryUnit = {
    title: string;
    content: string;
};

export type Syllabus = {
  subjectId: number;
  theoryContent?: TheoryUnit[];
  labContent?: string[];
};

export type Announcement = {
  id: number;
  title: string;
  date: string;
  content: string;
  postedBy: string;
  isRead: boolean;
};

export type CampusEvent = {
  id: number;
  title: string;
  date: string;
  time: string;
  description: string;
};

// --- Quick Chat Types ---
export type AttachmentType = 'image' | 'document' | 'zip' | 'audio';

export type Attachment = {
  name: string;
  dataUrl: string; // Base64 encoded file content
  type: AttachmentType;
  mimeType: string;
  size: number;
};

export type QuickChatMessage = {
  id: number;
  user: {
    id: string;
    name: string;
  };
  timestamp: string;
  text?: string;
  attachments?: Attachment[];
};

export enum ResourceType {
    BOOK = 'Book',
    PDF = 'PDF',
    LINK = 'Link',
    NOTES = 'Notes',
}

export type Resource = {
    id: number;
    subjectId: number;
    title: string;
    type: ResourceType;
    url: string;
    description?: string;
};

export type BookReference = {
  id: number;
  subjectId: number;
  title: string;
  author: string;
  authorUrl?: string;
};

export type StudentAchievement = {
  name: string;
  dept: string;
  leetCodeSolved: number;
  hackathonWins: number;
  projectsCompleted: number;
  topic: string;
  domain: string;
};

// --- Chat Types (backend) ---
export type ChatRoom = {
  id: number;
  name: string;
  type: 'group' | 'private';
};

export type ChatBackendMessage = {
  id: number;
  room_id: number;
  sender_id: string;
  sender_name: string;
  content: string;
  timestamp: string; // ISO string
};