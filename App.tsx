import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { Theme, NotificationBubble, LeaveRequest, LeaveStatus, User, Subject, TimetableData, CalendarEvent, Announcement, UserRole } from './types';
import { MOCK_SUBJECTS, MOCK_TIMETABLE, MOCK_CALENDAR_EVENTS, MOCK_ANNOUNCEMENTS, MOCK_RESOURCES } from './constants';
import { getLeaves, createLeave, updateLeaveStatus as apiUpdateLeaveStatus } from './api';

// Import Layout Components
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import Login from './components/Login';
import Notification from './components/Notification';

// Import Page Components
import Home from './components/pages/Home';
import QuickChat from './components/pages/QuickChat';
import AIAssistant from './components/pages/AIAssistant';
import Links from './components/pages/Links';
import Reminder from './components/pages/Reminder';
import Settings from './components/pages/Settings';
import ApplyForLeave from './components/pages/ApplyForLeave';
// Fix: Renamed component import to avoid conflict with LeaveStatus type.
import LeaveStatusPage from './components/pages/LeaveStatus';
import LeaveApprovals from './components/pages/LeaveApprovals';
import LeaveBoard from './components/pages/LeaveBoard';
import Subjects from './components/pages/Subjects';
import Syllabus from './components/pages/Syllabus';
import TeacherProfiles from './components/pages/TeacherProfiles';
import Timetable from './components/pages/Timetable';
import Calendar from './components/pages/Calendar';
import CentralizedSyllabus from './components/pages/CentralizedSyllabus';
import Resources from './components/pages/Resources';
import Announcements from './components/pages/Announcements';
import Events from './components/pages/Events';
import BookReference from './components/pages/BookReference';
import AchievementOfStudents from './components/pages/AchievementOfStudents';
import Placeholder from './components/pages/Placeholder';

