import React, { useState, useMemo } from 'react';
import type { Resource, Subject } from '../../types';
import { ResourceType } from '../../types';
import { Card } from '../ui';

type ResourcesPageProps = {
    resources: Resource[];
    subjects: Subject[];
};

const ResourcesPage = ({ resources, subjects }: ResourcesPageProps) => {
    const [searchTerm, setSearchTerm] = useState('');

    const getIconForType = (type: ResourceType) => {
        switch (type) {
            case ResourceType.BOOK:
                return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v11.494m-9-5.747h18" /></svg>;
            case ResourceType.PDF:
                return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>;
            case ResourceType.LINK:
                return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>;
            case ResourceType.NOTES:
                 return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>;
            default:
                return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
        }
    };

    const groupedResources = useMemo(() => {
        const lowercasedFilter = searchTerm.toLowerCase();
        const filtered = resources.filter(resource => {
            const subject = subjects.find(s => s.id === resource.subjectId);
            return (
                resource.title.toLowerCase().includes(lowercasedFilter) ||
                (resource.description && resource.description.toLowerCase().includes(lowercasedFilter)) ||
                (subject && subject.name.toLowerCase().includes(lowercasedFilter))
            );
        });

        return filtered.reduce((acc, resource) => {
            const subjectId = resource.subjectId;
            if (!acc[subjectId]) {
                acc[subjectId] = [];
            }
            acc[subjectId].push(resource);
            return acc;
        }, {} as { [key: number]: Resource[] });
    }, [searchTerm, resources, subjects]);

    const subjectIdsWithResources = Object.keys(groupedResources).map(Number).sort((a,b) => {
        const subjectA = subjects.find(s => s.id === a);
        const subjectB = subjects.find(s => s.id === b);
        return subjectA!.name.localeCompare(subjectB!.name);
    });

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Resources</h1>
            
            <div className="sticky top-16 md:top-0 py-2 z-10 bg-gray-100 dark:bg-gray-900 -mx-6 px-6 mb-6 shadow-sm">
                 <div className="relative">
                    <input
                        type="text"
                        placeholder="Search resources by title, subject, or description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-3 pl-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
            </div>

            <Card className="p-4 mb-6 bg-blue-50 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-700">
                <p className="text-center font-medium text-blue-800 dark:text-blue-200">🚧 Coming Soon: AI-based resource recommendations.</p>
            </Card>

            <div className="space-y-8">
                {subjectIdsWithResources.length > 0 ? subjectIdsWithResources.map(subjectId => {
                    const subject = subjects.find(s => s.id === subjectId);
                    const subjectResources = groupedResources[subjectId];
                    if (!subject) return null;

                    return (
                        <Card key={subject.id} className="overflow-hidden">
                            <div className="p-6 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">{subject.name}</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{subject.faculty}</p>
                            </div>
                            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                {subjectResources.map(resource => (
                                    <div key={resource.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                                        <div className="flex items-start gap-4 flex-1">
                                            <div className="flex-shrink-0 mt-1">{getIconForType(resource.type)}</div>
                                            <div className="flex-1">
                                                <p className="font-semibold text-gray-900 dark:text-white">{resource.title}</p>
                                                {resource.description && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{resource.description}</p>}
                                            </div>
                                        </div>
                                        <a href={resource.url} download={resource.type !== ResourceType.LINK} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 mt-2 sm:mt-0 ml-10 sm:ml-0 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 flex items-center gap-2 transition-colors duration-200">
                                            <span>{resource.type === ResourceType.LINK ? 'View Link' : 'Download'}</span>
                                            {resource.type !== ResourceType.LINK ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                            )}
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    );
                }) : (
                    <Card className="p-10">
                        <p className="text-center text-gray-500 dark:text-gray-400">No resources found for your search criteria.</p>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default ResourcesPage;
