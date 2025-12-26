import React, { ReactElement } from 'react';
import { UserRole, LeaveType, EventType, ResourceType, CampusEvent } from './types';
import type { NavigationItem, LinkItem, Reminder, ChatMessage, LeaveRequest, Subject, TeacherProfile, TimetableData, Student, CalendarEvent, Syllabus, Announcement, Resource, BookReference, StudentAchievement } from './types';

// Icon Components
const Icon = ({ path, className }: { path: string, className: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
);

// Fix: Replaced JSX.Element with ReactElement.
const NAV_ICONS: { [key: string]: (props: { className: string }) => ReactElement } = {
    Dashboard: (props) => <Icon {...props} path="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />,
    Home: (props) => <Icon {...props} path="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />,
    AIAssistant: (props) => <Icon {...props} path="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />,
    QuickChat: (props) => <Icon {...props} path="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />,
    Calendar: (props) => <Icon {...props} path="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />,
    ApplyForLeave: (props) => <Icon {...props} path="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />,
    LeaveStatus: (props) => <Icon {...props} path="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 9h.01" />,
    LeaveApprovals: (props) => <Icon {...props} path="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />,
    LeaveBoard: (props) => <Icon {...props} path="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2V4a2 2 0 012-2h8a2 2 0 012 2v4z" />,
    Attendance: (props) => <Icon {...props} path="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a3.004 3.004 0 015.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />,
    Subjects: (props) => <Icon {...props} path="M12 6.253v11.494m-9-5.747h18" />,
    Timetable: (props) => <Icon {...props} path="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
    Syllabus: (props) => <Icon {...props} path="M12 6.253v11.494m-9-5.747h18" />,
    Resources: (props) => <Icon {...props} path="M4 6h16M4 10h16M4 14h16M4 18h16" />,
    BookReference: (props) => <Icon {...props} path="M12 6.253v11.494m-9-5.747h18" />,
    Announcements: (props) => <Icon {...props} path="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-3.174 7.625-7.25V3" />,
    Events: (props) => <Icon {...props} path="M12 6.253v11.494m-9-5.747h18" />,
    AchievementOfStudents: (props) => <Icon {...props} path="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />,
    Result: (props) => <Icon {...props} path="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />,
    FeesPayment: (props) => <Icon {...props} path="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />,
    TeacherProfile: (props) => <Icon {...props} path="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />,
    PerformanceAnalytics: (props) => <Icon {...props} path="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />,
    Setting: (props) => <Icon {...props} path="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066 2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z" />,
    Links: (props) => <Icon {...props} path="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />,
    Reminder: (props) => <Icon {...props} path="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />,
    Logout: (props) => <Icon {...props} path="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />,
};

const ALL_ROLES = [UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT, UserRole.MENTOR];
const TEACHER_ADMIN_ROLES = [UserRole.ADMIN, UserRole.TEACHER];
const LEAVE_BOARD_ROLES = [UserRole.STUDENT, UserRole.TEACHER, UserRole.MENTOR];

export const NAVIGATION_ITEMS: NavigationItem[] = [
    { name: 'Home', icon: NAV_ICONS.Home, roles: ALL_ROLES },
    { name: 'AI Assistant', icon: NAV_ICONS.AIAssistant, roles: ALL_ROLES },
    { name: 'Quick Chat', icon: NAV_ICONS.QuickChat, roles: ALL_ROLES },
    { name: 'Calendar', icon: NAV_ICONS.Calendar, roles: ALL_ROLES },
    { name: 'Apply for Leave', icon: NAV_ICONS.ApplyForLeave, roles: [UserRole.STUDENT] },
    { name: 'Leave Status', icon: NAV_ICONS.LeaveStatus, roles: [UserRole.STUDENT] },
    { name: 'Leave Board', icon: NAV_ICONS.LeaveBoard, roles: LEAVE_BOARD_ROLES },
    { name: 'Leave Approvals', icon: NAV_ICONS.LeaveApprovals, roles: [UserRole.MENTOR] },
    { name: 'Attendance', icon: NAV_ICONS.Attendance, roles: TEACHER_ADMIN_ROLES },
    { name: 'Subjects', icon: NAV_ICONS.Subjects, roles: ALL_ROLES },
    { name: 'Timetable', icon: NAV_ICONS.Timetable, roles: ALL_ROLES },
    { name: 'Syllabus', icon: NAV_ICONS.Syllabus, roles: ALL_ROLES },
    { name: 'Resources', icon: NAV_ICONS.Resources, roles: ALL_ROLES },
    { name: 'Book Reference', icon: NAV_ICONS.BookReference, roles: ALL_ROLES },
    { name: 'Announcements', icon: NAV_ICONS.Announcements, roles: ALL_ROLES },
    { name: 'Events', icon: NAV_ICONS.Events, roles: ALL_ROLES },
    { name: 'Achievement of Students', icon: NAV_ICONS.AchievementOfStudents, roles: ALL_ROLES },
    { name: 'Result', icon: NAV_ICONS.Result, roles: [UserRole.STUDENT, UserRole.ADMIN] },
    { name: 'Fees Payment', icon: NAV_ICONS.FeesPayment, roles: [UserRole.STUDENT, UserRole.ADMIN] },
    { name: 'Teacher Profile', icon: NAV_ICONS.TeacherProfile, roles: ALL_ROLES },
    { name: 'Performance Analytics', icon: NAV_ICONS.PerformanceAnalytics, roles: [UserRole.ADMIN] },
    { name: 'Setting', icon: NAV_ICONS.Setting, roles: ALL_ROLES },
    { name: 'Links', icon: NAV_ICONS.Links, roles: ALL_ROLES },
    { name: 'Reminder', icon: NAV_ICONS.Reminder, roles: ALL_ROLES },
    { name: 'Logout', icon: NAV_ICONS.Logout, roles: ALL_ROLES },
];

export const BOTTOM_NAV_NAMES = ['Home', 'AI Assistant', 'Quick Chat', 'Reminder'];

export const MOCK_LINKS: LinkItem[] = [
  { title: 'NCERT', url: 'https://ncert.nic.in/', description: 'National Council of Educational Research and Training.', category: 'Academic' },
  { title: 'SWAYAM', url: 'https://swayam.gov.in/', description: 'Free online courses from top Indian universities.', category: 'Academic' },
  { title: 'DigiLocker', url: 'https://digilocker.gov.in/', description: 'Secure cloud platform for storage, sharing and verification of documents.', category: 'General' },
  { title: 'Institute Portal', url: '#', description: 'Access the main student and faculty portal.', category: 'Institute' },
  { title: 'Library Catalog', url: '#', description: 'Search for books and resources in the institute library.', category: 'Institute' },
];

export const MOCK_REMINDERS: Reminder[] = [
  { id: 1, title: 'Submit Physics Assignment', dueDate: 'Tomorrow', completed: false },
  { id: 2, title: 'Pay Semester Fees', dueDate: 'In 3 days', completed: false },
  { id: 3, title: 'Prepare for Mid-term Exams', dueDate: 'Next week', completed: false },
  { id: 4, title: 'Attend Coding Club meeting', dueDate: 'Today', completed: true },
];

export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
  { id: 1, sender: 'assistant', text: 'Hey, did you check the new timetable?', timestamp: '10:00 AM' },
  { id: 2, sender: 'me', text: 'Not yet, is it updated on the portal?', timestamp: '10:01 AM' },
  { id: 3, sender: 'assistant', text: 'Yes, I just saw it. Here is the link: https://example.com/timetable.pdf', timestamp: '10:01 AM' },
  { id: 4, sender: 'me', text: 'Thanks! That\'s helpful.', timestamp: '10:02 AM' },
];

