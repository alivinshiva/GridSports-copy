import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { getChallengeById } from "@/services/challengeService";

export default function ChallengeDetails() {
    const { challengeId } = useParams();
    const [challenge, setChallenge] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchChallenge = async () => {
            try {
                const response = await getChallengeById(challengeId);
                console.log("Challenge Data:", response); // User requested debug log
                if (response.success) {
                    setChallenge(response.data);
                }
            } catch (error) {
                console.error("Error fetching challenge details", error);
            } finally {
                setLoading(false);
            }
        };
        fetchChallenge();
    }, [challengeId]);

    if (loading) return <AuthenticatedLayout><div className="min-h-[50vh] flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div></AuthenticatedLayout>;
    if (!challenge) return <AuthenticatedLayout><div className="p-10 text-center">Challenge not found</div></AuthenticatedLayout>;

    // Use weekend image for background if available, otherwise challenge image
    const bgImage = challenge.weekend?.imageUrl || challenge.imageUrl;

    return (
        <AuthenticatedLayout>
            {/* Main Container - Removed custom background decoration */}
            <div className="w-full py-12 flex justify-center relative p-4">

                {/* Unified "One Box" Card - Cleaner, No Zoom, No Harsh Shadows */}
                <div className="relative z-10 w-full max-w-5xl bg-white dark:bg-[#18181b] rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-white/5 flex flex-col md:flex-row min-h-[500px]">

                    {/* Left/Top Side: Image (Static, Clean) */}
                    <div className="w-full md:w-5/12 relative min-h-[250px] md:min-h-full bg-gray-100 dark:bg-[#202023]">
                        <img
                            src={challenge.imageUrl}
                            alt={challenge.name}
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        {/* Subtle Gradient for Text Readability only at top/bottom edges if needed */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent"></div>
                    </div>

                    {/* Right/Bottom Side: Details Content */}
                    <div className="w-full md:w-7/12 p-6 md:p-10 flex flex-col gap-6 max-h-[90vh] overflow-y-auto custom-scrollbar bg-white dark:bg-[#18181b]">

                        {/* Wrapper for Title & Weekend & Badges */}
                        <div className="flex flex-col gap-1">
                            {/* Top Row: Location/Season (Left) and Status (Right) */}
                            <div className="flex items-center justify-between mb-1">
                                {challenge.weekend && (
                                    <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
                                        <span className="material-symbols-outlined text-sm">flag</span>
                                        <span>{challenge.weekend.location}</span>
                                        <span className="text-gray-300 dark:text-gray-700 mx-1">•</span>
                                        <span className="material-symbols-outlined text-sm">calendar_month</span>
                                        <span>{challenge.weekend.season}<span className="hidden md:inline"> Season</span></span>
                                    </div>
                                )}

                                <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest shadow-sm border ${challenge.status === 'ACTIVE' ? 'bg-green-100/10 text-green-600 border-green-200 dark:border-green-900' : 'bg-gray-100 dark:bg-white/5 text-gray-500 border-gray-200 dark:border-white/10'
                                    }`}>
                                    {challenge.status || 'UPCOMING'}
                                </span>
                            </div>

                            <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white font-display leading-tight mb-2 tracking-tight">
                                {challenge.name}
                            </h1>
                            {challenge.weekend && (
                                <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">
                                    Part of &nbsp; <span className="text-gray-900 dark:text-white font-bold">{challenge.weekend.title}</span>
                                </p>
                            )}
                        </div>

                        {/* Stats Row - Cleaner Layout */}
                        <div className="grid grid-cols-3 gap-4 py-6 border-y border-gray-100 dark:border-white/5">
                            <div className="text-left">
                                <p className="text-[10px] font-bold uppercase text-gray-400 tracking-wider mb-1">Type</p>
                                <p className="font-bold text-gray-900 dark:text-white text-sm">{challenge.type}</p>
                            </div>
                            <div className="text-left pl-4 border-l border-gray-100 dark:border-white/5">
                                <p className="text-[10px] font-bold uppercase text-gray-400 tracking-wider mb-1">Entries</p>
                                <div className="flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-primary text-sm">groups</span>
                                    <span className="font-bold text-gray-900 dark:text-white text-sm">{challenge.submissionCount || 0}</span>
                                </div>
                            </div>
                            <div className="text-left pl-4 border-l border-gray-100 dark:border-white/5">
                                <p className="text-[10px] font-bold uppercase text-gray-400 tracking-wider mb-1">Ends</p>
                                <div className="flex flex-col">
                                    <span className="font-bold text-red-600 text-sm">
                                        {new Date(challenge.endAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </span>
                                    <span className="text-[10px] font-medium text-gray-400">
                                        at {new Date(challenge.endAt).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <h3 className="text-xs font-bold text-gray-900 dark:text-white mb-3 uppercase tracking-wide opacity-80">Description</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                {challenge.description}
                            </p>
                        </div>

                        {/* Rules */}
                        <div className="flex-1">
                            <h3 className="text-xs font-bold text-gray-900 dark:text-white mb-3 uppercase tracking-wide opacity-80 flex items-center gap-1">
                                Rules for Participation
                                <span className="material-symbols-outlined text-red-600 text-sm">help</span>
                            </h3>
                            <ul className="grid gap-2">
                                {challenge.rules && challenge.rules.length > 0 ? (
                                    challenge.rules.map((rule, index) => (
                                        <li key={index} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-white/5 p-3 rounded-lg border border-transparent hover:border-gray-200 dark:hover:border-white/10 transition-colors">
                                            <span className="mt-1.5 size-1 rounded-full bg-primary flex-shrink-0 opacity-80" />
                                            <span className="leading-snug">{rule}</span>
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-gray-500 text-sm italic">Standard competition rules apply.</li>
                                )}
                            </ul>
                        </div>

                        {/* Actions - Sticky Floating */}
                        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-white/5 flex gap-3 sticky bottom-0 bg-white/80 dark:bg-[#18181b]/95 backdrop-blur-sm -mb-2 pb-2">
                            {challenge.status === 'UPCOMING' ? (
                                <button
                                    disabled
                                    className="flex-1 h-12 flex items-center justify-center gap-2 rounded-xl font-bold text-gray-400 bg-gray-200 dark:bg-white/5 cursor-not-allowed transition-all text-sm"
                                >
                                    <span className="material-symbols-outlined text-lg">lock</span>
                                    <span className="hidden md:inline">Entries Locked</span>
                                </button>
                            ) : (
                                <Link
                                    to={`/challenge/entries`}
                                    className="flex-1 h-12 flex items-center justify-center gap-2 rounded-xl font-bold text-gray-700 dark:text-white bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-all text-sm"
                                >
                                    <span className="material-symbols-outlined text-lg">visibility</span>
                                    <span className="hidden md:inline">View Entries</span>
                                </Link>
                            )}
                            {challenge.status === 'ACTIVE' ? (
                                <Link
                                    to={`/upload/${challenge._id}`}
                                    className="flex-1 h-12 flex items-center justify-center gap-2 rounded-xl font-bold text-white bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all text-sm active:scale-[0.98]"
                                >
                                    <span className="material-symbols-outlined text-lg">upload</span>
                                    <span className="hidden md:inline">Upload Entry</span>
                                </Link>
                            ) : (
                                <button
                                    disabled
                                    className="flex-1 h-12 flex items-center justify-center gap-2 rounded-xl font-bold text-gray-400 bg-gray-200 dark:bg-white/5 cursor-not-allowed transition-all text-sm"
                                >
                                    <span className="material-symbols-outlined text-lg">lock</span>
                                    <span className="hidden md:inline">
                                        {challenge.status === 'UPCOMING' ? 'Opens Soon' : 'Closed'}
                                    </span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
