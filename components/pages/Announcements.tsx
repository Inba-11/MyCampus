import React from 'react';
import type { Announcement } from '../../types';
import { Card } from '../ui';

type AnnouncementsPageProps = {
    announcements: Announcement[];
    onMarkAsRead: (id: number) => void;
};

const AnnouncementsPage = ({ announcements, onMarkAsRead }: AnnouncementsPageProps) => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Announcements</h1>
            
            <Card className="p-4 mb-6 bg-blue-50 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-700">
                <p className="text-center font-medium text-blue-800 dark:text-blue-200">🚧 Coming Soon: Filters by category or type.</p>
            </Card>

            <div className="space-y-4">
                {announcements
                    .slice() // Create a shallow copy to avoid mutating the original array
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map(ann => (
                    <Card key={ann.id} className={`p-4 transition-opacity duration-300 ${ann.isRead ? 'opacity-60' : ''}`}>
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-4 flex-1">
                                {!ann.isRead && (
                                    <div className="flex-shrink-0 w-2.5 h-2.5 bg-indigo-500 rounded-full mt-1.5"></div>
                                )}
                                <div className={ann.isRead ? 'ml-[26px]' : ''}> {/* Keep alignment when dot is removed */}
                                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{ann.title}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Posted by {ann.postedBy} on {new Date(ann.date + 'T00:00:00').toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </p>
                                    <p className="mt-2 text-gray-700 dark:text-gray-300">{ann.content}</p>
                                </div>
                            </div>
                            {!ann.isRead && (
                                <button
                                    onClick={() => onMarkAsRead(ann.id)}
                                    className="flex-shrink-0 px-3 py-1.5 text-sm font-medium text-indigo-700 bg-indigo-100 rounded-lg hover:bg-indigo-200 dark:bg-indigo-900 dark:text-indigo-300 dark:hover:bg-indigo-800 whitespace-nowrap"
                                >
                                    Mark as Read
                                </button>
                            )}
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default AnnouncementsPage;
