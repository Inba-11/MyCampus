import React, { useState } from 'react';
import { LinkCard } from '../ui';
import { MOCK_LINKS } from '../../constants';

const Links = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const filteredLinks = MOCK_LINKS.filter(link => 
        link.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        link.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Links Hub</h1>
            <input 
                type="text" 
                placeholder="Search links..." 
                className="w-full p-3 mb-6 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLinks.map(link => <LinkCard key={link.url} link={link} />)}
            </div>
        </div>
    );
};

export default Links;
