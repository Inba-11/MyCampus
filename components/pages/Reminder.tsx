import React, { useState } from 'react';
import { Reminder } from '../../types';
import { MOCK_REMINDERS } from '../../constants';
import { ReminderItem, AddReminderModal } from '../ui';

const ReminderPage = () => {
    const [reminders, setReminders] = useState<Reminder[]>(MOCK_REMINDERS);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleToggleReminder = (id: number) => {
        setReminders(reminders.map(r => r.id === id ? { ...r, completed: !r.completed } : r));
    };

    const handleAddReminder = (newReminder: { title: string; dueDate: string; }) => {
      setReminders(prev => [{ id: Date.now(), ...newReminder, completed: false }, ...prev]);
      setIsModalOpen(false);
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reminders</h1>
                <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                    <span>Add Reminder</span>
                </button>
            </div>
            <div>
                {reminders.map(reminder => (
                    <ReminderItem key={reminder.id} reminder={reminder} onToggle={handleToggleReminder} />
                ))}
            </div>
            <AddReminderModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={handleAddReminder} />
        </div>
    );
};

export default ReminderPage;
