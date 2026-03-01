import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { getWeekendById } from "@/services/weekendService";
import { getChallengesByWeekendId } from "@/services/challengeService";
import { Lock } from "lucide-react";

const CountdownTimer = ({ targetDate }) => {
    const calculateTimeLeft = () => {
        const difference = +new Date(targetDate) - +new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                d: Math.floor(difference / (1000 * 60 * 60 * 24)),
                h: Math.floor((difference / (1000 * 60 * 60)) % 24),
                m: Math.floor((difference / 1000 / 60) % 60),
                s: Math.floor((difference / 1000) % 60)
            };
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearInterval(timer);
    }, [targetDate]);

    const formatTime = () => {
        if (Object.keys(timeLeft).length === 0) return "Started";
        return `${timeLeft.d}d ${timeLeft.h}h ${timeLeft.m}m ${timeLeft.s}s`;
    };

    return <span>{formatTime()}</span>;
};

export default function WeekendPage() {
    const { weekendId } = useParams();
    const [weekend, setWeekend] = useState(null);
    const [races, setRaces] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchweekend = async () => {
            try {
                const response = await getWeekendById(weekendId);
                if (response.success) {
                    setWeekend(response.data);

                    // Fetch challenges for this weekend
                    try {
                        const challengesResponse = await getChallengesByWeekendId(weekendId);
                        if (challengesResponse.success) {
                            setRaces(challengesResponse.data);
                        }
                    } catch (err) {
                        // Silently handle error
                    }
                }
            } catch (error) {
                // Silently handle error
            } finally {
                setLoading(false);
            }
        };
        fetchweekend();
    }, [weekendId]);

    if (loading) return <AuthenticatedLayout><div className="p-10 text-center">Loading...</div></AuthenticatedLayout>;
    if (!weekend) return <AuthenticatedLayout><div className="p-10 text-center">Weekend not found</div></AuthenticatedLayout>;

    return (
        <AuthenticatedLayout>
            <div className="flex flex-col items-center pb-8 pt-2 sm:pt-8 w-full sm:px-4">
                {/* Hero Section */}
                <div className="relative w-full rounded-[32px] sm:rounded-3xl mb-8 overflow-hidden bg-black flex justify-center">
                    {/* Image Background */}
                    <img
                        src={weekend.imageUrl}
                        alt={weekend.title}
                        className="w-full max-h-[60vh] sm:h-[450px] object-contain sm:object-cover transition-all duration-700 ease-in-out"
                    />

                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10 pointer-events-none"></div>

                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 z-20 pointer-events-none">
                        <div className="w-full max-w-7xl mx-auto flex flex-col justify-end h-full">
                            {/* Live Indicator */}
                            <div className="flex items-center gap-2 mb-1 sm:mb-2 animate-in fade-in slide-in-from-bottom-3 duration-500">
                                <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-red-600"></span>
                                </span>
                                <span className="text-red-500 font-bold uppercase tracking-widest text-[10px] sm:text-xs drop-shadow-md">Race Live</span>
                            </div>

                            <h2 className="text-2xl sm:text-4xl font-black text-white mb-3 sm:mb-4 uppercase tracking-[1px] leading-tight sm:leading-snug drop-shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col items-start gap-1 sm:gap-2 break-words w-full">
                                <span className="break-words w-full">{weekend.title}</span>
                                <span className="flex items-center gap-1 text-gray-300 font-bold text-base sm:text-lg normal-case tracking-[1px] leading-relaxed break-words w-full">
                                    <span className="material-symbols-outlined text-base sm:text-lg flex-shrink-0">location_on</span>
                                    <span className="break-words">{weekend.location}</span>
                                </span>
                            </h2>

                            <p className="flex items-center gap-2 text-base sm:text-lg text-gray-200 font-medium tracking-[1px] leading-relaxed drop-shadow-md animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100 break-words w-full">
                                <span className="material-symbols-outlined text-lg sm:text-xl flex-shrink-0">calendar_month</span>
                                <span className="break-words">{weekend.season}</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Challenges Grid */}
                <div className="w-full max-w-7xl px-4 sm:px-0">
                    <div className="flex flex-wrap justify-between items-end gap-3 py-6">
                        <div className="flex min-w-72 flex-col gap-2">
                            <div className="flex items-center gap-2 text-white font-bold mb-4">
                                <span className="material-symbols-outlined text-sm">schedule</span>
                                <p className="text-base font-medium leading-normal">All Races of this Weekend</p>
                            </div>
                        </div>
                    </div>

                    {/* Challenge Cards Grid (Consolidated Design) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10">
                        {races.map((race) => {
                            const isDeactive = race.status === 'CLOSE' || race.status === 'COMPLETED';
                            const isActive = race.status === 'ACTIVE';
                            // If not active and not deactive, it's upcoming (or unknown which we treat as upcoming)
                            const isUpcoming = !isActive && !isDeactive;

                            return (
                                <div
                                    key={race._id}
                                    className={`rounded-3xl overflow-hidden flex flex-col relative group transition-all duration-300 hover:-translate-y-2 border border-white/5 bg-[#111118] ${isDeactive ? 'cursor-not-allowed opacity-75' : 'hover:border-blue-500/30 hover:shadow-[0_8px_30px_rgba(59,130,246,0.15)]'}`}
                                >
                                    {/* Top Area (Image/Placeholder) */}
                                    <Link
                                        to={isDeactive ? '#' : `/challenge-details/${race._id}`}
                                        className="w-full relative block h-48 sm:h-56 overflow-hidden rounded-t-3xl"
                                        onClick={(e) => isDeactive && e.preventDefault()}
                                    >
                                        <div
                                            className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-transform group-hover:scale-105"
                                            style={race.imageUrl ? { backgroundImage: `url(${race.imageUrl})` } : {}}
                                        ></div>

                                        {/* Status Badge */}
                                        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm border ${isActive
                                                ? 'bg-red-900/40 text-red-400 border-red-500/30'
                                                : isDeactive
                                                    ? 'bg-[#111118]/80 text-gray-400 border-white/10'
                                                    : 'bg-blue-500/90 text-white border-blue-400/50'
                                                }`}>
                                                {isActive ? (
                                                    <span className="relative flex h-2 w-2">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                                    </span>
                                                ) : (
                                                    <span className={`size-2 rounded-full ${isDeactive ? 'bg-gray-500' : 'bg-white'}`}></span>
                                                )}
                                                {race.status || 'UPCOMING'}
                                            </span>
                                        </div>

                                        {/* Lock Overlay for Upcoming/Closed Challenges */}
                                        {!isActive && (
                                            <div className="absolute inset-0 bg-white/20 group-hover:bg-white/30 transition-colors flex items-center justify-center">
                                                <div className="bg-black/20 p-4 rounded-full flex items-center justify-center border border-black/10">
                                                    <Lock className="text-black/70" size={32} />
                                                </div>
                                            </div>
                                        )}
                                    </Link>

                                    {/* Bottom Solid Area */}
                                    <div className="h-44 bg-[#111118] w-full p-5 flex flex-col justify-between relative overflow-hidden border-t border-white/5">
                                        {/* Inner glow visually */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/0 group-hover:from-cyan-500/5 to-transparent pointer-events-none transition-all duration-500"></div>

                                        <div className="relative z-10">
                                            <h4 className="text-white font-bold text-lg md:text-xl mb-2 truncate drop-shadow-sm group-hover:text-cyan-400 transition-colors">
                                                {race.name}
                                            </h4>

                                            {/* Timer or Dates */}
                                            {isUpcoming ? (
                                                <div className="text-gray-400 text-sm font-medium flex items-center gap-1.5">
                                                    <span className="material-symbols-outlined text-[16px]">timer</span>
                                                    <span>Starts in: <span className="text-cyan-400 font-bold"><CountdownTimer targetDate={race.startAt} /></span></span>
                                                </div>
                                            ) : (
                                                <div className="text-gray-400 text-[11px] sm:text-xs font-medium flex flex-col gap-1.5 mt-1">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="material-symbols-outlined text-[14px] text-cyan-500">calendar_today</span>
                                                        <span>Start: <span className="text-gray-300">{new Date(race.startAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span></span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="material-symbols-outlined text-[14px] text-blue-500">event_available</span>
                                                        <span>End: <span className="text-gray-300">{new Date(race.endAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span></span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Generic Action Button using Gradient Style */}
                                        <div className="relative z-10 mt-3 pt-3 border-t border-white/5">
                                            <Link
                                                to={isDeactive ? '#' : `/challenge-details/${race._id}`}
                                                className={`w-full font-bold py-2 px-4 rounded-xl flex items-center justify-center gap-2 transition-all ${isDeactive
                                                    ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                                                    : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-blue-500/25 hover:from-cyan-400 hover:to-blue-400'
                                                    }`}
                                                onClick={(e) => isDeactive && e.preventDefault()}
                                            >
                                                <span>{isDeactive ? 'Closed' : 'View Challenge'}</span>
                                                {!isDeactive && <span className="material-symbols-outlined text-lg">arrow_forward</span>}
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {races.length === 0 && (
                        <div className="flex flex-col justify-center items-center p-12 border-2 border-dashed border-white/10 rounded-2xl text-center gap-6 opacity-60 bg-[#111118]">
                            <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/30">
                                <span className="material-symbols-outlined text-3xl">lock_clock</span>
                            </div>
                            <div>
                                <p className="text-base text-gray-400 max-w-xs mx-auto">Challenges for this weekend race will be unlocked soon.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