export const MOCK_MENTORS = ['Seema Mam', 'Tamilarasu Sir', 'Priya Mam'];

export const MOCK_LEAVE_REQUESTS: LeaveRequest[] = [
    {
        id: 1,
        studentName: 'Rohan Verma',
        studentId: 'STU-12346',
        department: 'CSBS',
        mentorName: 'Seema Mam',
        parentPhone: '9876543211',
        leaveType: LeaveType.SICK,
        fromDate: '2024-08-05',
        toDate: '2024-08-05',
        totalDays: 1,
        reason: 'Fever and cold.',
        status: 'Approved',
    },
    {
        id: 2,
        studentName: 'Anjali Sharma',
        studentId: 'STU-004',
        department: 'CSBS',
        mentorName: 'Seema Mam',
        parentPhone: '9876543210',
        leaveType: LeaveType.CASUAL,
        fromDate: '2024-08-10',
        toDate: '2024-08-11',
        totalDays: 2,
        reason: 'Attending a family function in another city. Will be back by Monday.',
        status: 'Pending',
    },
    {
        id: 3,
        studentName: 'Anjali Sharma',
        studentId: 'STU-004',
        department: 'CSBS',
        mentorName: 'Seema Mam',
        parentPhone: '9876543210',
        leaveType: LeaveType.ON_DUTY,
        fromDate: '2024-07-22',
        toDate: '2024-07-22',
        totalDays: 1,
        reason: 'Participating in Inter-school science fair.',
        status: 'Approved',
    },
    {
        id: 4,
        studentName: 'Anjali Sharma',
        studentId: 'STU-004',
        department: 'CSBS',
        mentorName: 'Priya Mam',
        parentPhone: '9876543210',
        leaveType: LeaveType.SICK,
        fromDate: '2024-07-15',
        toDate: '2024-07-16',
        totalDays: 2,
        reason: 'Stomach infection.',
        status: 'Approved',
    },
];

