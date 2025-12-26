import React, { useState } from 'react';
import type { LinkItem, Reminder } from '../types';

export const Card = ({ children, className, onClick }: { children: React.ReactNode; className?: string; onClick?: () => void; }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden ${className}`} onClick={onClick}>
    {children}
  </div>
);

export const LinkCard = ({ link }: { link: LinkItem }) => (
    <Card className="hover:shadow-lg transition-shadow duration-300">
        <div className="p-6">
            <div className="uppercase tracking-wide text-sm text-indigo-500 dark:text-indigo-400 font-semibold">{link.category}</div>
            <a href={link.url} target="_blank" rel="noopener noreferrer" className="block mt-1 text-lg leading-tight font-medium text-black dark:text-white hover:underline">{link.title}</a>
            <p className="mt-2 text-gray-500 dark:text-gray-400">{link.description}</p>
        </div>
    </Card>
);

export const ReminderItem = ({ reminder, onToggle }: { reminder: Reminder; onToggle: (id: number) => void; }) => (
    <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg mb-2">
        <input type="checkbox" checked={reminder.completed} onChange={() => onToggle(reminder.id)} className="h-5 w-5 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-500 dark:bg-gray-600" />
        <div className="ml-4 flex-grow">
            <p className={`font-medium ${reminder.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>{reminder.title}</p>
            <p className={`text-sm ${reminder.completed ? 'text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-300'}`}>{reminder.dueDate}</p>
        </div>
    </div>
);

export const AddReminderModal = ({ isOpen, onClose, onAdd }: { isOpen: boolean; onClose: () => void; onAdd: (reminder: { title: string; dueDate: string }) => void; }) => {
    const [title, setTitle] = useState('');
    const [dueDate, setDueDate] = useState('');

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (title && dueDate) {
            onAdd({ title, dueDate });
            setTitle('');
            setDueDate('');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Add New Reminder</h2>
                <div className="space-y-4">
                    <input 
                      type="text" 
                      placeholder="Reminder Title" 
                      value={title} 
                      onChange={e => setTitle(e.target.value)} 
                      className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white" 
                    />
                    <input 
                      type="text" 
                      placeholder="Due Date (e.g., Tomorrow)" 
                      value={dueDate} 
                      onChange={e => setDueDate(e.target.value)} 
                      className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
                    />
                </div>
                <div className="mt-6 flex justify-end space-x-4">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500">Cancel</button>
                    <button onClick={handleSubmit} className="px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50" disabled={!title || !dueDate}>Add</button>
                </div>
            </div>
        </div>
    );
};

export const DefaultAvatar = ({ className }: { className?: string }) => (
    <div className={`flex-shrink-0 flex items-center justify-center rounded-full bg-blue-100 dark:bg-gray-700 overflow-hidden ${className}`}>
        <svg className="w-[80%] h-[80%] text-blue-300 dark:text-gray-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
    </div>
);
