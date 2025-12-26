import React from 'react';

const PlaceholderPage = ({ title }: { title: string }) => (
    <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{title}</h1>
        <p className="mt-4 text-gray-600 dark:text-gray-400">This page is under construction. Check back soon for updates!</p>
    </div>
);

export default PlaceholderPage;