export default function App() {
    const [theme, setTheme] = useState<Theme>('system');
    const [activePage, setActivePage] = useState<string>('Home');
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [notificationBubbles, setNotificationBubbles] = useState<NotificationBubble[]>([]);
    const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>(MOCK_SUBJECTS);
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
    const [announcements, setAnnouncements] = useState<Announcement[]>(MOCK_ANNOUNCEMENTS);
    const [timetableData, setTimetableData] = useState<TimetableData>(() => {
        try {
            const savedData = localStorage.getItem('mycampus_timetable');
            return savedData ? JSON.parse(savedData) : MOCK_TIMETABLE;
        } catch (error) {
            console.error("Failed to parse timetable from localStorage", error);
            return MOCK_TIMETABLE;
        }
    });
    const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(() => {
        try {
            const savedEvents = localStorage.getItem('mycampus_events');
            return savedEvents ? JSON.parse(savedEvents) : MOCK_CALENDAR_EVENTS;
        } catch (error) {
            console.error("Failed to parse calendar events from localStorage", error);
            return MOCK_CALENDAR_EVENTS;
        }
    });

    // --- Theme Management ---
    useEffect(() => {
        const applyTheme = (t: Theme) => {
            if (t === 'dark' || (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        };
        applyTheme(theme);
    }, [theme]);

    // --- Timetable Management ---
    useEffect(() => {
        try {
            localStorage.setItem('mycampus_timetable', JSON.stringify(timetableData));
        } catch (error) {
            console.error("Failed to save timetable to localStorage", error);
        }
    }, [timetableData]);
    
     // --- Calendar Events Management ---
    useEffect(() => {
        try {
            localStorage.setItem('mycampus_events', JSON.stringify(calendarEvents));
        } catch (error) {
            console.error("Failed to save calendar events to localStorage", error);
        }
    }, [calendarEvents]);

    const handleAddEvent = useCallback((newEvent: Omit<CalendarEvent, 'id'>) => {
        setCalendarEvents(prev => [...prev, { ...newEvent, id: Date.now() }]);
    }, []);

    const handleUpdateEvent = useCallback((updatedEvent: CalendarEvent) => {
        setCalendarEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));
    }, []);

    const handleDeleteEvent = useCallback((id: number) => {
        setCalendarEvents(prev => prev.filter(e => e.id !== id));
    }, []);

    const handleTimetableUpdateSimple = useCallback((day: string, periodIndex: number, newSubjectId: string) => {
        const newSubject = MOCK_SUBJECTS.find(s => s.id.toString() === newSubjectId);
        if (!newSubject) return;

        setTimetableData(prevData => {
            const newDaySchedule = [...(prevData[day] || [])];
            newDaySchedule[periodIndex] = { subjectId: newSubject.id, faculty: newSubject.faculty };
            return {
                ...prevData,
                [day]: newDaySchedule
            };
        });
    }, []);

    // --- Notification Bubble Management ---
    const addNotificationBubble = useCallback((bubbleData: Omit<NotificationBubble, 'id' | 'timestamp'>) => {
        const newBubble: NotificationBubble = {
            id: Date.now(),
            timestamp: Date.now(),
            ...bubbleData,
        };
        setNotificationBubbles(prev => [newBubble, ...prev]);
        setTimeout(() => removeNotificationBubble(newBubble.id), 5000);
    }, []);

    const removeNotificationBubble = useCallback((id: number) => {
        setNotificationBubbles(prev => prev.filter(b => b.id !== id));
    }, []);

    // --- Leave Request Management ---
    const handleAddNewLeave = useCallback(async (newRequest: Omit<LeaveRequest, 'id'>) => {
        const requestWithId: LeaveRequest = { ...newRequest, id: Date.now() };
        try {
            const saved = await createLeave(requestWithId);
            setLeaveRequests(prev => [saved, ...prev]);
        } catch (e) {
            // Optimistic fallback
            setLeaveRequests(prev => [requestWithId, ...prev]);
        }
    }, []);

    const handleUpdateRequestStatus = useCallback(async (id: number, status: LeaveStatus) => {
        try {
            const updated = await apiUpdateLeaveStatus(id, status);
            setLeaveRequests(prev => prev.map(r => r.id === id ? updated : r));
        } catch (e) {
            setLeaveRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
        }
    }, []);

    // Fetch leaves on login based on role
    useEffect(() => {
        const fetchLeaves = async () => {
            if (!currentUser) return;
            try {
                if (currentUser.role === ('STUDENT' as UserRole)) {
                    const data = await getLeaves({ mine: true, studentId: currentUser.id });
                    setLeaveRequests(data);
                } else if (currentUser.role === ('MENTOR' as UserRole)) {
                    const data = await getLeaves({ status: 'Pending', mentorName: currentUser.name });
                    setLeaveRequests(data);
                } else {
                    // For Admin/Teacher: fetch all for now
                    const data = await getLeaves();
                    setLeaveRequests(data);
                }
            } catch (e) {
                // keep existing state on error
            }
        };
        fetchLeaves();
    }, [currentUser]);

    const pendingApprovals = useMemo(() => {
        if (currentUser?.role !== 'MENTOR' as UserRole) return 0;
        return leaveRequests.filter(r => r.mentorName === currentUser.name && r.status === 'Pending').length;
    }, [leaveRequests, currentUser]);
    
    // --- Subject Management ---
    const handleUpdateSubject = useCallback((subjectId: number, newChapters: string) => {
        setSubjects(prev =>
            prev.map(sub =>
                sub.id === subjectId ? { ...sub, ongoingChapters: newChapters } : sub
            )
        );
    }, []);

    const handleMarkAnnouncementAsRead = useCallback((id: number) => {
        setAnnouncements(prev => prev.map(ann => ann.id === id ? { ...ann, isRead: true } : ann));
    }, []);

    // --- Auth & Navigation ---
    const handleLogin = useCallback((partialUser: Partial<User> & { role: UserRole }) => {
        const { role, name } = partialUser;
        if (!name) return;

        const userMap: { [key in Exclude<UserRole, 'STUDENT'>]?: Partial<Omit<User, 'role' | 'name' | 'subjectHandled'>> } = {
            ['ADMIN' as UserRole]: { id: 'ADM-00001', department: 'Administration' },
            ['MENTOR' as UserRole]: { id: 'MENT-98765', department: 'Student Affairs' },
            ['TEACHER' as UserRole]: { department: 'Faculty' },
        };
        
        const defaults = role === ('STUDENT' as UserRole)
            ? { department: 'CSBS' }
            : userMap[role as Exclude<UserRole, 'STUDENT'>] || {};
        
        const finalUser: User = {
            ...defaults,
            ...partialUser,
            id: partialUser.id || (defaults as User).id!,
            name: partialUser.name!,
            department: partialUser.department || (defaults as User).department!,
            role: partialUser.role,
        };
        
        setCurrentUser(finalUser);
        setActivePage('Home');
    }, []);

    const handleLogout = useCallback(() => {
        setCurrentUser(null);
    }, []);

    const handleNavigation = useCallback((page: string) => {
        if (page === 'Logout') {
            handleLogout();
        } else {
            setActivePage(page);
        }
        setMobileMenuOpen(false);
    }, [handleLogout]);

    if (!currentUser) {
        return <Login onLogin={handleLogin} />;
    }

    const renderPage = () => {
        switch (activePage) {
            case 'Home': return <Home timetable={timetableData} onNavigate={handleNavigation} />;
            case 'Quick Chat': return <QuickChat currentUser={currentUser} />;
            case 'AI Assistant': return <AIAssistant />;
            case 'Links': return <Links />;
            case 'Reminder': return <Reminder />;
            case 'Setting': return <Settings theme={theme} setTheme={setTheme} />;
            case 'Apply for Leave': return <ApplyForLeave onNotification={addNotificationBubble} onNewLeaveRequest={handleAddNewLeave} currentUser={currentUser} />;
            // Fix: Use the renamed component to resolve naming conflict.
            case 'Leave Status': return <LeaveStatusPage leaveRequests={leaveRequests} currentUser={currentUser} />;
            case 'Leave Approvals': return <LeaveApprovals leaveRequests={leaveRequests} currentUser={currentUser} onUpdateRequestStatus={handleUpdateRequestStatus} />;
            case 'Leave Board': return <LeaveBoard leaveRequests={leaveRequests} />;
            case 'Subjects': 
                return selectedSubject ? (
                    <Syllabus subject={selectedSubject} onBack={() => setSelectedSubject(null)} />
                ) : (
                    <Subjects subjects={subjects} currentUser={currentUser} onUpdateSubject={handleUpdateSubject} onSelectSyllabus={setSelectedSubject} />
                );
            case 'Syllabus': return <CentralizedSyllabus />;
            case 'Teacher Profile': return <TeacherProfiles />;
            case 'Timetable': return <Timetable timetable={timetableData} currentUser={currentUser} onUpdate={handleTimetableUpdateSimple} />;
            case 'Calendar': return <Calendar currentUser={currentUser} events={calendarEvents} onAddEvent={handleAddEvent} onUpdateEvent={handleUpdateEvent} onDeleteEvent={handleDeleteEvent} />;
            case 'Resources': return <Resources resources={MOCK_RESOURCES} subjects={subjects} />;
            case 'Announcements': return <Announcements announcements={announcements} onMarkAsRead={handleMarkAnnouncementAsRead} />;
            case 'Events': return <Events />;
            case 'Book Reference': return <BookReference />;
            case 'Achievement of Students': return <AchievementOfStudents />;
            default: return <Placeholder title={activePage} />;
        }
    };
    
    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
            <Sidebar 
              user={currentUser} 
              activePage={activePage} 
              onNavigate={handleNavigation} 
              isMobileMenuOpen={isMobileMenuOpen}
              setMobileMenuOpen={setMobileMenuOpen}
              pendingApprovals={pendingApprovals}
            />
            <div className="flex-1 flex flex-col md:ml-64">
                <Header 
                  pageTitle={activePage} 
                  onMenuClick={() => setMobileMenuOpen(true)}
                  pendingApprovals={pendingApprovals} 
                  onNavigate={handleNavigation}
                />
                
                <main className="flex-1 p-6 overflow-y-auto pb-20 md:pb-6">
                    {renderPage()}
                </main>
            </div>
            <BottomNav
                userRole={currentUser.role}
                activePage={activePage}
                onNavigate={handleNavigation}
                onMenuClick={() => setMobileMenuOpen(true)}
            />
            <Notification bubbles={notificationBubbles} onDismiss={removeNotificationBubble} />
        </div>
    );
}