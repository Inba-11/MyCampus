import React from 'react';
import { Card } from '../ui';
import { MOCK_EVENTS } from '../../constants';

const EventsPage = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Events</h1>
            
            <Card className="p-4 mb-6 bg-blue-50 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-700">
                <p className="text-center font-medium text-blue-800 dark:text-blue-200">🚧 Coming Soon: Event registration and reminders.</p>
            </Card>

            <div className="space-y-6">
                {MOCK_EVENTS.map(event => (
                    <Card key={event.id} className="overflow-hidden">
                        <div className="p-6 flex flex-col sm:flex-row items-start justify-between gap-4">
                           <div className="flex-1">
                                <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">{event.date} @ {event.time}</p>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{event.title}</h3>
                                <p className="mt-2 text-gray-600 dark:text-gray-400 leading-relaxed">{event.description}</p>
                           </div>
                           <div className="flex-shrink-0 mt-4 sm:mt-0">
                               <button onClick={() => alert('This feature is coming soon!')} className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 flex items-center gap-2 transition-colors duration-200">
                                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                   <span>Add to Calendar</span>
                               </button>
                           </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default EventsPage;
