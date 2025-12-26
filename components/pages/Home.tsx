import React, { useState, useEffect, useMemo } from 'react';
import type { TimetableData } from '../../types';
import { MOCK_SUBJECTS, TIMETABLE_STRUCTURE, MOCK_ANNOUNCEMENTS } from '../../constants';
import { Card } from '../ui';

type HomeProps = {
    timetable: TimetableData;
    onNavigate: (page: string) => void;
};

const Home = ({ timetable, onNavigate }: HomeProps) => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const today = useMemo(() => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[currentTime.getDay()];
    }, [currentTime]);
    
    const todaysClasses = timetable[today] || [];
    
    const academicYear = `${currentTime.getFullYear()}-${(currentTime.getFullYear() + 1).toString().slice(2)}`;

    const ActionCard = ({ title, icon, pageName }: { title: string; icon: React.ReactNode; pageName: string }) => (
        <Card 
            className="p-4 flex flex-col items-center justify-center text-center hover:shadow-lg transition-shadow duration-300 cursor-pointer"
            onClick={() => onNavigate(pageName)}
        >
            {icon}
            <h3 className="mt-2 text-md font-semibold text-gray-800 dark:text-gray-200">{title}</h3>
        </Card>
    );

    return (
        <div className="space-y-6">
            {/* Top Banner */}
            <Card className="p-5 bg-indigo-50 dark:bg-indigo-900/40 border border-indigo-200 dark:border-indigo-800">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-indigo-900 dark:text-indigo-200">MyCampus</h1>
                        <p className="text-sm text-indigo-700 dark:text-indigo-300">Academic Year: {academicYear}</p>
                    </div>
                    <div className="text-right">
                         <p className="text-lg font-semibold text-indigo-900 dark:text-indigo-200">{currentTime.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                         <p className="text-sm text-indigo-700 dark:text-indigo-300">{currentTime.toLocaleTimeString()}</p>
                    </div>
                </div>
            </Card>

            {/* Today's Classes */}
            <Card>
                <div className="p-5">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Today's Classes</h2>
                     {todaysClasses.length > 0 && todaysClasses.some(c => c !== null) ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {TIMETABLE_STRUCTURE.periods.map((period, index) => {
                                const classInfo = todaysClasses[index];
                                if (classInfo === 'Break' || classInfo === 'Lunch') {
                                    return (
                                        <div key={index} className="p-4 text-center bg-gray-100 dark:bg-gray-700 rounded-lg">
                                            <p className="font-semibold text-gray-700 dark:text-gray-300">{classInfo}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{period.time}</p>
                                        </div>
                                    );
                                }
                                if (classInfo === null) {
                                    return null; // Don't show free periods
                                }
                                const subject = MOCK_SUBJECTS.find(s => typeof classInfo === 'object' && s.id === classInfo?.subjectId);
                                if (!subject) return null;
                                
                                return (
                                    <div key={index} className="p-4 bg-blue-50 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-700 rounded-lg">
                                        <p className="font-bold text-md text-blue-900 dark:text-blue-200 truncate">{subject.name}</p>
                                        <p className="text-sm text-blue-700 dark:text-blue-300 truncate">{subject.faculty}</p>
                                        <p className="text-sm font-semibold text-blue-800 dark:text-blue-200 mt-2">{period.time}</p>
                                    </div>
                                );
                            }).filter(Boolean)}
                        </div>
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400">No classes scheduled for today.</p>
                    )}
                </div>
            </Card>
            
            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                 <ActionCard 
                    title="Attendance"
                    pageName="Attendance"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a3.004 3.004 0 015.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
                />
                 <ActionCard 
                    title="Leave Board"
                    pageName="Leave Board"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2V4a2 2 0 012-2h8a2 2 0 012 2v4z" /></svg>}
                />
                <ActionCard 
                    title="Calendar"
                    pageName="Calendar"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                />
            </div>
            
            {/* Announcements */}
            <Card>
                <div className="p-5">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Announcements</h2>
                    <div className="space-y-4">
                        {MOCK_ANNOUNCEMENTS.slice(0, 3).map(announcement => (
                            <div key={announcement.id} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">{announcement.title}</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(announcement.date+'T00:00:00').toLocaleDateString()}</p>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{announcement.content}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default Home;
