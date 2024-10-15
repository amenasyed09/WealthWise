// DashboardSidebar.js
import React from 'react';
import { Link } from 'react-router-dom';

const DashboardSidebar = () => {
    return (
        <div className="fixed left-0 top-16 h-full w-64 bg-gray-800 text-white shadow-md z-20">
            <div className="p-4">
                <h2 className="text-lg font-bold mb-4 text-white">Dashboard</h2>
                <ul className="mt-4 space-y-4">
              
                    <li><Link to="/income" className="block text-white hover:bg-gray-700 p-2 rounded">Income</Link></li>
                    <li><Link to="/expense" className="block text-white hover:bg-gray-700 p-2 rounded">Expense</Link></li>
                    <li><Link to="/summary" className="block text-white hover:bg-gray-700 p-2 rounded">Summary</Link></li>
                    <li><Link to="/reports" className="block text-white hover:bg-gray-700 p-2 rounded">Reports</Link></li>
                    {/* Add more items here */}
                </ul>
            </div>
        </div>
    );
};

export default DashboardSidebar;
