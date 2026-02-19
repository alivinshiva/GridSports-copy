import React from 'react';

const Podium = ({ winners, type = 'creator' }) => {
    // winners array should have [1st, 2nd, 3rd] objects
    // Each object: { rank, name, points, avatar, subtitle }

    const [first, second, third] = winners;

    const renderPodiumItem = (item, order, scale = "scale-100", borderColor, icon, iconColor) => (
        <div className={`order-${order} flex flex-col items-center gap-4 w-full md:w-64 group ${scale} z-10 transition-transform`}>
            <div className="relative">
                <div className={`absolute ${scale === "scale-110" ? "-top-6 size-10" : "-top-4 size-8"} left-1/2 -translate-x-1/2 ${iconColor} text-white rounded-full flex items-center justify-center border-4 border-background-light dark:border-background-dark shadow-lg`}>
                    <span className={`material-symbols-outlined ${scale === "scale-110" ? "text-xl" : "text-lg"}`}>{icon}</span>
                </div>
                <div className={`${scale === "scale-110" ? "size-36 p-1.5" : "size-28 p-1"} rounded-full border-4 ${borderColor} overflow-hidden transition-transform group-hover:scale-105 shadow-2xl shadow-primary/20`}>
                    {type === 'tribe' ? (
                        <div className={`w-full h-full rounded-full bg-gradient-to-br ${item.avatar} border-2 border-white/20`}></div>
                    ) : (
                        <div className="w-full h-full rounded-full bg-cover bg-center" style={{ backgroundImage: `url('${item.avatar}')` }}></div>
                    )}
                </div>
            </div>
            <div className="text-center">
                <p className={`${scale === "scale-110" ? "text-2xl" : "text-lg"} font-black italic uppercase tracking-wider text-slate-900 dark:text-white`}>
                    #{item.rank} {item.name}
                </p>
                <p className="text-primary font-bold text-lg">{item.points}</p>
                {item.subtitle && <p className="text-xs text-slate-500 dark:text-gray-400 font-medium">{item.subtitle}</p>}
            </div>
        </div>
    );

    return (
        <div className="grid grid-cols-1 md:flex items-end justify-center gap-6 mb-16 px-4">
            {/* 2nd Place */}
            {second && renderPodiumItem(second, 1, "scale-100", "border-[#C0C0C0]", "emoji_events", "bg-[#C0C0C0]")}

            {/* 1st Place */}
            {first && renderPodiumItem(first, 2, "scale-110 md:scale-125", "border-[#FFD700]", "workspace_premium", "bg-[#FFD700]")}

            {/* 3rd Place */}
            {third && renderPodiumItem(third, 3, "scale-100", "border-[#CD7F32]", "military_tech", "bg-[#CD7F32]")}
        </div>
    );
};

export default Podium;