export const MOCK_STUDENTS: Student[] = [
  { rollNo: 'STU-001', name: 'Aarav', username: 'aarav', password: 'Aarav@123' },
  { rollNo: 'STU-002', name: 'Aisha', username: 'aisha', password: 'Aisha@123' },
  { rollNo: 'STU-003', name: 'Alfred', username: 'alfred', password: 'Alfred@123' },
  { rollNo: 'STU-004', name: 'Anjali Sharma', username: 'anjalisharma', password: 'Anjali Sharma@123' },
  { rollNo: 'STU-005', name: 'Arjun', username: 'arjun', password: 'Arjun@123' },
  { rollNo: 'STU-006', name: 'Dhivakar', username: 'dhivakar', password: 'Dhivakar@123' },
  { rollNo: 'STU-007', name: 'Dinesh', username: 'dinesh', password: 'Dinesh@123' },
  { rollNo: 'STU-008', name: 'Divya', username: 'divya', password: 'Divya@123' },
  { rollNo: 'STU-009', name: 'Inba', username: 'inba', password: 'Inba@123' },
  { rollNo: 'STU-010', name: 'Ishaan', username: 'ishaan', password: 'Ishaan@123' },
  { rollNo: 'STU-011', name: 'Joel', username: 'joel', password: 'Joel@123' },
  { rollNo: 'STU-012', name: 'Kavya', username: 'kavya', password: 'Kavya@123' },
  { rollNo: 'STU-013', name: 'Keerthana', username: 'keerthana', password: 'Keerthana@123' },
  { rollNo: 'STU-014', name: 'Lourdhu Sathish', username: 'lourdhusathish', password: 'Lourdhu Sathish@123' },
  { rollNo: 'STU-015', name: 'Meera', username: 'meera', password: 'Meera@123' },
  { rollNo: 'STU-016', name: 'Mohammed Syfudeen', username: 'mohammedsyfudeen', password: 'Mohammed Syfudeen@123' },
  { rollNo: 'STU-017', name: 'Nishanth', username: 'nishanth', password: 'Nishanth@123' },
  { rollNo: 'STU-018', name: 'Priya', username: 'priya', password: 'Priya@123' },
  { rollNo: 'STU-019', name: 'Rahul', username: 'rahul', password: 'Rahul@123' },
  { rollNo: 'STU-020', name: 'Robert Mithran', username: 'robertmithran', password: 'Robert Mithran@123' },
  { rollNo: 'STU-021', name: 'Rohan', username: 'rohan', password: 'Rohan@123' },
  { rollNo: 'STU-022', name: 'Sameer', username: 'sameer', password: 'Sameer@123' },
  { rollNo: 'STU-023', name: 'Sanjay', username: 'sanjay', password: 'Sanjay@123' },
  { rollNo: 'STU-024', name: 'Saran', username: 'saran', password: 'Saran@123' },
  { rollNo: 'STU-025', name: 'Sneha', username: 'sneha', password: 'Sneha@123' },
  { rollNo: 'STU-026', name: 'Tara', username: 'tara', password: 'Tara@123' },
  { rollNo: 'STU-027', name: 'Varun', username: 'varun', password: 'Varun@123' },
  { rollNo: 'STU-028', name: 'Vikram', username: 'vikram', password: 'Vikram@123' },
  { rollNo: 'STU-029', name: 'Vishwa', username: 'vishwa', password: 'Vishwa@123' },
  { rollNo: 'STU-030', name: 'Zara', username: 'zara', password: 'Zara@123' }
];

export const MOCK_SUBJECTS: Subject[] = [
    // Theory
    { id: 1, name: 'Business Statistics', faculty: 'Dr. S. Nanthitha', ongoingChapters: 'Unit 2: Probability\nUnit 3: Hypothesis Testing', type: 'Theory' },
    { id: 2, name: 'Foundation of Data Science', faculty: 'Ms. Padmapriya', ongoingChapters: 'Unit 1: Introduction to Data Science', type: 'Theory' },
    { id: 3, name: 'Full Stack Development', faculty: 'Dr. A. Priya', ongoingChapters: 'Unit 3: React Hooks\nUnit 4: State Management', type: 'Theory' },
    { id: 4, name: 'Financial and Cost Accounting', faculty: 'Dr. K. Kirishnamoorthy', ongoingChapters: 'Unit 2: Costing Methods', type: 'Theory' },
    { id: 5, name: 'Business Process Management', faculty: 'Ms. S. Hemalatha', ongoingChapters: 'Unit 2: Process Modeling', type: 'Theory' },
    { id: 6, name: 'Robotics', faculty: 'Dr. R. Saravanan', ongoingChapters: 'Unit 1: Fundamentals of Robotics', type: 'Theory' },
    // Labs
    { id: 7, name: 'Foundation of Data Science Lab', faculty: 'Mr. P. TamilArasu', ongoingChapters: 'Experiment 3: Data Visualization with Matplotlib', type: 'Lab' },
    { id: 8, name: 'Full Stack Development Lab', faculty: 'Ms. M. Divya', ongoingChapters: 'Experiment 5: Building a REST API with Node.js', type: 'Lab' },
];

