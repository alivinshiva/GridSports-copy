import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { getChallengeById } from "@/services/challengeService";
import { checkUserSubmission } from "@/services/submissionService";
import { Helmet } from "react-helmet-async";

export default function ChallengeDetails() {
    const { challengeId } = useParams();
    const [challenge, setChallenge] = useState(null);
    const [loading, setLoading] = useState(true);
    const [hasSubmitted, setHasSubmitted] = useState(false);

    useEffect(() => {
        const fetchChallenge = async () => {
            try {
                const response = await getChallengeById(challengeId);
                if (response.success) {
                    setChallenge(response.data);
                }

                // Check submission status
                try {
                    const submissionRes = await checkUserSubmission(challengeId);
                    if (submissionRes.success) {
                        setHasSubmitted(submissionRes.hasSubmitted);
                    }
                } catch (subErr) {
                    // Silently handle error
                }
            } catch (error) {
                // Silently handle error
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
            <Helmet>
                <title>{challenge.name} | SHOWGRID Challenge</title>
                <meta name="description" content={`Participate in the ${challenge.name} challenge on SHOWGRID.`} />
            </Helmet>
            <div className="flex flex-col items-center pb-8 pt-2 sm:pt-8 w-full sm:px-4 bg-[#0a0f16] min-h-screen">
                <div className="w-full bg-[#181920] rounded-[32px] sm:rounded-3xl shadow-2xl border border-white/5 flex flex-col overflow-hidden relative">

                    {/* Back Button (Floating on Image) */}
                    <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20">
                        <Link to="/" className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/70 transition-colors">
                            <span className="material-symbols-outlined text-xl">arrow_back</span>
                        </Link>
                    </div>

                    {/* Top 30% Area: Image */}
                    <div className="w-full h-[30vh] sm:h-[40vh] relative flex-shrink-0 bg-[#121212] flex items-center justify-center">
                        <img
                            src={challenge.imageUrl}
                            alt={challenge.name}
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        {/* Gradient that fades exactly into the card's background color (#181920) */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#181920] via-transparent to-transparent"></div>
                    </div>

                    {/* Bottom 70% Area: Details Container */}
                    <div className="flex-1 w-full px-6 sm:px-10 pb-8 sm:pb-12 pt-4 relative z-10 flex flex-col gap-6 max-w-7xl mx-auto">

                        {/* Header Info */}
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between mb-2">
                                {challenge.weekend ? (
                                    <div className="flex items-center gap-2 font-black text-xs sm:text-sm uppercase tracking-widest flex-wrap drop-shadow-sm">
                                        <span className="material-symbols-outlined text-[16px] hidden sm:inline-block text-[#3b82f6]">flag</span>
                                        <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">{challenge.weekend.location}</span>
                                        <span className="text-gray-500 mx-1">•</span>
                                        <span className="material-symbols-outlined text-[16px] hidden sm:inline-block text-[#3b82f6]">calendar_month</span>
                                        <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">{challenge.weekend.season}</span>
                                    </div>
                                ) : <div />}

                                <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm border ${challenge.status === 'ACTIVE'
                                    ? 'bg-red-900/30 text-red-400 border-red-500/30'
                                    : 'bg-white/5 text-gray-400 border-white/10'
                                    }`}>
                                    {challenge.status === 'ACTIVE' && (
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                        </span>
                                    )}
                                    <span>{challenge.status || 'UPCOMING'}</span>
                                </div>
                            </div>

                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-wide drop-shadow-md">
                                {challenge.name}
                            </h1>
                        </div>

                        {/* Stats Row */}
                        <div className="flex flex-wrap gap-4 py-6 px-6 rounded-2xl bg-gradient-to-r from-[#3b82f6]/5 to-cyan-500/5 border border-[#3b82f6]/10 shadow-[inset_0_0_20px_rgba(6,182,212,0.02)]">
                            <div className="flex-1 min-w-[100px]">
                                <p className="text-[10px] font-bold uppercase text-cyan-400/80 tracking-wider mb-1 flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px]">category</span> Type</p>
                                <p className="font-bold text-white text-base sm:text-lg">{challenge.type}</p>
                            </div>
                            <div className="flex-1 min-w-[100px] border-l border-white/5 pl-4">
                                <p className="text-[10px] font-bold uppercase text-cyan-400/80 tracking-wider mb-1 flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px]">groups</span> Entries</p>
                                <div className="flex items-center gap-1.5">
                                    <span className="font-bold text-white text-base sm:text-lg">{challenge.submissionCount || 0}</span>
                                </div>
                            </div>
                            <div className="flex-1 min-w-[120px] border-l border-white/5 pl-4">
                                <p className="text-[10px] font-bold uppercase text-cyan-400/80 tracking-wider mb-1 flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px]">schedule</span> Ends</p>
                                <div className="flex flex-col">
                                    <span className="font-bold text-white text-base sm:text-lg">
                                        {new Date(challenge.endAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </span>
                                    <span className="text-xs sm:text-sm font-bold text-white mt-0.5">
                                        at {new Date(challenge.endAt).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <h3 className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wide">Description</h3>
                            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                                {challenge.description}
                            </p>
                        </div>

                        {/* Rules */}
                        <div className="bg-gradient-to-br from-[#3b82f6]/10 to-cyan-500/5 p-5 rounded-2xl border border-[#3b82f6]/20 relative overflow-hidden">
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#3b82f6] to-cyan-400"></div>
                            <h3 className="text-xs font-bold text-white mb-3 uppercase tracking-wide flex items-center gap-1">
                                Rules for Participation
                                <span className="material-symbols-outlined text-[#3b82f6] text-[16px] ml-1">help</span>
                            </h3>
                            <ul className="grid gap-2">
                                {challenge.rules && challenge.rules.length > 0 ? (
                                    challenge.rules.map((rule, index) => (
                                        <li key={index} className="flex items-start gap-3 text-sm text-gray-200 bg-black/20 p-3 rounded-xl border border-transparent hover:border-[#3b82f6]/30 transition-colors">
                                            <span className="mt-1.5 size-1.5 rounded-full bg-cyan-400 flex-shrink-0 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                                            <span className="leading-snug">{rule}</span>
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-gray-500 text-sm italic">Standard competition rules apply.</li>
                                )}
                            </ul>
                        </div>

                        {/* Actions Row */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-transparent mt-2">
                            {challenge.status === 'UPCOMING' ? (
                                <button disabled className="flex-1 py-4 flex items-center justify-center gap-2 rounded-full font-bold text-white/50 bg-white/5 cursor-not-allowed text-sm uppercase tracking-widest">
                                    <span className="material-symbols-outlined text-[18px]">lock</span>
                                    Entries Locked
                                </button>
                            ) : (
                                <Link to={`/challenge/entries`} className="flex-1 py-4 flex items-center justify-center gap-2 rounded-full font-bold text-white bg-gradient-to-r from-[#3b82f6]/10 to-cyan-500/10 hover:from-[#3b82f6]/20 hover:to-cyan-500/20 transition-all border-2 border-cyan-500/60 shadow-[0_0_15px_rgba(6,182,212,0.2)] text-sm uppercase tracking-widest relative"
                                >
                                    <span className="material-symbols-outlined text-[18px] text-cyan-400">visibility</span>
                                    View Entries
                                </Link>
                            )}

                            {challenge.status === 'ACTIVE' ? (
                                hasSubmitted ? (
                                    <button disabled className="flex-1 py-4 flex items-center justify-center gap-2 rounded-full font-bold text-white/50 bg-white/5 cursor-not-allowed text-sm uppercase tracking-widest">
                                        <span className="material-symbols-outlined text-[18px]">check_circle</span>
                                        Already Submitted
                                    </button>
                                ) : (
                                    <Link to={`/upload/${challenge._id}`} className="flex-1 py-4 flex items-center justify-center gap-2 rounded-full font-bold text-white bg-gradient-to-r from-[#3B82F6] to-[#2ED1B8] shadow-[0_0_20px_rgba(46,209,184,0.4)] hover:shadow-[0_0_25px_rgba(46,209,184,0.6)] transition-all active:scale-[0.98] text-sm uppercase tracking-widest">
                                        <span className="material-symbols-outlined text-[18px]">upload</span>
                                        Upload Entry
                                    </Link>
                                )
                            ) : (
                                <button disabled className="flex-1 py-4 flex items-center justify-center gap-2 rounded-full font-bold text-white/50 bg-white/5 cursor-not-allowed text-sm uppercase tracking-widest">
                                    <span className="material-symbols-outlined text-[18px]">lock</span>
                                    {challenge.status === 'UPCOMING' ? 'Opens Soon' : 'Closed'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
