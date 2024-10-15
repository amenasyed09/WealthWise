// DashboardLayout.js
import React from 'react';
import DashboardSidebar from './DashboardSidebar';

const Layout = ({ children }) => {
    return (
        <div className="flex">
            <DashboardSidebar />
            <div className="ml-64 p-5 w-full">
                {children}
            </div>
        </div>
    );
};

export default Layout;