export const MOCK_SYLLABUS: Syllabus[] = [
    {
        subjectId: 1,
        theoryContent: [
            { title: "Unit 1: Introduction", content: "Business statistics introduces the collection, classification, and tabulation of data. Students learn about qualitative and quantitative data, graphical representation, and statistical tables. The unit provides the foundation for interpreting real-world business problems using numbers." },
            { title: "Unit 2: Measures of Central Tendency & Dispersion", content: "Focuses on measures of central tendency like mean, median, and mode, alongside measures of dispersion such as range, variance, and standard deviation. Practical examples demonstrate how these tools summarize data for decision-making in business scenarios." },
            { title: "Unit 3: Correlation, Regression & Probability", content: "Covers correlation and regression to understand relationships between variables, along with probability theory and common distributions. Students practice applying probability in uncertain conditions and forecasting outcomes in business operations." },
            { title: "Unit 4: Hypothesis Testing", content: "Emphasizes hypothesis testing using t-tests, chi-square tests, and ANOVA. Students learn to construct and test assumptions about population data, analyze variance, and validate research findings with real business applications." },
            { title: "Unit 5: Business Forecasting", content: "Business forecasting using time series analysis, index numbers, and trend estimation. Students gain skills to predict demand, sales, or market growth, helping organizations in planning and strategic decision-making." },
        ]
    },
    {
        subjectId: 2,
        theoryContent: [
            { title: "Unit 1: Introduction to Data Science", content: "Provides an overview of the data science lifecycle, covering collection, cleaning, processing, analysis, and visualization. Students also learn Python basics, Jupyter notebooks, and Numpy to prepare for hands-on applications in data-driven problem-solving." },
            { title: "Unit 2: Data Wrangling and Visualization", content: "Focuses on Pandas and data wrangling techniques to clean, transform, and preprocess datasets. Students handle missing values, outliers, and learn visualization methods that provide meaningful insights into complex datasets for analysis." },
            { title: "Unit 3: Probability and Statistics", content: "Introduces probability, descriptive statistics, and sampling distributions. Students apply probability models, study random variables, and practice statistical inference techniques to build confidence in making decisions under uncertainty." },
            { title: "Unit 4: Machine Learning Fundamentals", content: "Introduces machine learning basics including supervised and unsupervised learning. Students implement regression, classification, and clustering models while learning how to evaluate model performance and interpret predictions for business applications." },
            { title: "Unit 5: Big Data and Ethics", content: "Discusses big data concepts, cloud computing integration, ethical issues in data science, and real-world case studies. Students understand the impact of data science on modern industries like healthcare, finance, and e-commerce." },
        ]
    },
    {
        subjectId: 3,
        theoryContent: [
            { title: "Unit 1: Node.js and Express", content: "Covers fundamentals of Node.js and Express framework, setting up servers, handling requests, building REST APIs, and implementing middleware. Students learn the importance of networks and backend architecture for scalable web development." },
            { title: "Unit 2: MongoDB", content: "Introduces MongoDB, data modeling, schema design, and CRUD operations. Students explore indexing, aggregation pipelines, and database optimization techniques to build efficient, high-performance backend systems." },
            { title: "Unit 3: React Fundamentals", content: "Explores React fundamentals, including component-based design, hooks for state management, event handling, and routing. Students build interactive user interfaces that connect seamlessly with backend APIs." },
            { title: "Unit 4: Authentication and Authorization", content: "Focuses on authentication and authorization using JWT, OAuth, and secure cookie sessions. Students learn security practices like password hashing, encryption, and access control for full-stack applications." },
            { title: "Unit 5: Deployment", content: "Teaches deployment strategies, including Docker, CI/CD pipelines, and hosting on cloud platforms. Students gain experience in testing, monitoring, and scaling applications for real-world use." },
        ]
    },
    {
        subjectId: 4,
        theoryContent: [
            { title: "Unit 1: Accounting Fundamentals", content: "Introduces accounting principles, journal entries, ledger preparation, and trial balance. Students understand double-entry systems, accounting rules, and how businesses record and track financial transactions." },
            { title: "Unit 2: Final Accounts", content: "Focuses on preparation of final accounts, including profit and loss statements, balance sheets, and adjustments. Students analyze how financial performance and position are presented to stakeholders." },
            { title: "Unit 3: Cost Accounting Basics", content: "Covers cost accounting fundamentals such as material costing, labor costing, and overhead distribution. Students learn how to classify, record, and allocate costs for decision-making." },
            { title: "Unit 4: Marginal Costing and CVP Analysis", content: "Deals with marginal costing, cost-volume-profit analysis, and budgetary control. Students gain insight into break-even analysis and how managers use cost behavior for planning and control." },
            { title: "Unit 5: Advanced Costing", content: "Explores advanced topics like standard costing, variance analysis, and responsibility accounting. Students understand performance measurement and cost control techniques within business organizations." },
        ]
    },
    {
        subjectId: 5,
        theoryContent: [
            { title: "Unit 1: Introduction to BPM", content: "Introduces BPM concepts, process identification, modeling techniques, and analysis. Students understand how organizations map business workflows for improvement and efficiency." },
            { title: "Unit 2: BPM Lifecycle", content: "Explains the BPM lifecycle including design, execution, monitoring, and optimization. Students learn continuous improvement practices applied to modern enterprises." },
            { title: "Unit 3: Workflow Automation", content: "Focuses on workflow automation and BPM software tools. Students study real-world case studies where automation improved efficiency, accuracy, and compliance." },
            { title: "Unit 4: Governance and Compliance", content: "Covers governance, risk management, and compliance in BPM. Students analyze frameworks and strategies that ensure businesses operate within regulations and standards." },
            { title: "Unit 5: BPM and Digital Transformation", content: "Discusses BPM’s role in digital transformation, integrating AI, cloud platforms, and new technologies. Students evaluate how BPM supports innovation and agility." },
        ]
    },
    {
        subjectId: 6,
        theoryContent: [
            { title: "Unit 1: Introduction to Robotics", content: "Introduces robotics history, classifications, and applications in various industries. Students explore robot structures, basic components, and future prospects." },
            { title: "Unit 2: Robot Components", content: "Covers sensors, actuators, controllers, and signal processing. Students learn how hardware and software interact to create robotic functionality." },
            { title: "Unit 3: Kinematics and Dynamics", content: "Explains forward and inverse kinematics, dynamics, and trajectory planning. Students understand the mathematics and motion planning behind robot movement." },
            { title: "Unit 4: Control Systems and Vision", content: "Focuses on control systems, machine vision, and AI integration. Students design control algorithms and explore how robots adapt to environments." },
            { title: "Unit 5: Industrial Robotics", content: "Highlights industrial robotics, safety standards, and advanced trends. Students evaluate real-world case studies on robotics applications in healthcare, manufacturing, and service industries." },
        ]
    },
    {
        subjectId: 7,
        labContent: [
            "Python Basics & Data Types",
            "Numpy Arrays and Operations",
            "Pandas DataFrames",
            "Data Cleaning & Preprocessing",
            "Data Visualization with Matplotlib",
            "Probability & Statistics Applications",
            "Regression Model Implementation",
            "Classification Model Implementation",
            "Clustering Techniques",
            "Mini Data Science Project"
        ]
    },
    {
        subjectId: 8,
        labContent: [
            "Setup Node & React Environment",
            "Create REST API with Express",
            "MongoDB CRUD Operations",
            "Build React Components",
            "Implement React Routing",
            "State Management with Hooks",
            "Authentication with JWT",
            "File Upload & Handling",
            "Deploy Node & React App on Cloud",
            "Final Full Stack Project"
        ]
    }
];


