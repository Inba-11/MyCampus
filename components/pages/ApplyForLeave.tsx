import React, { useState, useEffect } from 'react';
import { User, NotificationBubble, LeaveRequest, LeaveStatus, LeaveType } from '../../types';
import { MOCK_MENTORS } from '../../constants';
import { Card } from '../ui';

type ApplyForLeavePageProps = {
    onNotification: (bubble: Omit<NotificationBubble, 'id' | 'timestamp'>) => void;
    onNewLeaveRequest: (request: Omit<LeaveRequest, 'id'>) => void;
    currentUser: User;
};

const ApplyForLeavePage = ({ onNotification, onNewLeaveRequest, currentUser }: ApplyForLeavePageProps) => {
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [totalDays, setTotalDays] = useState(0);
    const [leaveType, setLeaveType] = useState<LeaveType>(LeaveType.CASUAL);
    const [mentorName, setMentorName] = useState(MOCK_MENTORS[0]);
    const [parentPhone, setParentPhone] = useState('');
    const [reason, setReason] = useState('');

    useEffect(() => {
        if (fromDate && toDate) {
            const start = new Date(fromDate);
            const end = new Date(toDate);
            if (end >= start) {
                const diffTime = Math.abs(end.getTime() - start.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                setTotalDays(diffDays);
            } else {
                setTotalDays(0);
            }
        } else {
            setTotalDays(0);
        }
    }, [fromDate, toDate]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const isAutoApproved = leaveType === LeaveType.EMERGENCY || leaveType === LeaveType.SICK;
        const status: LeaveStatus = isAutoApproved ? 'Approved' : 'Pending';

        onNewLeaveRequest({
            studentName: currentUser.name,
            studentId: currentUser.id,
            department: currentUser.department,
            mentorName,
            parentPhone,
            leaveType,
            fromDate,
            toDate,
            totalDays,
            reason,
            status,
        });
        
        if (isAutoApproved) {
            onNotification({
                message: `Your ${leaveType} Leave has been auto-approved.`,
                type: 'success',
            });
        } else {
            onNotification({
                message: `Your ${leaveType} Leave request is pending approval.`,
                type: 'pending',
            });
        }
        // Reset form
        setFromDate('');
        setToDate('');
        setLeaveType(LeaveType.CASUAL);
        setMentorName(MOCK_MENTORS[0]);
        setParentPhone('');
        setReason('');
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Apply for Leave</h1>
            <Card>
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                         <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                            <input type="text" value={currentUser.name} disabled className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-500 dark:text-gray-400" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Roll No.</label>
                            <input type="text" value={currentUser.id} disabled className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-500 dark:text-gray-400" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Department</label>
                            <input type="text" value={currentUser.department} disabled className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-500 dark:text-gray-400" />
                        </div>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Mentor Name</label>
                             <select value={mentorName} onChange={e => setMentorName(e.target.value)} required className="mt-1 block w-full pl-3 pr-10 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                                {MOCK_MENTORS.map(name => <option key={name} value={name}>{name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Parent Phone No.</label>
                            <input type="tel" value={parentPhone} onChange={e => setParentPhone(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Leave Type</label>
                        <select value={leaveType} onChange={e => setLeaveType(e.target.value as LeaveType)} className="mt-1 block w-full pl-3 pr-10 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                            {Object.values(LeaveType).map(type => <option key={type} value={type}>{type}</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">From Date</label>
                           <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>
                         <div>
                           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">To Date</label>
                           <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>
                        <div>
                           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Total Days</label>
                           <input type="number" value={totalDays} disabled className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-500 dark:text-gray-400" />
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Reason for Leave</label>
                        <textarea rows={4} value={reason} onChange={e => setReason(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Attachment (optional)</label>
                        <input type="file" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 dark:file:bg-indigo-900/50 file:text-indigo-600 dark:file:text-indigo-300 hover:file:bg-indigo-100 dark:hover:file:bg-indigo-900" />
                    </div>
                    <div className="flex justify-end">
                        <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Submit Request
                        </button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default ApplyForLeavePage;
