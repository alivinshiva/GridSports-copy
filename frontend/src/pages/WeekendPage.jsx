import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { getWeekendById } from "@/services/weekendService";
import { getChallengesByWeekendId } from "@/services/challengeService";

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
                        console.error("Error fetching weekend challenges:", err);
                    }
                }
            } catch (error) {
                console.error("Error fetching weekend details", error);
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
            <div className="flex flex-col items-center py-8 px-4">
                {/* Hero Section */}
                <div className="relative w-full h-[55vh] sm:h-[450px] overflow-hidden rounded-3xl mb-8">
                    {/* Image Background with Transition */}
                    <div className="absolute inset-0 w-full h-full">
                        <div className="absolute inset-0 bg-black/40 z-10"></div>
                        <img
                            src={weekend.imageUrl}
                            alt={weekend.title}
                            className="w-full h-full object-cover transition-all duration-700 ease-in-out transform scale-105"
                        />
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10"></div>

                        {/* Content */}
                        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 z-20">
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

                            <p className="flex items-center gap-2 text-base sm:text-lg text-gray-200 font-medium mb-6 sm:mb-8 tracking-[1px] leading-relaxed drop-shadow-md animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100 break-words w-full">
                                <span className="material-symbols-outlined text-lg sm:text-xl flex-shrink-0">calendar_month</span>
                                <span className="break-words">{weekend.season}</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Challenges Grid */}
                <div className="w-full max-w-7xl">
                    <div className="flex flex-wrap justify-between items-end gap-3 py-6 px-2">
                        <div className="flex min-w-72 flex-col gap-2">
                            {/* Title handles in hero, maybe remove this or keep as subheader? Keeping as subheader for context if needed or remove. 
                                The design had a title here "Grid Race - Bahrain". 
                                The Hero already shows the weekend title. 
                                I'll keep the "Charges / Sessions" header but style it better or remove if redundant.
                                The user design has a header section "PageHeading Component" inside the content.
                                I'll try to adapt the design's filter/tabs area if possible or just the grid.
                                The user said "show all the race... show name, description, imageUrl only... create this".
                                I will focus on the grid of cards as requested.
                             */}
                            <div className="flex items-center gap-2 text-red-600 font-bold mb-4">
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
                                    className={`group flex flex-col rounded-2xl shadow-lg transition-all duration-300 overflow-hidden h-full transform ${isDeactive ? 'bg-gray-100 dark:bg-[#121212] opacity-75 cursor-not-allowed pointer-events-none' : 'bg-white dark:bg-[#1e1e1e] hover:shadow-2xl hover:-translate-y-1'
                                        }`}
                                >
                                    {/* Header Image Section - Taller & Link Wrapper */}
                                    <Link
                                        to={isDeactive ? '#' : `/challenge-details/${race._id}`}
                                        className="relative h-72 w-full overflow-hidden block"
                                        onClick={(e) => isDeactive && e.preventDefault()}
                                    >
                                        <div
                                            className="w-full h-full bg-center bg-cover transition-transform duration-700 group-hover:scale-105"
                                            style={{ backgroundImage: `url(${race.imageUrl})` }}
                                        ></div>

                                        {/* Status Badge - Bottom Right */}
                                        <div className="absolute bottom-4 right-4 z-10">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm backdrop-blur-md ${isActive
                                                ? 'bg-green-500/90 text-white'
                                                : isDeactive
                                                    ? 'bg-gray-500/90 text-white'
                                                    : 'bg-yellow-500/90 text-white'
                                                }`}>
                                                <span className={`size-2 rounded-full ${isActive
                                                    ? 'bg-white animate-pulse'
                                                    : isDeactive
                                                        ? 'bg-gray-300'
                                                        : 'bg-white'
                                                    }`}></span>
                                                {race.status || 'UPCOMING'}
                                            </span>
                                        </div>

                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </Link>

                                    {/* Content Section - Updated Padding & Spacing */}
                                    <div className="px-8 py-4 flex flex-col flex-1 gap-3">
                                        {/* Title & Desc */}
                                        <div className="space-y-2">
                                            <Link
                                                to={isDeactive ? '#' : `/challenge-details/${race._id}`}
                                                className="block"
                                                onClick={(e) => isDeactive && e.preventDefault()}
                                            >
                                                <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight font-display leading-tight group-hover:text-red-600 transition-colors line-clamp-1">
                                                    {race.name}
                                                </h3>
                                            </Link>
                                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-2 min-h-[40px]">
                                                {race.description}
                                            </p>

                                            {/* Timer Section - Below Description (Only for Upcoming) */}
                                            {isUpcoming && (
                                                <div className="flex items-center gap-2 text-yellow-600 font-medium text-sm pt-1">
                                                    <span className="material-symbols-outlined text-lg">timer</span>
                                                    <span className="text-gray-500 dark:text-gray-400 text-xs uppercase font-bold tracking-wider">Starts in:</span>
                                                    <span className="font-bold font-mono"><CountdownTimer targetDate={race.startAt} /></span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="h-px w-full bg-gray-100 dark:bg-gray-800"></div>

                                        {/* Timeline Grid */}
                                        <div className="flex flex-col gap-3">
                                            <div className="flex items-center gap-3">
                                                <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${isDeactive ? 'bg-gray-200 dark:bg-gray-800 text-gray-400' : 'bg-red-50 dark:bg-red-900/10 text-red-600'} shrink-0`}>
                                                    <span className="material-symbols-outlined text-xl">calendar_today</span>
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider truncate">Start</p>
                                                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                                                        {new Date(race.startAt).toLocaleString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${isDeactive ? 'bg-gray-200 dark:bg-gray-800 text-gray-400' : 'bg-red-50 dark:bg-red-900/10 text-red-600'} shrink-0`}>
                                                    <span className="material-symbols-outlined text-xl">event_available</span>
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider truncate">End</p>
                                                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                                                        {new Date(race.endAt).toLocaleString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Button - Updated Padding */}
                                        <div className="mt-auto pt-3">
                                            <Link
                                                to={isDeactive ? '#' : `/challenge-details/${race._id}`}
                                                className={`w-full font-bold py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98] ${isDeactive
                                                    ? 'bg-red-100 text-red-400 shadow-none cursor-not-allowed'
                                                    : 'bg-red-600 hover:bg-red-700 text-white text-sm shadow-red-600/10 hover:shadow-lg hover:shadow-red-600/20'
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
                        <div className="flex flex-col justify-center items-center p-12 border-2 border-dashed border-[#e8dbce] dark:border-[#3d2e21] rounded-2xl text-center gap-6 opacity-60">
                            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                                <span className="material-symbols-outlined text-3xl">lock_clock</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No active challenges</h3>
                                <p className="text-base text-gray-500 max-w-xs mx-auto">Challenges for this weekend race will be unlocked soon.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
