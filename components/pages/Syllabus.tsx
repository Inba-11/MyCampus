import React from 'react';
import type { Subject } from '../../types';
import { Card } from '../ui';
import { MOCK_SYLLABUS } from '../../constants';

type SyllabusPageProps = {
    subject: Subject;
    onBack: () => void;
};

const SyllabusPage = ({ subject, onBack }: SyllabusPageProps) => {
    const syllabusData = MOCK_SYLLABUS.find(s => s.subjectId === subject.id);
    
    return (
        <div>
            <div className="flex items-center mb-6">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Syllabus: {subject.name}</h1>
                    <p className="text-md text-gray-500 dark:text-gray-400">Handled by: {subject.faculty}</p>
                </div>
            </div>
            
            {!syllabusData && <Card className="p-6"><p>Syllabus not available for this subject.</p></Card>}
            
            {syllabusData?.theoryContent && (
                <div className="space-y-6">
                    {syllabusData.theoryContent.map((unit, index) => (
                        <Card key={index} className="p-6">
                            <h3 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400 mb-2">{unit.title}</h3>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{unit.content}</p>
                        </Card>
                    ))}
                </div>
            )}
            
            {syllabusData?.labContent && (
                <Card className="p-6">
                    <h3 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400 mb-4">List of Experiments</h3>
                    <ul className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                        {syllabusData.labContent.map((exp, index) => (
                            <li key={index}>{exp}</li>
                        ))}
                    </ul>
                </Card>
            )}
        </div>
    );
};

export default SyllabusPage;
