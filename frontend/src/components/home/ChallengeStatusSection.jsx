import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getChallengesByStatus } from "@/services/challengeService";
import { Loader2 } from "lucide-react";

export function ChallengeStatusSection() {
    const [selectedStatus, setSelectedStatus] = useState("active");
    const [challenges, setChallenges] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showAll, setShowAll] = useState(false);

    const statuses = [
        { id: "active", label: "Active", dotColor: "bg-green-500" },
        { id: "upcoming", label: "Upcoming", dotColor: "bg-yellow-500" },
        { id: "closed", label: "Closed", dotColor: "bg-gray-500" }
    ];

    useEffect(() => {
        const fetchChallenges = async () => {
            setLoading(true);
            try {
                const response = await getChallengesByStatus(selectedStatus);
                if (response.success) {
                    setChallenges(response.data);
                }
            } catch (error) {
                // Silently handle error
                setChallenges([]);
            } finally {
                setLoading(false);
            }
        };

        fetchChallenges();
    }, [selectedStatus]);

    return (
        <section className="py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <h2 className="text-2xl font-black tracking-tight text-[#1c140d] dark:text-white">Challenges</h2>

                {/* Segmented Control Filter */}
                <div className="bg-[#f4ede7] dark:bg-[#2d2218] p-1.5 rounded-xl flex items-center gap-1 w-full md:w-auto overflow-x-auto no-scrollbar">
                    {statuses.map((status) => {
                        const isActive = selectedStatus === status.id;
                        return (
                            <button
                                key={status.id}
                                onClick={() => {
                                    setSelectedStatus(status.id);
                                    setShowAll(false);
                                }}
                                className={`
                                    relative flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300
                                    whitespace-nowrap flex items-center justify-center gap-2
                                    ${isActive
                                        ? 'bg-white dark:bg-[#121212] shadow-sm text-[#1c140d] dark:text-white ring-1 ring-black/5'
                                        : 'text-gray-500 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-white/5'
                                    }
                                `}
                            >
                                <span className={`size-2 rounded-full transition-colors ${isActive ? status.dotColor : 'bg-gray-300 dark:bg-gray-600'}`} />
                                {status.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="animate-spin text-primary" size={32} />
                </div>
            ) : challenges.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 dark:bg-[#1e1e1e] rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
                    <p className="text-gray-500">No {selectedStatus} challenges found.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {challenges.slice(0, showAll ? challenges.length : 3).map((challenge) => {
                            const isDeactive = challenge.status === 'CLOSED';
                            const isActive = challenge.status === 'ACTIVE';

                            return (
                                <Link to={`/challenge-details/${challenge._id}`} key={challenge._id} className="group block h-full">
                                    <div className={`flex flex-col h-full overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${isDeactive
                                        ? 'bg-gray-100 dark:bg-[#121212] border-gray-200 dark:border-gray-800 opacity-75'
                                        : 'bg-[#FAFAFA] dark:bg-[#1e1e1e] border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md'
                                        }`}>

                                        {/* Top Image */}
                                        <div className="relative w-full h-56 shrink-0 bg-gray-100 dark:bg-gray-800">
                                            <img
                                                src={challenge.imageUrl}
                                                alt={challenge.name}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                            {/* Status Dot */}
                                            <div className="absolute top-3 right-3 z-10 bg-white/20 backdrop-blur-md rounded-full p-1.5 shadow-sm">
                                                <span className={`block h-2.5 w-2.5 rounded-full ${isActive ? 'bg-green-500 animate-pulse' :
                                                    isDeactive ? 'bg-gray-400' : 'bg-yellow-500'
                                                    }`}></span>
                                            </div>
                                        </div>

                                        {/* Content Section */}
                                        <div className="flex flex-col flex-1 p-5 gap-3">

                                            {/* Location & Season */}
                                            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
                                                {challenge.weekend && (
                                                    <span className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-md">
                                                        <span className="material-symbols-outlined text-[14px]">location_on</span>
                                                        <span className="truncate max-w-[140px]">{challenge.weekend.location}</span>
                                                    </span>
                                                )}
                                                {challenge.season && (
                                                    <span className="bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-md">
                                                        <span>{challenge.season}</span>
                                                    </span>
                                                )}
                                            </div>

                                            {/* Title */}
                                            <h3 className={`text-xl font-black line-clamp-2 leading-tight ${isDeactive ? 'text-gray-500' : 'text-gray-900 dark:text-white'} transition-colors`}>
                                                {challenge.name}
                                            </h3>

                                            {/* Description */}
                                            <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed flex-1">
                                                {challenge.description}
                                            </p>

                                            {/* Footer: Date & Action */}
                                            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800 mt-auto">
                                                <div className="flex items-center gap-2 text-xs text-gray-500 font-medium whitespace-nowrap">
                                                    <span>Starts: {new Date(challenge.startAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                </div>

                                                <div className={`flex items-center gap-1 text-sm font-bold transition-colors ${isDeactive ? 'text-gray-400 group-hover:text-gray-500' : 'text-red-600 group-hover:text-red-700'}`}>
                                                    <span className="hidden sm:inline">View</span>
                                                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                    {!showAll && challenges.length > 3 && (
                        <div className="flex justify-center mt-2">
                            <button
                                onClick={() => setShowAll(true)}
                                className="px-8 py-3 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-[#252525] text-gray-900 dark:text-white font-bold rounded-xl transition-all shadow-sm hover:shadow-md text-sm tracking-wide"
                            >
                                View All Challenges
                            </button>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}
