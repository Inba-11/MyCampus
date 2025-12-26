import React from 'react';
import { Card } from '../ui';
import type { Theme } from '../../types';

type SettingsProps = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
};

const Settings = ({ theme, setTheme }: SettingsProps) => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Settings</h1>
            <Card className="p-6">
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Theme</h3>
                        <div className="mt-2 flex space-x-4">
                            {(['light', 'dark', 'system'] as Theme[]).map(t => (
                                <button key={t} onClick={() => setTheme(t)} className={`px-4 py-2 rounded-lg text-sm font-medium ${theme === t ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}>
                                    {t.charAt(0).toUpperCase() + t.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">High Contrast Mode</h3>
                        <label className="mt-2 flex items-center cursor-pointer">
                            <div className="relative">
                                <input type="checkbox" className="sr-only" />
                                <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
                                <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"></div>
                            </div>
                            <div className="ml-3 text-gray-700 dark:text-gray-300 font-medium">
                                Enable
                            </div>
                        </label>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default Settings;