export const MOCK_TEACHERS: TeacherProfile[] = [
    { id: 'T-BS', name: 'Dr. S. Nanthitha', subject: 'Business Statistics', dob: '1980-05-15', education: 'Ph.D. in Statistics', username: 'nanthitha' },
    { id: 'T-FDS', name: 'Ms. Padmapriya', subject: 'Foundation of Data Science', dob: '1985-11-20', education: 'M.Tech in Computer Science', username: 'padmapriya' },
    { id: 'T-FSD', name: 'Dr. A. Priya', subject: 'Full Stack Development', dob: '1982-02-10', education: 'Ph.D. in Computer Applications', username: 'apriya' },
    { id: 'T-FCA', name: 'Dr. K. Kirishnamoorthy', subject: 'Financial and Cost Accounting', dob: '1975-08-25', education: 'Ph.D. in Commerce', username: 'krishnamoorthy' },
    { id: 'T-BPM', name: 'Ms. S. Hemalatha', subject: 'Business Process Management', dob: '1988-07-30', education: 'MBA', username: 'hemalatha' },
    { id: 'T-ROB', name: 'Dr. R. Saravanan', subject: 'Robotics', dob: '1978-01-05', education: 'Ph.D. in Mechanical Engineering', username: 'saravanan' },
    { id: 'T-FDSL', name: 'Mr. P. TamilArasu', subject: 'Foundation of Data Science Lab', dob: '1990-03-12', education: 'M.E. in Computer Science', username: 'tamilarasu' },
    { id: 'T-FSDL', name: 'Ms. M. Divya', subject: 'Full Stack Development Lab', dob: '1991-09-18', education: 'M.Tech in Information Technology', username: 'divya' },
];

export const TIMETABLE_STRUCTURE = {
    periods: [
        { time: '8:40 – 9:30', type: 'period' },
        { time: '9:30 – 10:20', type: 'period' },
        { time: '10:20 – 10:35', type: 'break' },
        { time: '10:35 – 11:25', type: 'period' },
        { time: '11:25 – 12:15', type: 'period' },
        { time: '12:15 – 12:55', type: 'lunch' },
        { time: '12:55 – 1:45', type: 'period' },
        { time: '1:45 – 2:35', type: 'period' },
        { time: '2:35 – 2:50', type: 'break' },
        { time: '2:50 – 3:40', type: 'period' },
        { time: '3:40 – 4:25', type: 'period' },
    ],
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
};

export const MOCK_TIMETABLE: TimetableData = {
    Monday: [
        { subjectId: 1, faculty: 'Dr. S. Nanthitha' }, { subjectId: 2, faculty: 'Ms. Padmapriya' }, 'Break',
        { subjectId: 3, faculty: 'Dr. A. Priya' }, { subjectId: 4, faculty: 'Dr. K. Kirishnamoorthy' }, 'Lunch',
        { subjectId: 5, faculty: 'Ms. S. Hemalatha' }, { subjectId: 6, faculty: 'Dr. R. Saravanan' }, 'Break',
        { subjectId: 7, faculty: 'Mr. P. TamilArasu' }, { subjectId: 7, faculty: 'Mr. P. TamilArasu' }
    ],
    Tuesday: [
        { subjectId: 3, faculty: 'Dr. A. Priya' }, { subjectId: 1, faculty: 'Dr. S. Nanthitha' }, 'Break',
        { subjectId: 2, faculty: 'Ms. Padmapriya' }, { subjectId: 5, faculty: 'Ms. S. Hemalatha' }, 'Lunch',
        { subjectId: 4, faculty: 'Dr. K. Kirishnamoorthy' }, { subjectId: 8, faculty: 'Ms. M. Divya' }, 'Break',
        { subjectId: 8, faculty: 'Ms. M. Divya' }, { subjectId: 6, faculty: 'Dr. R. Saravanan' }
    ],
    Wednesday: [
        { subjectId: 2, faculty: 'Ms. Padmapriya' }, { subjectId: 4, faculty: 'Dr. K. Kirishnamoorthy' }, 'Break',
        { subjectId: 6, faculty: 'Dr. R. Saravanan' }, { subjectId: 1, faculty: 'Dr. S. Nanthitha' }, 'Lunch',
        { subjectId: 3, faculty: 'Dr. A. Priya' }, { subjectId: 5, faculty: 'Ms. S. Hemalatha' }, 'Break',
        { subjectId: 7, faculty: 'Mr. P. TamilArasu' }, { subjectId: 7, faculty: 'Mr. P. TamilArasu' }
    ],
    Thursday: [
        { subjectId: 5, faculty: 'Ms. S. Hemalatha' }, { subjectId: 3, faculty: 'Dr. A. Priya' }, 'Break',
        { subjectId: 1, faculty: 'Dr. S. Nanthitha' }, { subjectId: 2, faculty: 'Ms. Padmapriya' }, 'Lunch',
        { subjectId: 7, faculty: 'Mr. P. TamilArasu' }, { subjectId: 7, faculty: 'Mr. P. TamilArasu' }, 'Break',
        { subjectId: 6, faculty: 'Dr. R. Saravanan' }, { subjectId: 4, faculty: 'Dr. K. Kirishnamoorthy' }
    ],
    Friday: [
        { subjectId: 6, faculty: 'Dr. R. Saravanan' }, { subjectId: 5, faculty: 'Ms. S. Hemalatha' }, 'Break',
        { subjectId: 4, faculty: 'Dr. K. Kirishnamoorthy' }, { subjectId: 3, faculty: 'Dr. A. Priya' }, 'Lunch',
        { subjectId: 2, faculty: 'Ms. Padmapriya' }, { subjectId: 1, faculty: 'Dr. S. Nanthitha' }, 'Break',
        { subjectId: 8, faculty: 'Ms. M. Divya' }, { subjectId: 8, faculty: 'Ms. M. Divya' }
    ],
    Saturday: [
        { subjectId: 7, faculty: 'Mr. P. TamilArasu' }, { subjectId: 8, faculty: 'Ms. M. Divya' }, 'Break',
        { subjectId: 1, faculty: 'Dr. S. Nanthitha' }, { subjectId: 3, faculty: 'Dr. A. Priya' }, 'Lunch',
        { subjectId: 4, faculty: 'Dr. K. Kirishnamoorthy' }, { subjectId: 6, faculty: 'Dr. R. Saravanan' }, 'Break',
        { subjectId: 5, faculty: 'Ms. S. Hemalatha' }, { subjectId: 2, faculty: 'Ms. Padmapriya' }
    ],
};

