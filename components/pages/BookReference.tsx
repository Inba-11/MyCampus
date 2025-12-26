import React, { useMemo } from 'react';
import { Card } from '../ui';
import { MOCK_BOOK_REFERENCES, MOCK_SUBJECTS } from '../../constants';
import type { BookReference } from '../../types';

const BookReferencePage = () => {
    const groupedBooks = useMemo(() => {
        return MOCK_BOOK_REFERENCES.reduce((acc, book) => {
            const subjectId = book.subjectId;
            if (!acc[subjectId]) {
                acc[subjectId] = [];
            }
            acc[subjectId].push(book);
            return acc;
        }, {} as { [key: number]: BookReference[] });
    }, []);

    const subjectIdsWithBooks = Object.keys(groupedBooks).map(Number);

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Book Reference</h1>
            
            <Card className="p-4 mb-6 bg-blue-50 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-700">
                <p className="text-center font-medium text-blue-800 dark:text-blue-200">🚧 Coming Soon: Faculty Suggested Materials.</p>
            </Card>

            <div className="space-y-8">
                {subjectIdsWithBooks.map(subjectId => {
                    const subject = MOCK_SUBJECTS.find(s => s.id === subjectId);
                    if (!subject) return null;

                    return (
                        <div key={subjectId}>
                            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4 pb-2 border-b-2 border-indigo-200 dark:border-indigo-800">{subject.name}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {groupedBooks[subjectId].map(book => (
                                    <Card key={book.id} className="p-6 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{book.title}</h3>
                                            <p className="text-md text-gray-600 dark:text-gray-400 mt-2">by {book.author}</p>
                                        </div>
                                        {book.authorUrl && (
                                            <a 
                                                href={book.authorUrl} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline mt-4 self-start flex items-center gap-1"
                                            >
                                                Author Profile
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                            </a>
                                        )}
                                    </Card>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default BookReferencePage;
