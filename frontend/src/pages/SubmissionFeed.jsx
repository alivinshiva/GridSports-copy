import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAllRandomSubmissions, rateSubmission, recordShare, rateDetailed } from "@/services/submissionService";
import { Loader2, ArrowLeft, Volume2, VolumeX, Heart, ThumbsUp, ThumbsDown, Share2, Facebook, Instagram, MessageCircle, Link as LinkIcon, X, CheckSquare, Star } from "lucide-react";
import { HomeHeader } from "@/components/home/HomeHeader";
import { BottomNav } from "@/components/home/BottomNav";

const SubmissionFeed = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const initialEntry = location.state?.initialEntry;
    const preloadedFeed = location.state?.preloadedFeed;

    // Initialize feed with preloaded data (optimized) or just clicked entry
    const [feed, setFeed] = useState(preloadedFeed && preloadedFeed.length > 0 ? preloadedFeed : (initialEntry ? [initialEntry] : []));
    const [loading, setLoading] = useState(false);
    const [muted, setMuted] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const [retryCount, setRetryCount] = useState(0); // Track retries for empty responses
    const [ratingsState, setRatingsState] = useState({}); // { [id]: 'LOVE'|'LIKE'|'DISLIKE' }
    const [detailedRatingsState, setDetailedRatingsState] = useState({}); // { [subId]: { [paramName]: score } }
    const [activeShare, setActiveShare] = useState(null); // ID of submission being shared
    const [activeSubmissionId, setActiveSubmissionId] = useState(null);
    const observer = useRef();
    const visibilityObserver = useRef();

    const fetchMoreEntries = useCallback(async () => {
        if (loading || (!hasMore && retryCount >= 1)) return; // Stop if no more and retried once
        setLoading(true);
        try {
            const response = await getAllRandomSubmissions(15);
            if (response.success && response.data.length > 0) {
                setFeed(prev => {
                    const newEntries = response.data.filter(newItem =>
                        !prev.some(existing => existing._id === newItem._id)
                    );
                    return [...prev, ...newEntries];
                });
                setRetryCount(0); // Reset retry on success
                setHasMore(true);
            } else {
                // If empty, increment retry. If it was 0, we'll try one more time immediately (next trigger or effect)
                // But generally if API returns 0, we might want to stop. User said "call once time again to verify".
                if (retryCount === 0) {
                    setRetryCount(1);
                    // Automatically try again immediately? Or just leave it for next scroll trigger?
                    // User said "call once time again to verify and than stop".
                    // Let's try again in 500ms to verify.
                    setTimeout(() => {
                        setLoading(false);
                        fetchMoreEntries();
                    }, 500);
                    return; // Return here so we don't clear loading yet (handled in timeout)
                } else {
                    setHasMore(false);
                }
            }
        } catch (error) {
            console.error("Error fetching feed:", error);
        } finally {
            setLoading(false);
        }
    }, [loading, hasMore, retryCount]);

    // Initial fetch
    useEffect(() => {
        if (feed.length < 5) {
            fetchMoreEntries();
        }
    }, []);

    // 1 Minute Interval to check for new data if we stopped
    useEffect(() => {
        if (!hasMore) {
            const interval = setInterval(() => {
                // Try resetting to see if new data exists
                console.log("Feed interval checking for new data...");
                setRetryCount(0);
                setHasMore(true);
                // We don't call fetchMoreEntries here directly to avoid closure staleness.
                // The state change to hasMore=true will trigger the effect below or the observer.
            }, 60000); // 1 minute
            return () => clearInterval(interval);
        }
    }, [hasMore]);

    // Effect to trigger fetch if we have 'hasMore' but feed is empty (Recovery)
    useEffect(() => {
        if (hasMore && !loading && feed.length === 0) {
            fetchMoreEntries();
        }
    }, [hasMore, loading, feed.length, fetchMoreEntries]);

    // Intersection Observer
    const lastElementRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                fetchMoreEntries();
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, fetchMoreEntries, hasMore]);

    // Clean up observer
    useEffect(() => {
        return () => {
            if (observer.current) observer.current.disconnect();
            if (visibilityObserver.current) visibilityObserver.current.disconnect();
        }
    }, []);

    // Active element tracking & Auto-saving detailed ratings
    useEffect(() => {
        visibilityObserver.current = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const newId = entry.target.getAttribute('data-id');
                    setActiveSubmissionId(prevId => {
                        // When scrolling away from the previous detailed challenge, save its rating
                        if (prevId && prevId !== newId) {
                            submitDetailedRatings(prevId);
                        }
                        return newId;
                    });
                }
            });
        }, { threshold: 0.6 });

        // Observe all currently rendered sub elements
        const elements = document.querySelectorAll('.submission-slide');
        elements.forEach(el => visibilityObserver.current.observe(el));

        return () => {
            if (visibilityObserver.current) visibilityObserver.current.disconnect();
        };
    }, [feed]);

    // Handle Unmount saving
    useEffect(() => {
        return () => {
            if (activeSubmissionId) submitDetailedRatings(activeSubmissionId);
        }
    }, [activeSubmissionId]);

    const submitDetailedRatings = async (submissionId) => {
        const submission = feed.find(f => f._id === submissionId);
        // Only if detailed
        if (submission?.challenge?.scoringType !== 'DETAILED') return;

        const currentRatingsObj = detailedRatingsState[submissionId];
        if (!currentRatingsObj || Object.keys(currentRatingsObj).length === 0) return;

        // Convert obj to array expected by backend
        const ratingsArray = Object.entries(currentRatingsObj).map(([paramName, score]) => ({
            parameterName: paramName,
            score
        }));

        try {
            // Log exactly what user requested
            const average = ratingsArray.length > 0 ? ratingsArray.reduce((acc, curr) => acc + curr.score, 0) / ratingsArray.length : 0;
            console.log(`--- Ratings Log for Submission ${submissionId} ---`);
            ratingsArray.forEach(r => console.log(`${r.parameterName}: ${r.score}`));
            console.log(`Average Score: ${average}`);
            console.log(`-----------------------------------------------`);

            await rateDetailed(submissionId, submission.challenge._id, ratingsArray);
            console.log(`Saved detailed ratings to backend for ${submissionId}`);
            // Optionally clear state to avoid resubmitting if swiped back and forth without changes:
            // But if user changes, it will re-record. Backend handles upsert.
        } catch (error) {
            console.error("Error auto-saving detailed rating:", error);
        }
    };

    const handleDetailedRate = (e, submissionId, paramName, score) => {
        e.stopPropagation();
        setDetailedRatingsState(prev => ({
            ...prev,
            [submissionId]: {
                ...(prev[submissionId] || {}),
                [paramName]: score
            }
        }));
    };

    // Toggle mute
    const toggleMute = (e) => {
        e.stopPropagation();
        setMuted(!muted);
    };

    const handleRate = async (e, submissionId, ratingType) => {
        e.stopPropagation();

        // Optimistic UI Update
        setRatingsState(prev => ({
            ...prev,
            [submissionId]: ratingType
        }));

        try {
            const res = await rateSubmission(submissionId, ratingType);
            if (res.success) {
                console.log(`Successfully rated ${ratingType}. Ranker got ${res.data.rankerPointsEarned} pts, Creator got ${res.data.creatorPointsEarned} pts.`);
            } else {
                console.log("Failed: ", res.message);
            }
        } catch (error) {
            console.error("Rating Error:", error);
            // Revert state if we wanted to be strict, but for UX it's fine.
            // alert(error.message || "Failed to submit rating.");
        }
    };

    const handleShareClick = (e, submissionId) => {
        e.stopPropagation();
        setActiveShare(submissionId);
    };

    const handleSocialShare = async (platform) => {
        if (!activeShare) return;

        // Record points in backend
        try {
            const res = await recordShare(activeShare);
            if (res.success) {
                console.log(`Successfully shared to ${platform}. Earned ${res.data.pointsEarned} pts.`);
            }
        } catch (error) {
            console.error("Share backend Error:", error);
        }

        // Logic to actually share via platform URL or copy link
        const shareUrl = window.location.href; // In a real app we'd construct a specific URL
        if (platform === 'whatsapp') {
            window.open(`https://wa.me/?text=Check out this video! ${shareUrl}`, '_blank');
        } else if (platform === 'facebook') {
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
        } else if (platform === 'copy') {
            navigator.clipboard.writeText(shareUrl);
            alert("Link copied to clipboard!");
        } else {
            // Native share fallback if available
            if (navigator.share) {
                navigator.share({
                    title: 'Check out this submission!',
                    url: shareUrl
                }).catch(console.error);
            }
        }

        setActiveShare(null); // Close popup
    };

    return (
        <div className="bg-black h-screen w-full overflow-hidden flex flex-col font-display md:bg-zinc-900 relative">
            <HomeHeader />

            {/* Vertical Scroll Snap Container */}
            <div className="flex-1 w-full md:max-w-[420px] mx-auto bg-black overflow-y-scroll snap-y snap-mandatory no-scrollbar shadow-2xl relative" style={{ scrollBehavior: 'smooth' }}>
                {feed.map((entry, index) => {
                    // Trigger load when 5 items remaining (visited approx 10 if total 15)
                    const isLast = index === feed.length - 5;
                    // Fallback for very short lists to trigger at end
                    const isAlsoLast = index === feed.length - 1 && feed.length < 5;

                    const shouldTrigger = isLast || isAlsoLast;
                    return (
                        <div
                            key={`${entry._id}-${index}`}
                            ref={shouldTrigger ? lastElementRef : null}
                            data-id={entry._id}
                            className="submission-slide h-full w-full snap-start snap-always relative flex items-center justify-center bg-black"
                        >
                            {/* Media */}
                            <div className="relative w-full h-full flex items-center justify-center" onClick={toggleMute}>
                                {entry.mediaType === 'video' ? (
                                    <video
                                        src={entry.mediaUrl}
                                        className="h-full w-full object-contain"
                                        playsInline
                                        autoPlay={true}
                                        muted={muted}
                                        loop
                                    />
                                ) : (
                                    <img
                                        src={entry.mediaUrl}
                                        className="h-full w-full object-contain"
                                        alt="Submission"
                                    />
                                )}

                                {/* Gradient Overlay */}
                                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none"></div>
                            </div>

                            {/* Actions Container */}
                            <div className="absolute inset-x-0 bottom-24 z-20 pointer-events-none">
                                {/* Vertical Sidebar (Share, Mute) positioned above Love icon */}
                                <div className="absolute right-6 bottom-full mb-6 flex flex-col items-center gap-6 text-white pointer-events-auto">
                                    <button onClick={(e) => handleShareClick(e, entry._id)} className="flex flex-col items-center gap-1 transition-transform active:scale-95">
                                        <div className="p-3 bg-white/10 backdrop-blur-md rounded-full shadow-lg">
                                            <Share2 size={24} />
                                        </div>
                                        <span className="text-xs font-bold drop-shadow-md">Share</span>
                                    </button>

                                    {entry.mediaType === 'video' && (
                                        <button onClick={toggleMute} className="p-3 bg-white/10 backdrop-blur-md rounded-full">
                                            {muted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                                        </button>
                                    )}
                                </div>

                                {/* Conditionally Render Rating UI */}
                                {entry.challenge?.scoringType === 'DETAILED' ? (
                                    <div className="flex flex-col w-full px-4 pb-4 text-white pointer-events-auto bg-transparent pt-4">
                                        <div className="space-y-3">
                                            {entry.challenge?.parameters?.map((param, pIdx) => {
                                                const maxPts = param.maxPoints;
                                                const tiles = 5; // Always show 5 stars
                                                const currentScore = detailedRatingsState[entry._id]?.[param.name] || 0;

                                                const paramSubtitles = {
                                                    'Clarity': 'Fresh idea',
                                                    'Execution': 'Clean / polished',
                                                    'Impact': 'Wow / emotion'
                                                };
                                                // Try case-insensitive lookup
                                                const subKey = Object.keys(paramSubtitles).find(k => k.toLowerCase() === param.name.toLowerCase());
                                                const subtitle = subKey ? paramSubtitles[subKey] : '';

                                                return (
                                                    <div key={pIdx} className="flex flex-col gap-1 w-full px-2">
                                                        <div className="flex justify-between items-center pb-1">
                                                            <div className="flex flex-col justify-center">
                                                                <span className="text-[17px] font-bold tracking-wide drop-shadow-md leading-tight">{param.name}</span>
                                                                {subtitle && <span className="text-[13px] text-[#8b8793] font-medium mt-0.5">{subtitle}</span>}
                                                            </div>
                                                            <div className="flex flex-row gap-2 ml-4">
                                                                {Array.from({ length: tiles }).map((_, tIdx) => {
                                                                    const tileVal = Math.round(((tIdx + 1) / 5) * maxPts);
                                                                    const isActive = currentScore >= tileVal;

                                                                    return (
                                                                        <button
                                                                            key={tIdx}
                                                                            onClick={(e) => handleDetailedRate(e, entry._id, param.name, tileVal)}
                                                                            className="w-[30px] h-[30px] flex items-center justify-center rounded-lg transition-transform active:scale-90 border-none bg-transparent"
                                                                        >
                                                                            <Star
                                                                                size={26}
                                                                                className={`drop-shadow-md transition-colors ${isActive ? "fill-[#cca651] stroke-[#cca651] text-[#cca651]" : "fill-transparent stroke-white/40"}`}
                                                                            />
                                                                        </button>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                        {pIdx !== entry.challenge.parameters.length - 1 && (
                                                            <div className="w-full h-[1px] bg-white/10 mt-2 mb-1"></div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-row flex-nowrap items-center justify-between w-full px-8 text-white pointer-events-auto">
                                        <button
                                            onClick={(e) => handleRate(e, entry._id, 'DISLIKE')}
                                            className="flex flex-col items-center gap-1 transition-transform active:scale-95 group"
                                        >
                                            <div className={`p-3 backdrop-blur-md rounded-full transition-colors flex items-center justify-center ${ratingsState[entry._id] === 'DISLIKE' ? 'bg-orange-500/20' : 'bg-white/10 group-hover:bg-white/20'}`}>
                                                <ThumbsDown size={28} className={ratingsState[entry._id] === 'DISLIKE' ? 'fill-orange-500 stroke-orange-500' : 'fill-transparent stroke-white'} />
                                            </div>
                                            <span className={`text-xs font-bold drop-shadow-md ${ratingsState[entry._id] === 'DISLIKE' ? 'text-orange-500' : 'text-white'}`}>Dislike</span>
                                        </button>

                                        <button
                                            onClick={(e) => handleRate(e, entry._id, 'LIKE')}
                                            className="flex flex-col items-center gap-1 transition-transform active:scale-95 group"
                                        >
                                            <div className={`p-3 backdrop-blur-md rounded-full transition-colors flex items-center justify-center ${ratingsState[entry._id] === 'LIKE' ? 'bg-yellow-400/20' : 'bg-white/10 group-hover:bg-white/20'}`}>
                                                <ThumbsUp size={28} className={ratingsState[entry._id] === 'LIKE' ? 'fill-yellow-400 stroke-yellow-400' : 'fill-transparent stroke-white'} />
                                            </div>
                                            <span className={`text-xs font-bold drop-shadow-md ${ratingsState[entry._id] === 'LIKE' ? 'text-yellow-400' : 'text-white'}`}>Like</span>
                                        </button>

                                        <button
                                            onClick={(e) => handleRate(e, entry._id, 'LOVE')}
                                            className="flex flex-col items-center gap-1 transition-transform active:scale-95 group"
                                        >
                                            <div className={`p-3 backdrop-blur-md rounded-full transition-colors flex items-center justify-center ${ratingsState[entry._id] === 'LOVE' ? 'bg-red-500/20' : 'bg-white/10 group-hover:bg-white/20'}`}>
                                                <Heart size={28} className={ratingsState[entry._id] === 'LOVE' ? 'fill-red-500 stroke-red-500' : 'fill-transparent stroke-white'} />
                                            </div>
                                            <span className={`text-xs font-bold drop-shadow-md ${ratingsState[entry._id] === 'LOVE' ? 'text-red-500' : 'text-white'}`}>Love</span>
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Bottom Info */}
                            {/* Keeping it minimal as per "only image and video" request, but usually a feed has SOME info. 
                                User said "remove all submissions from the challenge/entries... remove the user static profile data etc i only want image and video rest nothing".
                                For this details view, I will stick to minimal. Maybe just a small indicator if needed.
                                For now, purely full screen media.
                            */}
                        </div>
                    );
                })}

                {loading && (
                    <div className="h-20 w-full flex items-center justify-center absolute bottom-0 z-50">
                        <Loader2 className="animate-spin-slow text-white w-8 h-8" />
                    </div>
                )}
            </div>

            {/* Share Popup Overlay */}
            {activeShare && (
                <div className="absolute inset-0 z-[60] flex items-end justify-center pointer-events-auto" onClick={() => setActiveShare(null)}>
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" />

                    {/* Popup Drawer style */}
                    <div
                        className="relative w-full md:max-w-[420px] bg-[#1c140d] dark:bg-zinc-900 rounded-t-3xl border-t border-white/10 shadow-2xl pb-[100px] pt-6 px-6 transform transition-transform"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-6" />

                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold text-white tracking-tight">Share to</h3>
                            <button onClick={() => setActiveShare(null)} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors text-white">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="grid grid-cols-4 gap-4">
                            <button onClick={() => handleSocialShare('whatsapp')} className="flex flex-col items-center gap-3 group">
                                <div className="w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                                    <MessageCircle size={28} />
                                </div>
                                <span className="text-xs font-medium text-gray-300">WhatsApp</span>
                            </button>

                            <button onClick={() => handleSocialShare('instagram')} className="flex flex-col items-center gap-3 group">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                                    <Instagram size={28} />
                                </div>
                                <span className="text-xs font-medium text-gray-300">Instagram</span>
                            </button>

                            <button onClick={() => handleSocialShare('facebook')} className="flex flex-col items-center gap-3 group">
                                <div className="w-14 h-14 rounded-full bg-[#1877F2] flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                                    <Facebook size={28} />
                                </div>
                                <span className="text-xs font-medium text-gray-300">Facebook</span>
                            </button>

                            <button onClick={() => handleSocialShare('copy')} className="flex flex-col items-center gap-3 group">
                                <div className="w-14 h-14 rounded-full bg-zinc-700 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                                    <LinkIcon size={28} />
                                </div>
                                <span className="text-xs font-medium text-gray-300">Copy Link</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <BottomNav />
        </div>
    );
};

export default SubmissionFeed;
