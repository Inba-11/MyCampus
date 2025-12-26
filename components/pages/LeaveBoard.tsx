import React, { useMemo } from 'react';
import type { LeaveRequest } from '../../types';
import { LeaveType } from '../../types';
import { Card } from '../ui';

type LeaveBoardPageProps = {
    leaveRequests: LeaveRequest[];
};

const LeaveBoardPage = ({ leaveRequests }: LeaveBoardPageProps) => {
    const approvedLeaves = useMemo(() => 
        leaveRequests
            .filter(r => r.status === 'Approved')
            .sort((a, b) => b.id - a.id), 
        [leaveRequests]
    );

    const LeaveBubble = ({ request }: { request: LeaveRequest }) => {
        const isAutoApproved = request.leaveType === LeaveType.EMERGENCY || request.leaveType === LeaveType.SICK;
        const bubbleColor = isAutoApproved
            ? 'bg-green-50 dark:bg-green-900/40 border-green-200 dark:border-green-800'
            : 'bg-blue-50 dark:bg-blue-900/40 border-blue-200 dark:border-blue-800';
        const statusText = isAutoApproved ? 'Auto Approved' : 'Approved';
        const statusBadgeColor = isAutoApproved 
            ? 'bg-green-100 text-green-800 dark:bg-green-200 dark:text-green-900'
            : 'bg-blue-100 text-blue-800 dark:bg-blue-200 dark:text-blue-900';

        return (
            <div className={`p-4 rounded-xl border ${bubbleColor} shadow-sm`}>
                <div className="flex justify-between items-start gap-4">
                    <div>
                        <p className="font-bold text-gray-900 dark:text-white">{request.studentName}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{request.studentId} | {request.department}</p>
                    </div>
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${statusBadgeColor}`}>
                        {statusText}
                    </span>
                </div>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <p><strong className="font-medium text-gray-800 dark:text-gray-200">From:</strong> {request.fromDate}</p>
                    <p><strong className="font-medium text-gray-800 dark:text-gray-200">To:</strong> {request.toDate}</p>
                    <p><strong className="font-medium text-gray-800 dark:text-gray-200">Leave Type:</strong> {request.leaveType}</p>
                    <p><strong className="font-medium text-gray-800 dark:text-gray-200">Mentor:</strong> {request.mentorName}</p>
                    <p className="sm:col-span-2"><strong className="font-medium text-gray-800 dark:text-gray-200">Parent's No:</strong> {request.parentPhone}</p>
                </div>
                <div className="mt-3">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Reason:</p>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 p-3 bg-white/50 dark:bg-gray-900/20 rounded-lg">{request.reason}</p>
                </div>
            </div>
        );
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Leave Board</h1>
             {approvedLeaves.length > 0 ? (
                <div className="space-y-4">
                    {approvedLeaves.map(req => <LeaveBubble key={req.id} request={req} />)}
                </div>
            ) : (
                <Card className="p-10">
                    <p className="text-center text-gray-500 dark:text-gray-400">No approved leave requests to display.</p>
                </Card>
            )}
        </div>
    );
};

export default LeaveBoardPage;
