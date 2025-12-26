import React, { useState, useMemo } from 'react';
import type { User, CalendarEvent } from '../../types';
import { UserRole, EventType } from '../../types';
import { Card } from '../ui';

type CalendarPageProps = {
    currentUser: User;
    events: CalendarEvent[];
    onAddEvent: (event: Omit<CalendarEvent, 'id'>) => void;
    onUpdateEvent: (event: CalendarEvent) => void;
    onDeleteEvent: (id: number) => void;
};

const CalendarPage = ({ currentUser, events, onAddEvent, onUpdateEvent, onDeleteEvent }: CalendarPageProps) => {
    const [currentDate, setCurrentDate] = useState(new Date(2025, 6, 1)); // Start in July 2025
    const [view, setView] = useState<'month' | 'week' | 'day'>('month');
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
    const [isAddEditModalOpen, setAddEditModalOpen] = useState(false);
    const [eventToEdit, setEventToEdit] = useState<CalendarEvent | null>(null);

    const today = new Date();
    const isToday = (date: Date) => date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();

    const changeMonth = (delta: number) => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
    const changeWeek = (delta: number) => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() + (delta * 7)));
    const changeDay = (delta: number) => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() + delta));

    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const openAddModal = () => { setEventToEdit(null); setAddEditModalOpen(true); };
    const openEditModal = (event: CalendarEvent) => { setSelectedEvent(null); setEventToEdit(event); setAddEditModalOpen(true); };
    
    const EventPill = ({ event }: { event: CalendarEvent }) => {
        const colors: { [key in EventType]: string } = {
            [EventType.HOLIDAY]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
            [EventType.EXAM]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
            [EventType.ACADEMIC]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
            [EventType.INTERNAL_TEST]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        };
        return (
            <div onClick={(e) => { e.stopPropagation(); setSelectedEvent(event); }} className={`px-2 py-1 text-xs font-medium rounded-md truncate cursor-pointer hover:opacity-80 ${colors[event.type]}`}>
                {event.title}
            </div>
        );
    };

    const renderMonthView = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);
        const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
        const emptyCells = Array(firstDay).fill(null);
        const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        return (
            <Card className="p-4">
                <div className="grid grid-cols-7 gap-px">
                    {weekDays.map(day => <div key={day} className="text-center font-semibold text-sm pb-2">{day}</div>)}
                    {emptyCells.map((_, i) => <div key={`empty-${i}`} className="border-t border-l border-gray-200 dark:border-gray-700"></div>)}
                    {days.map(day => {
                        const date = new Date(year, month, day);
                        const dateStr = date.toISOString().split('T')[0];
                        const dayEvents = events.filter(e => {
                            const start = new Date(e.start + 'T00:00:00');
                            const end = e.end ? new Date(e.end + 'T00:00:00') : start;
                            return date >= start && date <= end;
                        }).sort((a,b) => a.id - b.id);

                        return (
                            <div key={day} onClick={() => { setCurrentDate(date); setView('day'); }} className="h-28 md:h-32 p-1.5 border-t border-l border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer">
                                <span className={`text-sm font-medium ${isToday(date) ? 'bg-indigo-600 text-white rounded-full h-6 w-6 flex items-center justify-center' : ''}`}>{day}</span>
                                <div className="mt-1 space-y-1 overflow-y-auto no-scrollbar">
                                    {dayEvents.map(event => <EventPill key={event.id} event={event} />)}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Card>
        );
    };

    const renderWeekView = () => {
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        const weekDays = Array.from({ length: 7 }, (_, i) => {
            const date = new Date(startOfWeek);
            date.setDate(date.getDate() + i);
            return date;
        });

        return (
            <Card className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-7 divide-y md:divide-y-0 md:divide-x divide-gray-200 dark:divide-gray-700">
                    {weekDays.map(day => {
                        const dateStr = day.toISOString().split('T')[0];
                        const dayEvents = events.filter(e => {
                             const start = new Date(e.start + 'T00:00:00');
                            const end = e.end ? new Date(e.end + 'T00:00:00') : start;
                            return day >= start && day <= end;
                        });
                        return (
                            <div key={dateStr} className="p-4 flex flex-col min-h-[200px]">
                                <div className="text-center font-semibold mb-2">{day.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' })}</div>
                                <div className="space-y-2">
                                    {dayEvents.length > 0 ? dayEvents.map(event => <EventPill key={event.id} event={event} />) : <p className="text-sm text-center text-gray-500 mt-4">No events</p>}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Card>
        );
    };

    const renderDayView = () => {
        const dateStr = currentDate.toISOString().split('T')[0];
        const dayEvents = events.filter(e => {
            const start = new Date(e.start + 'T00:00:00');
            const end = e.end ? new Date(e.end + 'T00:00:00') : start;
            return currentDate >= start && currentDate <= end;
        });

        return (
            <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">{currentDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h2>
                <div className="space-y-3">
                    {dayEvents.length > 0 ? dayEvents.map(event => (
                        <div key={event.id} onClick={() => setSelectedEvent(event)} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 cursor-pointer">
                            <h3 className="font-semibold text-lg">{event.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{event.type}</p>
                            {event.description && <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{event.description}</p>}
                        </div>
                    )) : <p className="text-gray-500">No events scheduled for this day.</p>}
                </div>
            </Card>
        );
    };

    const EventDetailModal = () => {
        if (!selectedEvent) return null;
        return (
            <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={() => setSelectedEvent(null)}>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                    <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{selectedEvent.title}</h2>
                    <p className="text-sm font-medium text-indigo-500 dark:text-indigo-400 mb-4">{selectedEvent.type}</p>
                    <p className="text-gray-600 dark:text-gray-300">
                        {new Date(selectedEvent.start + 'T00:00:00').toLocaleDateString(undefined, { dateStyle: 'long' })}
                        {selectedEvent.end && ` - ${new Date(selectedEvent.end + 'T00:00:00').toLocaleDateString(undefined, { dateStyle: 'long' })}`}
                    </p>
                    {selectedEvent.description && <p className="mt-4 text-gray-700 dark:text-gray-200">{selectedEvent.description}</p>}
                    <div className="mt-6 flex justify-end space-x-3">
                        {currentUser.role === UserRole.ADMIN && (
                            <button onClick={() => openEditModal(selectedEvent)} className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500">Edit</button>
                        )}
                        <button onClick={() => setSelectedEvent(null)} className="px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700">Close</button>
                    </div>
                </div>
            </div>
        );
    };

    const AddEditEventModal = () => {
        const [formData, setFormData] = useState({
            title: eventToEdit?.title || '',
            type: eventToEdit?.type || EventType.ACADEMIC,
            start: eventToEdit?.start || '',
            end: eventToEdit?.end || '',
            description: eventToEdit?.description || '',
        });
        if (!isAddEditModalOpen) return null;

        const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        };

        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            if (eventToEdit) {
                onUpdateEvent({ ...eventToEdit, ...formData });
            } else {
                onAddEvent(formData);
            }
            setAddEditModalOpen(false);
        };
        
        const handleDelete = () => {
            if (eventToEdit && confirm('Are you sure you want to delete this event?')) {
                onDeleteEvent(eventToEdit.id);
                setAddEditModalOpen(false);
            }
        };

        return (
            <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={() => setAddEditModalOpen(false)}>
                <form className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg space-y-4" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
                    <h2 className="text-2xl font-bold mb-4">{eventToEdit ? 'Edit Event' : 'Add New Event'}</h2>
                    <input name="title" value={formData.title} onChange={handleChange} placeholder="Event Title" required className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"/>
                    <select name="type" value={formData.type} onChange={handleChange} className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                        {Object.values(EventType).map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                    <div className="flex gap-4">
                        <input name="start" type="date" value={formData.start} onChange={handleChange} required className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"/>
                        <input name="end" type="date" value={formData.end} onChange={handleChange} placeholder="End Date (optional)" className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"/>
                    </div>
                    <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" rows={3} className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"></textarea>
                    <div className="flex justify-between items-center mt-4">
                        <div>
                           {eventToEdit && <button type="button" onClick={handleDelete} className="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700">Delete</button>}
                        </div>
                        <div className="flex space-x-3">
                            <button type="button" onClick={() => setAddEditModalOpen(false)} className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500">Cancel</button>
                            <button type="submit" className="px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700">Save</button>
                        </div>
                    </div>
                </form>
            </div>
        );
    };

    const headerDateString = useMemo(() => {
        if (view === 'month') return currentDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
        if (view === 'week') {
            const startOfWeek = new Date(currentDate);
            startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(endOfWeek.getDate() + 6);
            return `${startOfWeek.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`;
        }
        return currentDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }, [currentDate, view]);

    return (
        <div className="flex flex-col h-full">
            <header className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div className="flex items-center space-x-2">
                    <button onClick={() => { view === 'month' ? changeMonth(-1) : view === 'week' ? changeWeek(-1) : changeDay(-1) }} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"> &lt; </button>
                    <button onClick={() => { view === 'month' ? changeMonth(1) : view === 'week' ? changeWeek(1) : changeDay(1) }} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"> &gt; </button>
                    <button onClick={() => setCurrentDate(new Date())} className="px-4 py-2 text-sm font-semibold border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">Today</button>
                    <h2 className="text-xl font-bold ml-4">{headerDateString}</h2>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="bg-gray-200 dark:bg-gray-700 p-1 rounded-lg flex space-x-1">
                        {(['month', 'week', 'day'] as const).map(v => (
                            <button key={v} onClick={() => setView(v)} className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${view === v ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-300'}`}>{v.charAt(0).toUpperCase() + v.slice(1)}</button>
                        ))}
                    </div>
                    {currentUser.role === UserRole.ADMIN && (
                        <button onClick={openAddModal} className="px-3 py-1.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 flex items-center space-x-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                            <span>Add</span>
                        </button>
                    )}
                </div>
            </header>
            <div className="flex-1 overflow-y-auto no-scrollbar">
              {view === 'month' && renderMonthView()}
              {view === 'week' && renderWeekView()}
              {view === 'day' && renderDayView()}
            </div>
            <EventDetailModal />
            <AddEditEventModal />
        </div>
    );
};

export default CalendarPage;
