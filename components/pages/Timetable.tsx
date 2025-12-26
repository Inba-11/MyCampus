import React, { useState, useMemo } from 'react';
import type { TimetableData, TimetableEntry, User } from '../../types';
import { UserRole } from '../../types';
import { Card } from '../ui';
import { MOCK_SUBJECTS, TIMETABLE_STRUCTURE } from '../../constants';

const TimetableCell = ({ cellData, day, periodIndex, currentUser, onUpdate }: { cellData: TimetableEntry, day: string, periodIndex: number, currentUser: User, onUpdate: (day: string, periodIndex: number, newSubjectId: string) => void }) => {
    const [isEditing, setIsEditing] = useState(false);
    
    const subject = useMemo(() => {
        if (typeof cellData === 'object' && cellData !== null) {
            return MOCK_SUBJECTS.find(s => s.id === cellData.subjectId);
        }
        return null;
    }, [cellData]);

    const canEdit = useMemo(() => {
        if (!subject) return currentUser.role === UserRole.ADMIN;
        return currentUser.role === UserRole.ADMIN || (currentUser.role === UserRole.TEACHER && subject.faculty === currentUser.name);
    }, [currentUser, subject]);

    const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onUpdate(day, periodIndex, e.target.value);
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <td className="p-1">
                <select 
                    defaultValue={subject?.id}
                    onChange={handleSubjectChange}
                    onBlur={() => setIsEditing(false)}
                    className="w-full h-full p-2 bg-white dark:bg-gray-700 border border-indigo-500 rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    autoFocus
                >
                    <option value="" disabled>Select Subject</option>
                    {MOCK_SUBJECTS.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                </select>
            </td>
        );
    }
    
    if (!subject) {
        const isBreak = cellData === 'Break' || cellData === 'Lunch';
        const cellText = cellData === 'Break' ? 'Break' : cellData === 'Lunch' ? 'Lunch' : '';
        const cellClasses = isBreak ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-medium' : 'bg-gray-50 dark:bg-gray-800';

        return (
            <td className={`text-center align-middle text-sm ${cellClasses}`}>
                {cellText}
            </td>
        );
    }

    const teacherInitials = subject.faculty.split(' ').map(n => n[0]).slice(0, 2).join('');
    const subjectShortName = subject.name.split(' ').map(n=>n[0]).join('').slice(0,4);

    return (
        <td className="border border-gray-200 dark:border-gray-700 p-2 text-center align-middle h-24 relative group">
            <div className="flex flex-col justify-center items-center h-full">
                <p className="font-bold text-sm text-gray-900 dark:text-white">{subjectShortName} - {teacherInitials}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 hidden lg:block">{subject.name}</p>
                <p className="text-xs text-indigo-500 dark:text-indigo-400 lg:hidden">{subject.faculty}</p>
            </div>
            {canEdit && (
                <button 
                    onClick={() => setIsEditing(true)} 
                    className="absolute top-1 right-1 p-1 bg-white dark:bg-gray-600 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Edit period"
                >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-700 dark:text-gray-200" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                </button>
            )}
        </td>
    );
};

type TimetablePageProps = {
    timetable: TimetableData;
    currentUser: User;
    onUpdate: (day: string, periodIndex: number, newSubjectId: string) => void;
};

const TimetablePage = ({ timetable, currentUser, onUpdate }: TimetablePageProps) => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Timetable</h1>
            <Card className="p-0 overflow-hidden">
                <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-gray-100 dark:bg-gray-700">
                                <th className="p-2 border border-gray-200 dark:border-gray-600 text-sm font-semibold text-gray-800 dark:text-gray-200">Day/Time</th>
                                {TIMETABLE_STRUCTURE.periods.map((p, i) => (
                                    <th key={i} className="p-2 border border-gray-200 dark:border-gray-600 text-sm font-semibold whitespace-nowrap text-gray-800 dark:text-gray-200">{p.time}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {TIMETABLE_STRUCTURE.days.map(day => (
                                <tr key={day} className="bg-white dark:bg-gray-800">
                                    <th className="p-2 border border-gray-200 dark:border-gray-600 text-sm font-semibold bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">{day}</th>
                                    {timetable[day].map((cellData, periodIndex) => (
                                        <TimetableCell
                                            key={`${day}-${periodIndex}`}
                                            cellData={cellData}
                                            day={day}
                                            periodIndex={periodIndex}
                                            currentUser={currentUser}
                                            onUpdate={onUpdate}
                                        />
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default TimetablePage;
