import React from 'react';
import { Card } from '../ui';
import { MOCK_SUBJECTS, MOCK_SYLLABUS } from '../../constants';

const CentralizedSyllabusPage = () => {
    const theorySubjectIds = [1, 2, 3, 4, 5, 6];
    const theorySubjects = MOCK_SUBJECTS.filter(s => theorySubjectIds.includes(s.id));
    
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Centralized Syllabus</h1>
            <div className="space-y-8">
                {theorySubjects.map(subject => {
                    const syllabusData = MOCK_SYLLABUS.find(s => s.subjectId === subject.id);
                    if (!syllabusData || !syllabusData.theoryContent) return null;

                    return (
                        <Card key={subject.id} className="p-6">
                            <h2 className="text-2xl font-bold text-indigo-700 dark:text-indigo-400">{subject.name}</h2>
                            <p className="text-md text-gray-600 dark:text-gray-400 mb-4">Handled by: {subject.faculty}</p>
                            
                            <div className="space-y-4">
                                {syllabusData.theoryContent.map(unit => (
                                    <div key={unit.title}>
                                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{unit.title}</h3>
                                        <p className="mt-1 text-gray-700 dark:text-gray-300 leading-relaxed">{unit.content}</p>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};

export default CentralizedSyllabusPage;
