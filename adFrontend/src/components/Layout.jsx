import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, Trophy, Menu, X, Plus, Calendar, Home, MapPin, Target, Tag as TagIcon, MessageSquare } from 'lucide-react';

const Layout = ({ children }) => {
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Logic: If path is /weekends or /challenges, show compact mobile menu (icons only)
    // REMOVED as per user request to match desktop menu style

    const navItems = [
        { path: '/', label: 'Home', icon: Home },
        { path: '/weekends', label: 'All Weekends', icon: Calendar },
        { path: '/heroes', label: 'All Heroes', icon: MapPin },
        { path: '/challenges', label: 'All Challenges', icon: Trophy },
        { path: '/users', label: 'Users', icon: Users },
        { path: '/add', label: 'Create Weekend', icon: Plus },
        { path: '/add-challenge', label: 'Create Challenge', icon: Trophy },
        { path: '/add-hero', label: 'Create Hero', icon: Plus },
        { path: '/manage-tribe-points', label: 'Manage Tribe Points', icon: Target },
        { path: '/tags', label: 'Manage Tags', icon: TagIcon },
        { path: '/comments', label: 'Manage Comments', icon: MessageSquare },
    ];

    const isActive = (path) => {
        if (path === '/' && location.pathname !== '/') return false;
        return location.pathname.startsWith(path);
    };

    return (
        <div className="min-h-screen font-sans flex bg-gray-50">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}
            >
                <div className="flex items-center justify-between px-6 h-16 border-b border-gray-100 transition-all duration-300">
                    <span className="text-xl font-bold text-gray-800 tracking-tight">
                        <span className="text-blue-600">Grid</span>Sports
                    </span>
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="lg:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                        <X size={24} />
                    </button>
                </div>

                <nav className="p-4 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.path);

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsSidebarOpen(false)}
                                title={item.label}
                                className={`
                                    flex items-center px-4 py-3 rounded-lg transition-colors duration-200 group
                                    ${active
                                        ? 'bg-blue-50 text-blue-700 font-medium shadow-sm'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }
                                `}
                            >
                                <Icon
                                    size={20}
                                    className={`mr-3 ${active ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`}
                                />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="absolute bottom-0 w-full p-4 border-t border-gray-100 bg-white">
                    <div className="flex items-center px-4 py-3 rounded-lg bg-gray-50">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                            S
                        </div>
                        <div className="ml-3 overflow-hidden">
                            <p className="text-sm font-medium text-gray-900 truncate">Sushant</p>
                            <p className="text-xs text-gray-500 truncate">sushant@gridsports.com</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-gray-50 transition-colors duration-200">
                {/* Mobile Header */}
                <header className="bg-white shadow-sm lg:hidden flex items-center h-16 px-4">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-1"
                    >
                        <Menu size={24} />
                    </button>
                    <span className="ml-4 text-lg font-bold text-gray-800">Grid Sports Admin</span>
                </header>

                <main className="flex-1 overflow-y-auto p-4 lg:p-8 text-gray-900">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