export const MOCK_CALENDAR_EVENTS: CalendarEvent[] = [
    { id: 1, title: 'Muharram', start: '2025-07-06', type: EventType.HOLIDAY },
    { id: 2, title: 'Opening Day', start: '2025-07-14', type: EventType.ACADEMIC, description: 'Opening Day for II & III Year (UG & PG) Programmes' },
    { id: 3, title: 'Independence Day', start: '2025-08-15', type: EventType.HOLIDAY },
    { id: 4, title: 'Krishna Jayanthi', start: '2025-08-16', type: EventType.HOLIDAY },
    { id: 5, title: '1st Portal Attendance Period Ends', start: '2025-08-23', type: EventType.ACADEMIC, description: 'Portal attendance period from 03-07-25 to 22-08-25.' },
    { id: 6, title: 'Vinayaka Chathurthi', start: '2025-08-27', type: EventType.HOLIDAY },
    { id: 7, title: 'CIA I', start: '2025-08-28', end: '2025-09-02', type: EventType.INTERNAL_TEST, description: 'Continuous Internal Assessment I' },
    { id: 8, title: 'Milad-Un-Nabi', start: '2025-09-05', type: EventType.HOLIDAY },
    { id: 9, title: 'Ayutha Pooja', start: '2025-10-01', type: EventType.HOLIDAY },
    { id: 10, title: 'Vijaya Dasami & Gandhi Jeyanthi', start: '2025-10-02', type: EventType.HOLIDAY },
    { id: 11, title: '2nd Portal Attendance Period Ends', start: '2025-10-17', type: EventType.ACADEMIC, description: 'Portal attendance period from 03-07-25 to 16-10-25.' },
    { id: 12, title: 'Deepavali', start: '2025-10-20', type: EventType.HOLIDAY },
    { id: 13, title: 'CIA II', start: '2025-10-28', end: '2025-11-01', type: EventType.INTERNAL_TEST, description: 'Continuous Internal Assessment II' },
    { id: 14, title: 'Last Working Day', start: '2025-11-07', type: EventType.ACADEMIC },
    { id: 15, title: '3rd Portal Attendance Period Ends', start: '2025-11-12', type: EventType.ACADEMIC, description: 'Portal attendance period from 03-07-25 to 12-11-25.' },
    { id: 16, title: 'End Semester Practicals Exam', start: '2025-11-15', end: '2025-11-22', type: EventType.EXAM, description: 'End Semester Practical Exams' },
    { id: 18, title: 'End Semester Theory Exam', start: '2025-11-24', end: '2025-12-24', type: EventType.EXAM, description: 'End Semester Theory Exams' },
    { id: 20, title: 'Christmas', start: '2025-12-25', type: EventType.HOLIDAY },
];

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
    {
        id: 1,
        title: 'Mid-term Exam Schedule Published',
        date: '2025-08-15',
        content: 'The schedule for the upcoming mid-term examinations has been published. Please check the "Events" section for details.',
        postedBy: 'Admin Office',
        isRead: false
    },
    {
        id: 2,
        title: 'Annual Sports Day Registration',
        date: '2025-08-10',
        content: 'Registrations for the annual sports day events are now open. Interested students can register via the student portal before August 20th.',
        postedBy: 'Student Council',
        isRead: true
    },
    {
        id: 3,
        title: 'Library Closure for Maintenance',
        date: '2025-08-05',
        content: 'The central library will be closed on August 8th and 9th for annual maintenance. E-resources will remain accessible.',
        postedBy: 'Library Department',
        isRead: false
    },
    {
        id: 4,
        title: 'Holiday on Friday',
        date: '2025-09-04',
        content: 'Due to unforeseen circumstances, the institute will remain closed this Friday, 5th September 2025. All classes are cancelled.',
        postedBy: 'Admin Office',
        isRead: false,
    },
    {
        id: 5,
        title: 'Exam Syllabus Updated',
        date: '2025-09-01',
        content: 'The syllabus for the upcoming CIA II has been updated for the subjects of Business Statistics and Full Stack Development. Please check the syllabus section for more details.',
        postedBy: 'Academics Department',
        isRead: true,
    }
];

