import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getChallengesByWeekendId } from "../../services/challengeService";

export function ThisWeekend({ weekend }) {
    const [challenges, setChallenges] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchChallenges = async () => {
            if (!weekend?._id) {
                setLoading(false);
                return;
            }
            try {
                const response = await getChallengesByWeekendId(weekend._id);
                if (response.success) {
                    setChallenges(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch challenges for this weekend:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchChallenges();
    }, [weekend]);

    if (!weekend || loading) return null;
    if (challenges.length === 0) return null;

    return (
        <section className="max-w-[1200px] mx-auto px-4 md:px-6 w-full mt-4 md:mt-8 mb-12 relative z-20">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4 flex-1">
                    <h3 className="text-xl md:text-2xl font-bold text-white tracking-wide">This Weekend</h3>
                    <div className="h-[1px] bg-gradient-to-r from-[#4d8bf8] to-transparent flex-1 opacity-50"></div>
                </div>
            </div>

            {/* Grid Layout Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 pb-4">
                {challenges.map((challenge, index) => {
                    const startAtStr = challenge.startAt;
                    let startTimeDisplay = "Starts in --h";
                    if (startAtStr) {
                        const startDate = new Date(startAtStr);
                        const diffMs = startDate - new Date();
                        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
                        if (diffHours > 0 && diffHours < 48) {
                            startTimeDisplay = `Starts in ${diffHours.toString().padStart(2, '0')}h`;
                        } else if (diffHours <= 0 && challenge.status === "ACTIVE") {
                            startTimeDisplay = "Available Now";
                        } else {
                            startTimeDisplay = `Starts: ${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
                        }
                    }

                    return (
                        <Link
                            key={challenge._id}
                            to={challenge.status === "ACTIVE" ? `/challenge-details/${challenge._id}` : "#"}
                            className={`aspect-[4/5] rounded-[24px] overflow-hidden flex flex-col relative group transition-transform hover:-translate-y-1 ${index === 0 ? 'shadow-[0_0_30px_rgba(59,130,246,0.6)] border-2 border-blue-400' : 'shadow-xl border border-transparent'
                                } ${challenge.status !== "ACTIVE" ? 'cursor-not-allowed' : ''} bg-white`}
                        >
                            {/* Top Area (Image/Placeholder) */}
                            <div className="flex-1 w-full relative p-4">
                                <div
                                    className="w-full h-full bg-contain bg-center bg-no-repeat transition-transform group-hover:scale-105"
                                    style={challenge.imageUrl ? { backgroundImage: `url(${challenge.imageUrl})` } : {}}
                                ></div>

                                {/* Lock Overlay for Upcoming/Closed Challenges */}
                                {challenge.status !== "ACTIVE" && (
                                    <div className="absolute inset-0 bg-white/30 group-hover:bg-white/40 transition-colors flex items-center justify-center backdrop-blur-[2px]">
                                        <div className="bg-black/20 p-4 rounded-full flex items-center justify-center border border-black/10">
                                            <span className="material-symbols-outlined text-black/70 text-4xl">lock</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Bottom Solid Area */}
                            <div className="h-28 bg-[#8f9096] w-full p-5 flex flex-col justify-center relative overflow-hidden">
                                {/* Inner glow for active item visually */}
                                {index === 0 && (
                                    <div className="absolute inset-0 bg-gradient-to-t from-blue-500/20 to-transparent pointer-events-none"></div>
                                )}
                                <h4 className="text-white font-bold text-lg md:text-xl mb-1 truncate drop-shadow-sm relative z-10">
                                    {challenge.name || "Challenge"}
                                </h4>
                                <p className="text-white/90 text-sm font-semibold relative z-10">
                                    {startTimeDisplay}
                                </p>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
