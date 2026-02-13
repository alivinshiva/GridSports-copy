export function ScheduleFilters({ filter, setFilter }) {
    const filters = [
        { id: "all", label: "All Rounds" },
        { id: "upcoming", label: "Upcoming" },
        { id: "live", label: "Live" },
        { id: "finished", label: "Finished" }
    ];

    return (
        <div className="flex gap-3 p-3 flex-wrap">
            {filters.map((f) => (
                <button
                    key={f.id}
                    onClick={() => setFilter(f.id)}
                    className={`
                        flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-xl px-5 cursor-pointer transition-colors
                        ${filter === f.id
                            ? "bg-primary text-white shadow-sm font-bold"
                            : "bg-[#f4ede7] dark:bg-[#3d2e1f] text-[#1c140d] dark:text-white hover:bg-primary/10 font-medium"}
                    `}
                >
                    <p className="text-sm leading-normal">{f.label}</p>
                </button>
            ))}
        </div>
    );
}
