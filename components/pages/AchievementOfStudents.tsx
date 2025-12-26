import React from 'react';
import { Card } from '../ui';
import { MOCK_ACHIEVEMENTS } from '../../constants';

const AchievementOfStudentsPage = () => {
    const headers = ["Name", "Dept", "LeetCode Solved", "Hackathon Wins", "Projects Completed", "Topic", "Domain"];

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Student Achievements</h1>
            <Card className="p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 min-w-[800px]">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                {headers.map(header => (
                                    <th key={header} scope="col" className="px-6 py-3 whitespace-nowrap">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {MOCK_ACHIEVEMENTS.map((ach, index) => (
                                <tr key={index} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">{ach.name}</td>
                                    <td className="px-6 py-4">{ach.dept}</td>
                                    <td className="px-6 py-4 text-center">{ach.leetCodeSolved}</td>
                                    <td className="px-6 py-4 text-center">{ach.hackathonWins}</td>
                                    <td className="px-6 py-4 text-center">{ach.projectsCompleted}</td>
                                    <td className="px-6 py-4">{ach.topic}</td>
                                    <td className="px-6 py-4">{ach.domain}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default AchievementOfStudentsPage;
