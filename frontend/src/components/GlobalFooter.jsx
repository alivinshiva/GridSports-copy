import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo1.svg';

export function GlobalFooter() {
    const location = useLocation();

    // Do not show footer on the challenge feed page
    if (location.pathname === '/challenge/feed') {
        return null;
    }

    return (
        <footer className="bg-neutral-950 py-4 px-6 border-t border-gray-800 mt-auto shrink-0 w-full relative z-10">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                <a href="https://www.instagram.com/showgridapp/" target="_blank" rel="noopener noreferrer" className="flex items-center hover:opacity-80 transition-opacity">
                    <img src={logo} alt="SHOWGRID Logo" className="w-12 h-12 drop-shadow-md" />
                </a>

                <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm text-gray-500">
                    <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
                    <Link to="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
                    <Link to="/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link>
                </div>

                <div className="text-gray-600 text-sm whitespace-nowrap">
                    &copy; {new Date().getFullYear()} SHOWGRID. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
