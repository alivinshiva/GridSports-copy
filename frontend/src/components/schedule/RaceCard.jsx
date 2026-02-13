import { Flag, Calendar, Zap, Clock, Trophy, ArrowRight } from "lucide-react";

export function RaceCard({ race, onClick }) {
    const { status, round, country, countryCode, title, date, image, winner } = race;

    const isLive = status === "live";
    const isUpcoming = status === "upcoming";
    const isFinished = status === "finished";

    return (
        <div onClick={onClick} className={`group relative flex flex-col items-stretch justify-start rounded-xl overflow-hidden md:flex-row md:items-start shadow-md bg-white dark:bg-[#2d2116] border border-primary/20 transition-all hover:shadow-lg ${isLive ? "cursor-pointer" : ""} ${isFinished ? "opacity-90 hover:opacity-100 bg-white/60 dark:bg-[#2d2116]/60 border border-[#f4ede7] dark:border-[#3d2e1f]" : ""}`}>

            {/* Image Section */}
            <div
                className={`w-full md:w-80 bg-center bg-no-repeat aspect-video bg-cover whitespace-nowrap ${isFinished ? "grayscale" : ""}`}
                style={{ backgroundImage: `url("${image}")` }}
            >
                {isLive && (
                    <div className="m-3 inline-flex items-center gap-1 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest animate-pulse">
                        <span className="size-1.5 rounded-full bg-white"></span>
                        Live
                    </div>
                )}
                {isFinished && (
                    <div className="m-3 inline-flex items-center gap-1 bg-gray-800/80 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest">
                        Finished
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="flex w-full grow flex-col items-stretch justify-center gap-1 p-4 md:py-6 md:px-6">
                <div className="flex justify-between items-start">
                    <p className={`text-sm font-bold uppercase tracking-wider ${isUpcoming || isFinished ? "text-[#9c7349] dark:text-[#cbb094]" : "text-primary"}`}>{round}</p>
                    <div className="flex items-center gap-2 px-3 py-1 bg-background-light dark:bg-background-dark rounded-full">
                        <Flag size={14} className="text-gray-900 dark:text-gray-100" />
                        <span className="text-xs font-bold text-gray-900 dark:text-gray-100">{countryCode}</span>
                    </div>
                </div>

                <p className="text-2xl font-black leading-tight tracking-[-0.015em] mb-2 text-gray-900 dark:text-white">
                    {title}
                </p>

                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mt-auto">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-[#9c7349] dark:text-[#cbb094]">
                            <Calendar size={16} />
                            <p className="text-sm font-medium leading-normal">{date}</p>
                        </div>

                        {isLive && (
                            <p className="text-green-600 dark:text-green-400 text-sm font-bold flex items-center gap-1">
                                <Zap size={16} /> Race Active
                            </p>
                        )}
                        {isUpcoming && (
                            <p className="text-[#9c7349] dark:text-[#cbb094] text-sm font-bold flex items-center gap-1">
                                <Clock size={16} /> Starts in 12 days
                            </p>
                        )}
                        {isFinished && winner && (
                            <p className="text-[#9c7349] dark:text-[#cbb094] text-sm font-bold flex items-center gap-1">
                                <Trophy size={16} /> Winner: {winner}
                            </p>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-3 w-full md:w-auto md:flex">
                        {isLive && (
                            <>
                                <button className="flex cursor-pointer items-center justify-center rounded-xl h-10 px-5 bg-primary text-white text-sm font-bold shadow-sm hover:brightness-110 transition-all">
                                    <span>Enter Round</span>
                                </button>
                                <button className="flex cursor-pointer items-center justify-center rounded-xl h-10 px-5 bg-[#f4ede7] dark:bg-[#3d2e1f] text-[#1c140d] dark:text-white text-sm font-bold hover:bg-[#e9ded5] dark:hover:bg-[#4d3b2a] transition-all">
                                    <span>Raceboard</span>
                                </button>
                            </>
                        )}
                        {isUpcoming && (
                            <>
                                <button className="flex cursor-pointer items-center justify-center rounded-xl h-10 px-5 bg-primary/20 text-primary text-sm font-bold hover:bg-primary/30 transition-all">
                                    <span>Register</span>
                                </button>
                                <button className="flex cursor-pointer items-center justify-center rounded-xl h-10 px-5 bg-[#f4ede7] dark:bg-[#3d2e1f] text-[#1c140d] dark:text-white text-sm font-bold hover:bg-[#e9ded5] dark:hover:bg-[#4d3b2a] transition-all">
                                    <span>Details</span>
                                </button>
                            </>
                        )}
                        {isFinished && (
                            <>
                                <button className="flex cursor-pointer items-center justify-center rounded-xl h-10 px-5 bg-[#f4ede7] dark:bg-[#3d2e1f] text-[#1c140d] dark:text-white text-sm font-bold hover:bg-[#e9ded5] dark:hover:bg-[#4d3b2a] transition-all">
                                    <span>Watch Replay</span>
                                </button>
                                <button className="flex cursor-pointer items-center justify-center rounded-xl h-10 px-5 bg-primary/10 text-primary text-sm font-bold hover:bg-primary/20 transition-all">
                                    <span>Standings</span>
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
