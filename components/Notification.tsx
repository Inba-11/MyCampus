import React from 'react';
import { NotificationBubble } from '../types';

type NotificationProps = {
    bubbles: NotificationBubble[];
    onDismiss: (id: number) => void;
};

const Notification = ({ bubbles, onDismiss }: NotificationProps) => (
    <div className="fixed bottom-20 right-4 md:bottom-4 z-50 w-80 space-y-3">
        {bubbles.map(bubble => (
            <div key={bubble.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 flex items-start animate-fade-in-up">
                <div className={`mr-3 mt-1 flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center ${bubble.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                    {bubble.type === 'success' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    )}
                </div>
                <div className="flex-1">
                    <p className="font-medium text-sm text-gray-800 dark:text-gray-100">{bubble.message}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{new Date(bubble.timestamp).toLocaleTimeString()}</p>
                </div>
                <button onClick={() => onDismiss(bubble.id)} className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                </button>
            </div>
        ))}
    </div>
);

export default Notification;
