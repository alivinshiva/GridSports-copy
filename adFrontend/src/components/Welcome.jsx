import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Trophy, Users, ArrowRight, TrendingUp } from 'lucide-react';
import { getAllWeekends } from '../services/weekendService';
import { getAllChallenges } from '../services/challengeService';
import { getAllUsers } from '../services/userService';
import logger from '../utils/logger.js';

const Welcome = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({ weekends: 0, challenges: 0, users: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [w, c, u] = await Promise.all([getAllWeekends(), getAllChallenges(), getAllUsers()]);
                setStats({
                    weekends: w.success ? w.data.length : 0,
                    challenges: c.success ? c.data.length : 0,
                    users: u.success ? u.data.length : 0
                });
            } catch (e) {
                logger.error("Stats fetch error", e);
            }
        };
        fetchStats();
    }, []);

    const quickActions = [
        { title: 'Create Weekend', icon: Calendar, path: '/add', color: 'bg-blue-500' },
        { title: 'Create Challenge', icon: Trophy, path: '/add-challenge', color: 'bg-yellow-500' },
        { title: 'View Users', icon: Users, path: '/users', color: 'bg-indigo-500' },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-12">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-10 text-white shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
                        Welcome back, Admin!
                    </h1>
                    <p className="text-blue-100 text-lg md:text-xl max-w-2xl">
                        Here's what's happening in your ShowGrid ecosystem today.
                    </p>
                </div>
                <div className="absolute right-0 top-0 h-full w-1/3 bg-white opacity-5 transform skew-x-12 translate-x-12"></div>
                <div className="absolute right-20 bottom-0 h-full w-1/3 bg-white opacity-5 transform skew-x-12 translate-x-12"></div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Total Weekends', value: stats.weekends, icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Active Challenges', value: stats.challenges, icon: Trophy, color: 'text-yellow-600', bg: 'bg-yellow-50' },
                    { label: 'Registered Users', value: stats.users, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
                        <div>
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{stat.label}</p>
                            <p className="text-3xl font-bold text-gray-800 mt-1">{stat.value}</p>
                        </div>
                        <div className={`h-12 w-12 rounded-full ${stat.bg} flex items-center justify-center`}>
                            <stat.icon size={24} className={stat.color} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <TrendingUp className="mr-2 text-gray-400" /> Quick Actions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {quickActions.map((action, idx) => (
                        <div
                            key={idx}
                            onClick={() => navigate(action.path)}
                            className="group bg-white rounded-xl shadow-sm border border-gray-100 p-6 cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                        >
                            <div className={`${action.color} h-12 w-12 rounded-lg flex items-center justify-center text-white mb-4 shadow-md group-hover:scale-110 transition-transform`}>
                                <action.icon size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{action.title}</h3>
                            <div className="mt-4 flex items-center text-sm text-gray-500 group-hover:text-blue-500 font-medium">
                                Proceed <ArrowRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Welcome;