export const MOCK_EVENTS: CampusEvent[] = [
    {
        id: 1,
        title: 'Tech Fest 2025',
        date: '25th Sept, 2025',
        time: '10:00 AM onwards',
        description: 'A grand celebration of technology and innovation. Join us for coding competitions, project expos, guest lectures, and more.',
    },
    {
        id: 2,
        title: 'Annual Sports Meet',
        date: '1st Oct, 2025',
        time: '9:00 AM - 5:00 PM',
        description: 'Witness the spirit of sportsmanship. Participate in track and field events, team sports, and celebrate athletic excellence.',
    },
    {
        id: 3,
        title: 'Cultural Night: "AURA"',
        date: '10th Oct, 2025',
        time: '6:00 PM onwards',
        description: 'An evening filled with music, dance, drama, and art. Experience the vibrant cultural talent of our students.',
    },
    {
        id: 4,
        title: 'Alumni Meet & Greet',
        date: '22nd Oct, 2025',
        time: '4:00 PM - 7:00 PM',
        description: 'Reconnect with old friends and faculty. A wonderful opportunity to network and reminisce about your college days.',
    },
];

export const MOCK_RESOURCES: Resource[] = [
    { id: 1, subjectId: 1, title: 'Statistics for Business and Economics', type: ResourceType.BOOK, url: '#', description: 'A comprehensive guide to statistics in a business context.' },
    { id: 2, subjectId: 1, title: 'Unit 1 & 2 - Summary Notes', type: ResourceType.PDF, url: '#', description: 'Faculty-provided notes covering the first two units.' },
    { id: 3, subjectId: 2, title: 'Python for Data Analysis by Wes McKinney', type: ResourceType.BOOK, url: '#', description: 'Essential reading for learning data wrangling with pandas.' },
    { id: 4, subjectId: 2, title: 'Introduction to Data Science - Coursera', type: ResourceType.LINK, url: '#', description: 'A foundational online course on data science principles.' },
    { id: 5, subjectId: 3, title: 'React Official Documentation', type: ResourceType.LINK, url: '#', description: 'The official guide to learning React.' },
    { id: 6, subjectId: 3, title: 'Node.js Design Patterns', type: ResourceType.BOOK, url: '#', description: 'Learn how to build maintainable and scalable server-side applications.' },
    { id: 7, subjectId: 3, title: 'Express.js in Action', type: ResourceType.PDF, url: '#', description: 'A PDF copy of the popular book on Express.js.' },
    { id: 8, subjectId: 4, title: 'Financial Accounting For Dummies', type: ResourceType.BOOK, url: '#', description: 'An easy-to-understand introduction to financial accounting.' },
    { id: 9, subjectId: 5, title: 'Fundamentals of Business Process Management', type: ResourceType.PDF, url: '#', description: 'An academic textbook on BPM.' },
    { id: 10, subjectId: 7, title: 'DataCamp: Data Visualization with Matplotlib', type: ResourceType.LINK, url: '#', description: 'Interactive exercises for mastering Matplotlib.' },
];

export const MOCK_BOOK_REFERENCES: BookReference[] = [
    // Business Statistics
    { id: 1, subjectId: 1, title: 'Business Statistics: A First Course', author: 'David M. Levine', authorUrl: '#' },
    { id: 2, subjectId: 1, title: 'Statistics for Business & Economics', author: 'James T. McClave', authorUrl: '#' },
    // Foundation of Data Science
    { id: 3, subjectId: 2, title: 'Python for Data Analysis', author: 'Wes McKinney', authorUrl: '#' },
    { id: 4, subjectId: 2, title: 'Data Science from Scratch', author: 'Joel Grus', authorUrl: '#' },
    // Full Stack Development
    { id: 5, subjectId: 3, title: 'Eloquent JavaScript', author: 'Marijn Haverbeke', authorUrl: '#' },
    { id: 6, subjectId: 3, title: 'Learning React: Modern Patterns for Developing React Apps', author: 'Alex Banks & Eve Porcello', authorUrl: '#' },
    // Financial and Cost Accounting
    { id: 7, subjectId: 4, title: 'Financial Accounting For Dummies', author: 'Steven Collings', authorUrl: '#' },
    // Business Process Management
    { id: 8, subjectId: 5, title: 'Fundamentals of Business Process Management', author: 'Marlon Dumas', authorUrl: '#' },
    // Robotics
    { id: 9, subjectId: 6, title: 'Robotics, Vision and Control', author: 'Peter Corke', authorUrl: '#' },
];

