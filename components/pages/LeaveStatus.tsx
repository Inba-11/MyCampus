import React, { useMemo } from 'react';
import type { LeaveRequest, User, LeaveStatus } from '../../types';
import { Card } from '../ui';

type LeaveStatusPageProps = {
    leaveRequests: LeaveRequest[];
    currentUser: User;
};

const LeaveStatusPage = ({ leaveRequests, currentUser }: LeaveStatusPageProps) => {
    const userRequests = useMemo(() => leaveRequests.filter(r => r.studentId === currentUser.id).sort((a,b) => b.id - a.id), [leaveRequests, currentUser]);

    const statusColors: { [key in LeaveStatus]: string } = {
        Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        Approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        Rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">My Leave History</h1>
            <Card className="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">Type</th>
                                <th scope="col" className="px-6 py-3">From</th>
                                <th scope="col" className="px-6 py-3">To</th>
                                <th scope="col" className="px-6 py-3">Days</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userRequests.map(req => (
                                <tr key={req.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">{req.leaveType}</th>
                                    <td className="px-6 py-4">{req.fromDate}</td>
                                    <td className="px-6 py-4">{req.toDate}</td>
                                    <td className="px-6 py-4">{req.totalDays}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[req.status]}`}>{req.status}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                 {userRequests.length === 0 && <p className="p-6 text-center text-gray-500 dark:text-gray-400">You have not applied for any leaves yet.</p>}
            </Card>
        </div>
    );
};

export default LeaveStatusPage;
