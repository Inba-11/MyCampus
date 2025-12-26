import React, { useMemo } from 'react';
import type { User, NavigationItem } from '../types';
import { NAVIGATION_ITEMS } from '../constants';

type SidebarProps = {
    user: User;
    activePage: string;
    onNavigate: (page: string) => void;
    isMobileMenuOpen: boolean;
    setMobileMenuOpen: (isOpen: boolean) => void;
    pendingApprovals: number;
};

const Sidebar = ({ user, activePage, onNavigate, isMobileMenuOpen, setMobileMenuOpen, pendingApprovals }: SidebarProps) => {
    const navItems = useMemo(() => NAVIGATION_ITEMS.filter(item => item.roles.includes(user.role)), [user.role]);
    
    const NavLink = ({ item }: { item: NavigationItem }) => {
        const isActive = activePage === item.name;
        const isApprovals = item.name === 'Leave Approvals';
        return (
            <a
                href="#"
                onClick={(e) => { e.preventDefault(); onNavigate(item.name); }}
                className={`flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    isActive ? 'bg-indigo-600 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
            >
                <div className="flex items-center">
                    <item.icon className="h-5 w-5 mr-3" />
                    <span>{item.name}</span>
                </div>
                {isApprovals && pendingApprovals > 0 && (
                     <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs">{pendingApprovals}</span>
                )}
            </a>
        );
    };

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex md:flex-col md:w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 fixed h-full">
                <div className="flex items-center justify-between h-16 border-b border-gray-200 dark:border-gray-700 px-4">
                    <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">MyCampus</h1>
                    {user.role === 'MENTOR' && pendingApprovals > 0 && (
                         <button onClick={() => onNavigate('Leave Approvals')} className="relative text-gray-600 dark:text-gray-300">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                           <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white text-xs">{pendingApprovals}</span>
                        </button>
                    )}
                </div>
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto no-scrollbar">
                    {navItems.map(item => <NavLink key={item.name} item={item} />)}
                </nav>
            </aside>

            {/* Mobile Menu Overlay */}
            <div
                className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity md:hidden ${
                    isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={() => setMobileMenuOpen(false)}
            ></div>
            
            {/* Mobile Menu Content */}
            <aside
                className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 z-40 transform transition-transform md:hidden ${
                    isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                 <div className="flex items-center justify-between h-16 border-b border-gray-200 dark:border-gray-700 px-4">
                    <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">MyCampus</h1>
                    <button onClick={() => setMobileMenuOpen(false)} className="text-gray-600 dark:text-gray-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <nav className="p-4 space-y-2">
                    {navItems.map(item => <NavLink key={item.name} item={item} />)}
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;
