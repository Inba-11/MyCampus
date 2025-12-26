import React, { useState } from 'react';
import { Card } from '../ui';
import type { Subject, User } from '../../types';
import { UserRole } from '../../types';

const SubjectCard = ({ subject, currentUser, onUpdate, onSelectSyllabus }: { subject: Subject; currentUser: User; onUpdate: (id: number, newChapters: string) => void; onSelectSyllabus: (subject: Subject) => void; }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedChapters, setEditedChapters] = useState(subject.ongoingChapters);

    const canEdit = currentUser.role === UserRole.TEACHER && currentUser.subjectHandled === subject.name;

    const handleSave = () => {
        onUpdate(subject.id, editedChapters);
        setIsEditing(false);
    };
    
    const handleCancel = () => {
        setEditedChapters(subject.ongoingChapters);
        setIsEditing(false);
    }

    return (
        <Card className="flex flex-col">
            <div className="p-6 flex-grow">
                <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{subject.name}</h3>
                    {canEdit && !isEditing && (
                        <button onClick={() => setIsEditing(true)} className="text-indigo-500 hover:text-indigo-700 dark:hover:text-indigo-300 p-1 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                            </svg>
                        </button>
                    )}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Handled by: {subject.faculty}</p>
                <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Ongoing Chapters & Units:</p>
                    {isEditing ? (
                        <textarea
                            value={editedChapters}
                            onChange={(e) => setEditedChapters(e.target.value)}
                            rows={4}
                            className="mt-2 w-full p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white whitespace-pre-wrap"
                        />
                    ) : (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-md whitespace-pre-wrap">{subject.ongoingChapters}</p>
                    )}
                </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-3 mt-auto flex justify-end space-x-3 border-t border-gray-200 dark:border-gray-700">
                {isEditing ? (
                    <>
                        <button onClick={handleCancel} className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Cancel</button>
                        <button onClick={handleSave} className="px-3 py-1 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Save</button>
                    </>
                ) : (
                    <div className="flex justify-start w-full space-x-4">
                        <button onClick={() => onSelectSyllabus(subject)} className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 flex items-center space-x-1.5">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v11.494m-9-5.747h18" /></svg>
                            <span>Syllabus</span>
                        </button>
                        <button onClick={() => alert('Resources page is under construction.')} className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 flex items-center space-x-1.5">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                             <span>Resources</span>
                        </button>
                    </div>
                )}
            </div>
        </Card>
    );
};

type SubjectsPageProps = {
    subjects: Subject[];
    currentUser: User;
    onUpdateSubject: (id: number, newChapters: string) => void;
    onSelectSyllabus: (subject: Subject) => void;
};

const SubjectsPage = ({ subjects, currentUser, onUpdateSubject, onSelectSyllabus }: SubjectsPageProps) => {
    const theorySubjects = subjects.filter(s => s.type === 'Theory');
    const labSubjects = subjects.filter(s => s.type === 'Lab');

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Subjects</h1>
            
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Theory Subjects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {theorySubjects.map(sub => (
                    <SubjectCard key={sub.id} subject={sub} currentUser={currentUser} onUpdate={onUpdateSubject} onSelectSyllabus={onSelectSyllabus} />
                ))}
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Labs</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {labSubjects.map(sub => (
                    <SubjectCard key={sub.id} subject={sub} currentUser={currentUser} onUpdate={onUpdateSubject} onSelectSyllabus={onSelectSyllabus} />
                ))}
            </div>
        </div>
    );
};

export default SubjectsPage;
