import React, { useMemo } from 'react';
import type { UserRole, NavigationItem } from '../types';
import { NAVIGATION_ITEMS, BOTTOM_NAV_NAMES } from '../constants';

type BottomNavProps = {
    userRole: UserRole;
    activePage: string;
    onNavigate: (page: string) => void;
    onMenuClick: () => void;
};

const BottomNav = ({ userRole, activePage, onNavigate, onMenuClick }: BottomNavProps) => {
    const navItems = useMemo(() => NAVIGATION_ITEMS.filter(item => BOTTOM_NAV_NAMES.includes(item.name) && item.roles.includes(userRole)), [userRole]);

    const NavButton = ({ item, isActive }: { item: NavigationItem, isActive: boolean }) => (
        <a href="#" onClick={(e) => { e.preventDefault(); onNavigate(item.name); }} className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-300'}`}>
            <item.icon className="h-6 w-6" />
            <span className="text-xs mt-1">{item.name}</span>
        </a>
    );

    return (
        <div className="fixed bottom-0 left-0 right-0 h-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 md:hidden flex justify-around items-stretch z-20">
            {navItems.map(item => (
                <NavButton key={item.name} item={item} isActive={activePage === item.name} />
            ))}
            <button onClick={onMenuClick} className="flex flex-col items-center justify-center w-full pt-2 pb-1 text-gray-500 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
                <span className="text-xs mt-1">More</span>
            </button>
        </div>
    );
};

export default BottomNav;
