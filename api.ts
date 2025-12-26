// Minimal API client for MyCampus frontend
// Uses Vite env VITE_API_URL, defaults to http://localhost:8000/api

const BASE_URL = (import.meta as any)?.env?.VITE_API_URL || 'http://localhost:8000/api';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

async function request<T>(path: string, options: { method?: HttpMethod; body?: any; headers?: Record<string, string> } = {}): Promise<T> {
  const { method = 'GET', body, headers = {} } = options;
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': body instanceof FormData ? undefined as any : 'application/json',
      ...headers,
    } as any,
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
    credentials: 'include',
  });
  if (!res.ok) {
    let detail: any = undefined;
    try { detail = await res.json(); } catch {}
    throw new Error(detail?.detail || `HTTP ${res.status}`);
  }
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) return res.json();
  // @ts-ignore
  return undefined;
}

// Types aligned with frontend types.ts (partial)
export type UserRole = 'ADMIN' | 'TEACHER' | 'STUDENT' | 'MENTOR';
export type User = { id: string; name: string; role: UserRole; department?: string; subjectHandled?: string };
export type Announcement = { id: number; title: string; content: string; date: string; postedBy: string };
export type CalendarEvent = { id: number; title: string; type: string; start: string; end?: string; description?: string };
export type LeaveRequest = { id: number; studentName: string; studentId: string; department: string; mentorName: string; parentPhone: string; leaveType: string; fromDate: string; toDate: string; totalDays: number; reason: string; status: string };
export type Subject = { id: number; name: string; faculty: string; ongoingChapters: string; type: 'Theory' | 'Lab' };
export type Timetable = { id: number; section: string; data: Record<string, any[]> };

// Auth
export async function authLogin(payload: { username: string; password: string; role?: UserRole }) {
  return request<{ access_token: string; token_type: string; user: User }>(`/auth/login`, { method: 'POST', body: payload });
}
export async function getMe() { return request<User>(`/auth/me`); }

// Announcements
export async function getAnnouncements() { return request<Announcement[]>(`/announcements`); }
export async function markAnnouncementRead(id: number) { return request(`/announcements/${id}/read`, { method: 'POST' }); }

// Events
export async function getEvents(params?: { from?: string; to?: string }) {
  const q = new URLSearchParams();
  if (params?.from) q.set('from', params.from);
  if (params?.to) q.set('to', params.to);
  const qs = q.toString();
  return request<CalendarEvent[]>(`/events${qs ? `?${qs}` : ''}`);
}
export async function createEvent(event: CalendarEvent) { return request<CalendarEvent>(`/events`, { method: 'POST', body: event }); }
export async function updateEvent(id: number, event: CalendarEvent) { return request<CalendarEvent>(`/events/${id}`, { method: 'PUT', body: event }); }
export async function deleteEvent(id: number) { return request(`/events/${id}`, { method: 'DELETE' }); }

// Leaves
export async function createLeave(payload: LeaveRequest) { return request<LeaveRequest>(`/leaves`, { method: 'POST', body: payload }); }
export async function getLeaves(params?: { mine?: boolean; studentId?: string; status?: string; department?: string; mentorName?: string }) {
  const q = new URLSearchParams();
  if (params?.mine) q.set('mine', 'true');
  if (params?.studentId) q.set('studentId', params.studentId);
  if (params?.status) q.set('status', params.status);
  if (params?.department) q.set('department', params.department);
  if (params?.mentorName) q.set('mentorName', params.mentorName);
  const qs = q.toString();
  return request<LeaveRequest[]>(`/leaves${qs ? `?${qs}` : ''}`);
}
export async function updateLeaveStatus(id: number, status: 'Pending' | 'Approved' | 'Rejected') {
  return request<LeaveRequest>(`/leaves/${id}/status`, { method: 'PATCH', body: { status } });
}

// Subjects
export async function getSubjects() { return request<Subject[]>(`/subjects`); }
export async function updateSubjectOngoing(id: number, ongoingChapters: string) {
  return request<Subject>(`/subjects/${id}/ongoing`, { method: 'PUT', body: { ongoingChapters } });
}

// Chat
export type ChatRoom = { id: number; name: string; type: 'group' | 'private' };
export type ChatBackendMessage = { id: number; room_id: number; sender_id: string; sender_name: string; content: string; timestamp: string };

export async function getChatRooms() {
  return request<ChatRoom[]>(`/chatrooms`);
}

export async function getMessages(roomId: number, opts?: { offset?: number; limit?: number; userId?: string }) {
  const q = new URLSearchParams();
  if (opts?.offset != null) q.set('offset', String(opts.offset));
  if (opts?.limit != null) q.set('limit', String(opts.limit));
  if (opts?.userId) q.set('user_id', opts.userId);
  const qs = q.toString();
  return request<ChatBackendMessage[]>(`/messages/${roomId}${qs ? `?${qs}` : ''}`);
}

export async function sendMessage(roomId: number, body: { sender_id: string; sender_name: string; content: string }) {
  return request<ChatBackendMessage>(`/messages/${roomId}`, { method: 'POST', body });
}

export async function editMessage(messageId: number, content: string) {
  return request<ChatBackendMessage>(`/messages/${messageId}`, { method: 'PATCH', body: { content } });
}

export async function deleteMessageApi(messageId: number) {
  return request(`/messages/${messageId}`, { method: 'DELETE' });
}

export async function hideMessage(messageId: number, user_id: string) {
  return request(`/messages/${messageId}/hide`, { method: 'POST', body: { user_id } });
}

export async function clearRoom(roomId: number, user_id: string) {
  return request(`/chatrooms/${roomId}/clear`, { method: 'POST', body: { user_id } });
}

// Timetable
export async function getTimetable(section = 'CSBS') { return request<Timetable>(`/timetables?section=${encodeURIComponent(section)}`); }
export async function patchTimetableCell(timetableId: number, payload: { day: string; periodIndex: number; subjectId: string; faculty: string }) {
  return request<Timetable>(`/timetables/${timetableId}/cell`, { method: 'PATCH', body: payload });
}
