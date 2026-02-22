import { Link, useLocation } from "react-router-dom";
import { User, Home } from "lucide-react";

export function BottomNav() {
    const location = useLocation();

    // Helper function to check if the path matches the current route
    const isActive = (path) => {
        if (path === '/' && location.pathname !== '/') return false;
        return location.pathname.startsWith(path);
    };

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 w-full h-14 bg-white dark:bg-[#2d2218] border-t border-[#f4ede7] dark:border-[#3d2e21] shadow-[0_-5px_20px_rgba(0,0,0,0.1)] flex items-center justify-around px-4 z-50 rounded-t-xl pb-safe">
            <Link to="/" className={`flex flex-col items-center gap-1 ${isActive('/') ? 'text-primary' : 'text-[#1c140d] dark:text-[#fcfaf8] opacity-60 hover:opacity-100 transition-opacity'}`}>
                <Home size={24} />
                <span className="text-[10px] uppercase font-bold tracking-wider">Home</span>
            </Link>

            <Link to="/challenge/entries" className={`flex flex-col items-center justify-center gap-1 ${isActive('/challenge/entries') ? 'text-primary' : 'text-[#1c140d] dark:text-[#fcfaf8] opacity-60 hover:opacity-100 transition-opacity'}`}>
                <span className="material-symbols-outlined">sports_score</span>
                <span className="text-[10px] font-bold uppercase tracking-widest">Completed</span>
            </Link>

            <Link to="/raceboard" className={`flex flex-col items-center justify-center gap-1 ${isActive('/raceboard') ? 'text-primary' : 'text-[#1c140d] dark:text-[#fcfaf8] opacity-60 hover:opacity-100 transition-opacity'}`}>
                <span className="material-symbols-outlined">leaderboard</span>
                <span className="text-[10px] font-bold uppercase tracking-widest">Rank</span>
            </Link>

            <Link to="/profile" className={`flex flex-col items-center justify-center gap-1 ${isActive('/profile') ? 'text-primary' : 'text-[#1c140d] dark:text-[#fcfaf8] opacity-60 hover:opacity-100 transition-opacity'}`}>
                <User size={24} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Profile</span>
            </Link>
        </nav>
    );
}
