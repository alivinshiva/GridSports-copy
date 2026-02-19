import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAllRandomSubmissions } from "@/services/submissionService";
import { Loader2, ArrowLeft, Volume2, VolumeX, Heart, Share2, MoreVertical } from "lucide-react";

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
    const observer = useRef();

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
        }
    }, []);

    // Toggle mute
    const toggleMute = (e) => {
        e.stopPropagation();
        setMuted(!muted);
    };

    return (
        <div className="bg-black h-screen w-full overflow-hidden relative font-display flex justify-center md:bg-zinc-900">
            {/* Back Button Overlay */}
            <div className="absolute top-4 left-4 z-50">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-black/40 transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>
            </div>

            {/* Vertical Scroll Snap Container */}
            <div className="h-full w-full md:max-w-[420px] bg-black overflow-y-scroll snap-y snap-mandatory no-scrollbar shadow-2xl" style={{ scrollBehavior: 'smooth' }}>
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
                            className="h-full w-full snap-start snap-always relative flex items-center justify-center bg-black"
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

                            {/* Right Sidebar Actions */}
                            <div className="absolute right-4 bottom-24 flex flex-col items-center gap-6 z-20 text-white">
                                <button className="flex flex-col items-center gap-1">
                                    <div className="p-3 bg-white/10 backdrop-blur-md rounded-full">
                                        <Heart size={28} className="fill-transparent stroke-white" />
                                    </div>
                                    <span className="text-xs font-bold">Like</span>
                                </button>

                                <button className="flex flex-col items-center gap-1">
                                    <div className="p-3 bg-white/10 backdrop-blur-md rounded-full">
                                        <Share2 size={24} />
                                    </div>
                                    <span className="text-xs font-bold">Share</span>
                                </button>

                                <button className="flex flex-col items-center gap-1">
                                    <div className="p-3 bg-white/10 backdrop-blur-md rounded-full">
                                        <MoreVertical size={24} />
                                    </div>
                                </button>

                                {entry.mediaType === 'video' && (
                                    <button onClick={toggleMute} className="mt-4 p-3 bg-white/10 backdrop-blur-md rounded-full">
                                        {muted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                                    </button>
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
        </div>
    );
};

export default SubmissionFeed;
