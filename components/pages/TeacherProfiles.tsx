import React from 'react';
import { Card, DefaultAvatar } from '../ui';
import { MOCK_TEACHERS } from '../../constants';

const TeacherProfilesPage = () => (
    <div>
        <div className="flex items-center gap-3 mb-6">
             <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Teacher Profiles</h1>
             <span className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm font-medium text-gray-600 dark:text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                </svg>
                Read-Only
            </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_TEACHERS.map(teacher => (
                <Card key={teacher.id} className="p-6">
                    <div className="flex flex-col items-center text-center">
                        <DefaultAvatar className="w-24 h-24 mb-4" />
                        <h3 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{teacher.name}</h3>
                        <p className="text-gray-600 dark:text-gray-300">{teacher.subject}</p>
                        
                        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 w-full text-sm space-y-2 text-left">
                            <p><strong className="font-medium text-gray-700 dark:text-gray-200">DOB:</strong> {teacher.dob}</p>
                            <p><strong className="font-medium text-gray-700 dark:text-gray-200">Education:</strong> {teacher.education}</p>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    </div>
);

export default TeacherProfilesPage;
