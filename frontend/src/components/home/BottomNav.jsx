import { Link } from "react-router-dom";
import { User, Home } from "lucide-react";

export function BottomNav() {
    return (
        <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[500px] h-16 bg-white dark:bg-[#2d2218] border border-[#f4ede7] dark:border-[#3d2e21] rounded-full shadow-2xl flex items-center justify-around px-6 z-50">
            <Link to="/" className="flex flex-col items-center gap-1 text-primary">
                <Home size={24} />
                <span className="text-[10px] uppercase font-bold tracking-wider">Home</span>
            </Link>
            <Link to="/challenge/entries" className="flex flex-col items-center justify-center gap-1 text-[#1c140d] dark:text-[#fcfaf8] opacity-60 hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined">sports_score</span>
                <span className="text-[10px] font-bold uppercase tracking-widest">Completed</span>
            </Link>

            <Link to="/raceboard" className="flex flex-col items-center justify-center gap-1 text-[#1c140d] dark:text-[#fcfaf8] opacity-60 hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined">leaderboard</span>
                <span className="text-[10px] font-bold uppercase tracking-widest">Rank</span>
            </Link>
            <Link to="/profile" className="flex flex-col items-center justify-center gap-1 text-[#1c140d] dark:text-[#fcfaf8] opacity-60 hover:opacity-100 transition-opacity">
                <User size={24} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Profile</span>
            </Link>
        </nav>
    );
}
