export function BottomNav() {
    return (
        <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[500px] h-16 bg-white dark:bg-[#2d2218] border border-[#f4ede7] dark:border-[#3d2e21] rounded-full shadow-2xl flex items-center justify-around px-6 z-50">
            <button className="flex flex-col items-center justify-center gap-1 text-primary">
                <span className="material-symbols-outlined fill-1">home</span>
                <span className="text-[10px] font-bold uppercase tracking-widest">Home</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-1 text-[#1c140d] dark:text-[#fcfaf8] opacity-60 hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined">sports_score</span>
                <span className="text-[10px] font-bold uppercase tracking-widest">Compete</span>
            </button>
            <div className="relative -top-6">
                <button className="size-14 bg-primary text-white rounded-full flex items-center justify-center shadow-lg shadow-primary/40 border-4 border-background-light dark:border-background-dark">
                    <span className="material-symbols-outlined text-[32px]">add</span>
                </button>
            </div>
            <button className="flex flex-col items-center justify-center gap-1 text-[#1c140d] dark:text-[#fcfaf8] opacity-60 hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined">leaderboard</span>
                <span className="text-[10px] font-bold uppercase tracking-widest">Rank</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-1 text-[#1c140d] dark:text-[#fcfaf8] opacity-60 hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined">person</span>
                <span className="text-[10px] font-bold uppercase tracking-widest">Profile</span>
            </button>
        </nav>
    );
}
