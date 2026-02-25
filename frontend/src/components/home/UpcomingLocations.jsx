import { Link } from "react-router-dom";

export function UpcomingLocations({ upcomingWeekends }) {
    if (!upcomingWeekends || upcomingWeekends.length === 0) return null;

    return (
        <section className="max-w-[1200px] mx-auto px-4 md:px-6 w-full mt-8 md:mt-12 mb-20 relative z-20">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4 flex-1">
                    <h3 className="text-xl md:text-2xl font-bold text-white tracking-wide">Upcoming Location</h3>
                    <div className="h-[1px] bg-gradient-to-r from-[#4d8bf8] to-transparent flex-1 opacity-50"></div>
                </div>
            </div>

            {/* Grid Layout Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 pb-4">
                {upcomingWeekends.map((weekend, index) => (
                    <Link
                        key={weekend._id}
                        to={`/weekend/${weekend._id}`}
                        className={`aspect-[4/5] rounded-[24px] overflow-hidden flex flex-col relative group transition-transform hover:-translate-y-1 shadow-[0_0_15px_rgba(0,0,0,0.5)] border border-transparent bg-white`}
                    >
                        {/* Top Area (Image/Placeholder) */}
                        <div className="flex-1 w-full relative p-4">
                            <div
                                className="w-full h-full bg-contain bg-center bg-no-repeat transition-transform group-hover:scale-105"
                                style={weekend.imageUrl ? { backgroundImage: `url(${weekend.imageUrl})` } : {}}
                            ></div>

                            {/* Lock Overlay for Upcoming/Closed Challenges */}
                            <div className="absolute inset-0 bg-white/30 group-hover:bg-white/40 transition-colors flex items-center justify-center backdrop-blur-[2px]">
                                <div className="bg-black/20 p-4 rounded-full flex items-center justify-center border border-black/10">
                                    <span className="material-symbols-outlined text-black/70 text-4xl">lock</span>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Solid Area */}
                        <div className="h-28 bg-[#8f9096] w-full p-5 flex flex-col justify-center relative overflow-hidden">
                            <h4 className="text-white font-bold text-lg md:text-xl mb-1 truncate drop-shadow-sm relative z-10">
                                {weekend.title}
                            </h4>
                            <p className="text-white/90 text-sm font-semibold uppercase tracking-wider flex items-center gap-1 relative z-10">
                                <span className="material-symbols-outlined text-sm">location_on</span>
                                {weekend.location}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