export const MOCK_ACHIEVEMENTS: StudentAchievement[] = [
  { name: 'Arjun Kumar', dept: 'CSBS', leetCodeSolved: 150, hackathonWins: 2, projectsCompleted: 5, topic: 'Algorithms', domain: 'Competitive Prog' },
  { name: 'Priya Sharma', dept: 'CSBS', leetCodeSolved: 120, hackathonWins: 1, projectsCompleted: 4, topic: 'Data Structures', domain: 'AI/ML' },
  { name: 'Ravi Reddy', dept: 'CSBS', leetCodeSolved: 180, hackathonWins: 3, projectsCompleted: 6, topic: 'Web Development', domain: 'Full Stack' },
  { name: 'Sneha Nair', dept: 'CSBS', leetCodeSolved: 200, hackathonWins: 0, projectsCompleted: 7, topic: 'Database Systems', domain: 'Cloud Computing' },
  { name: 'Karthik Raj', dept: 'CSBS', leetCodeSolved: 90, hackathonWins: 1, projectsCompleted: 3, topic: 'IoT', domain: 'Embedded Systems' },
  { name: 'Anjali Verma', dept: 'CSBS', leetCodeSolved: 170, hackathonWins: 2, projectsCompleted: 5, topic: 'Machine Learning', domain: 'AI/ML' },
  { name: 'Vignesh Kumar', dept: 'CSBS', leetCodeSolved: 140, hackathonWins: 1, projectsCompleted: 4, topic: 'Mobile App Dev', domain: 'Android' },
  { name: 'Meera Joshi', dept: 'CSBS', leetCodeSolved: 110, hackathonWins: 0, projectsCompleted: 3, topic: 'Image Processing', domain: 'AI/ML' },
  { name: 'Hari Krishnan', dept: 'CSBS', leetCodeSolved: 160, hackathonWins: 2, projectsCompleted: 6, topic: 'Operating Systems', domain: 'Systems' },
  { name: 'Nithya Rao', dept: 'CSBS', leetCodeSolved: 130, hackathonWins: 1, projectsCompleted: 4, topic: 'Cloud Deployment', domain: 'Cloud Computing' },
  { name: 'Ashwin Singh', dept: 'CSBS', leetCodeSolved: 80, hackathonWins: 0, projectsCompleted: 2, topic: 'Robotics', domain: 'Embedded Systems' },
  { name: 'Divya Menon', dept: 'CSBS', leetCodeSolved: 190, hackathonWins: 3, projectsCompleted: 7, topic: 'Algorithms', domain: 'Competitive Prog' },
  { name: 'Suresh Balan', dept: 'CSBS', leetCodeSolved: 120, hackathonWins: 1, projectsCompleted: 4, topic: 'Web Development', domain: 'Full Stack' },
  { name: 'Lakshmi Iyer', dept: 'CSBS', leetCodeSolved: 140, hackathonWins: 2, projectsCompleted: 5, topic: 'Signal Processing', domain: 'AI/ML' },
  { name: 'Rohan Das', dept: 'CSBS', leetCodeSolved: 150, hackathonWins: 0, projectsCompleted: 6, topic: 'Database Systems', domain: 'Cloud Computing' },
  { name: 'Snehal Patil', dept: 'CSBS', leetCodeSolved: 110, hackathonWins: 1, projectsCompleted: 3, topic: 'Mobile App Dev', domain: 'Android' },
  { name: 'Aravind Kumar', dept: 'CSBS', leetCodeSolved: 170, hackathonWins: 2, projectsCompleted: 5, topic: 'Machine Learning', domain: 'AI/ML' },
  { name: 'Priyanka Rao', dept: 'CSBS', leetCodeSolved: 130, hackathonWins: 0, projectsCompleted: 4, topic: 'Image Processing', domain: 'AI/ML' },
  { name: 'Kiran Shetty', dept: 'CSBS', leetCodeSolved: 160, hackathonWins: 1, projectsCompleted: 6, topic: 'Web Development', domain: 'Full Stack' },
  { name: 'Deepa Nair', dept: 'CSBS', leetCodeSolved: 180, hackathonWins: 2, projectsCompleted: 7, topic: 'Algorithms', domain: 'Competitive Prog' },
  { name: 'Manish Gupta', dept: 'CSBS', leetCodeSolved: 90, hackathonWins: 0, projectsCompleted: 3, topic: 'IoT', domain: 'Embedded Systems' },
  { name: 'Ananya Sharma', dept: 'CSBS', leetCodeSolved: 140, hackathonWins: 1, projectsCompleted: 5, topic: 'Cloud Deployment', domain: 'Cloud Computing' },
  { name: 'Rohit Verma', dept: 'CSBS', leetCodeSolved: 150, hackathonWins: 2, projectsCompleted: 6, topic: 'Database Systems', domain: 'Cloud Computing' },
  { name: 'Swetha Reddy', dept: 'CSBS', leetCodeSolved: 120, hackathonWins: 1, projectsCompleted: 4, topic: 'Signal Processing', domain: 'AI/ML' },
  { name: 'Vishal Kumar', dept: 'CSBS', leetCodeSolved: 160, hackathonWins: 0, projectsCompleted: 5, topic: 'Web Development', domain: 'Full Stack' },
  { name: 'Reena Thomas', dept: 'CSBS', leetCodeSolved: 190, hackathonWins: 3, projectsCompleted: 7, topic: 'Machine Learning', domain: 'AI/ML' },
  { name: 'Ajay Singh', dept: 'CSBS', leetCodeSolved: 80, hackathonWins: 0, projectsCompleted: 2, topic: 'Robotics', domain: 'Embedded Systems' },
  { name: 'Nandini Iyer', dept: 'CSBS', leetCodeSolved: 130, hackathonWins: 1, projectsCompleted: 4, topic: 'Mobile App Dev', domain: 'Android' },
  { name: 'Aditya Reddy', dept: 'CSBS', leetCodeSolved: 170, hackathonWins: 2, projectsCompleted: 6, topic: 'Algorithms', domain: 'Competitive Prog' },
  { name: 'Megha Sharma', dept: 'CSBS', leetCodeSolved: 140, hackathonWins: 1, projectsCompleted: 5, topic: 'Signal Processing', domain: 'AI/ML' },
];