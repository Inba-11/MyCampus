import React from 'react';

type HeaderProps = {
    pageTitle: string;
    onMenuClick: () => void;
    pendingApprovals: number;
    onNavigate: (page: string) => void;
};

const Header = ({ pageTitle, onMenuClick, pendingApprovals, onNavigate }: HeaderProps) => (
    <header className="bg-white dark:bg-gray-800/50 backdrop-blur-sm shadow-sm p-4 flex items-center justify-between sticky top-0 z-20 md:hidden">
        <div className="flex items-center">
            <button onClick={onMenuClick} className="mr-4 text-gray-600 dark:text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">{pageTitle}</h1>
        </div>
        {pendingApprovals > 0 && (
            <button onClick={() => onNavigate('Leave Approvals')} className="relative text-gray-600 dark:text-gray-300">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                 <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white text-xs">{pendingApprovals}</span>
            </button>
        )}
    </header>
);

export default Header;
