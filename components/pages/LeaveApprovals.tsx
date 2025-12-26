import React, { useEffect, useMemo, useState } from 'react';
import { Card } from '../ui';
import type { LeaveRequest, User, LeaveStatus } from '../../types';
import { getLeaves } from '../../api';

type LeaveApprovalsPageProps = {
    leaveRequests: LeaveRequest[];
    currentUser: User;
    onUpdateRequestStatus: (id: number, status: LeaveStatus) => void;
};

const LeaveApprovalsPage = ({ leaveRequests, currentUser, onUpdateRequestStatus }: LeaveApprovalsPageProps) => {
    const [pendingRequests, setPendingRequests] = useState<LeaveRequest[]>(() =>
        leaveRequests.filter(r => r.mentorName === currentUser.name && r.status === 'Pending').sort((a,b) => a.id - b.id)
    );

    useEffect(() => {
        const fetchPending = async () => {
            try {
                const data = await getLeaves({ status: 'Pending', mentorName: currentUser.name });
                setPendingRequests(data.sort((a,b) => a.id - b.id));
            } catch {
                // keep existing
            }
        };
        fetchPending();
    }, [currentUser]);

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Pending Leave Approvals</h1>
            <div className="space-y-6">
                {pendingRequests.map(req => (
                    <div key={req.id}>
                    <Card>
                        <div className="p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-xl font-semibold text-gray-900 dark:text-white">{req.studentName}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{req.studentId} | {req.department}</p>
                                </div>
                                <span className="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">{req.leaveType}</span>
                            </div>
                            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                    <p className="font-medium text-gray-800 dark:text-gray-200">From</p>
                                    <p className="text-gray-600 dark:text-gray-300">{req.fromDate}</p>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-800 dark:text-gray-200">To</p>
                                    <p className="text-gray-600 dark:text-gray-300">{req.toDate}</p>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-800 dark:text-gray-200">Total Days</p>
                                    <p className="text-gray-600 dark:text-gray-300">{req.totalDays}</p>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-800 dark:text-gray-200">Parent's Contact</p>
                                    <p className="text-gray-600 dark:text-gray-300">{req.parentPhone}</p>
                                </div>
                            </div>
                            <div className="mt-4">
                               <p className="font-medium text-gray-800 dark:text-gray-200 text-sm">Reason</p>
                               <p className="mt-1 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-gray-600 dark:text-gray-300 text-sm">{req.reason}</p>
                            </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-3 flex justify-end space-x-3">
                            <button onClick={() => { onUpdateRequestStatus(req.id, 'Rejected'); setPendingRequests(prev => prev.filter(r => r.id !== req.id)); }} className="px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800">Reject</button>
                            <button onClick={() => { onUpdateRequestStatus(req.id, 'Approved'); setPendingRequests(prev => prev.filter(r => r.id !== req.id)); }} className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700">Approve</button>
                        </div>
                    </Card>
                    </div>
                ))}
                {pendingRequests.length === 0 && (
                    <Card className="p-10">
                        <p className="text-center text-gray-500 dark:text-gray-400">No pending leave requests.</p>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default LeaveApprovalsPage;
