import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export const Layout: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="h-screen bg-gray-50  flex overflow-hidden">
        <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
        />

        <div className="flex-1 overflow-hidden flex flex-col">
            <Header onMenuClick={() => setSidebarOpen(true)} />

            <main className="flex-1 overflow-y-auto p-4 lg:p-6">
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
        </div>
    );
};
