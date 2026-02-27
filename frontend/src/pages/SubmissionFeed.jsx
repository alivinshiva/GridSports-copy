import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, Link, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { getFeedIds, getBatchSubmissions, rateSubmission, recordShare, rateDetailed, getSingleSubmission } from "@/services/submissionService";
import { Loader2, ArrowLeft, Facebook, Instagram, MessageCircle, Link as LinkIcon, X, CheckSquare, Star, Home, User, Send } from "lucide-react";
import { BottomNav } from "@/components/home/BottomNav";

const FEED_STORAGE = {
    queue: 'feed_queue_v1',
    pointer: 'feed_pointer_v1',
    seen: 'feed_seen_v1'
};

const INITIAL_LIMIT = 50;
const REFILL_LIMIT = 50;
const REFILL_THRESHOLD = 8;
const BATCH_SIZE = 10;
const VIEW_REMOVE_DELAY_MS = 120000;

const readSession = (key, fallback) => {
    try {
        const raw = sessionStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
        console.error("Failed to read session storage", error);
        return fallback;
    }
};

const writeSession = (key, value) => {
    try {
        sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error("Failed to write session storage", error);
    }
};

const uniq = (arr) => Array.from(new Set(arr));

const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

const FeedDesktopSidebar = () => {
    const location = useLocation();
    const isActive = (path) => {
        if (path === '/' && location.pathname !== '/') return false;
        return location.pathname.startsWith(path);
    };

    return (
        <div className="hidden md:flex flex-col w-[250px] h-full border-r border-white/10 bg-black pt-8 px-4 flex-shrink-0 z-50">
            <div className="mb-10 px-4">
                <h1 className="text-2xl font-extrabold tracking-tight text-white drop-shadow-md cursor-pointer pb-2 border-b border-white/10">Grid Sports</h1>
            </div>

            <nav className="flex flex-col gap-2">
                <Link to="/" className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${isActive('/') ? 'bg-white/10 text-white font-bold' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                    <Home size={24} />
                    <span className="text-sm uppercase tracking-wider">Home</span>
                </Link>

                <Link to="/challenge/feed" className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${isActive('/challenge/feed') ? 'bg-white/10 text-white font-bold' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                    <span className="material-symbols-outlined text-[24px]">sports_score</span>
                    <span className="text-sm uppercase tracking-wider">Discovery</span>
                </Link>

                <Link to="/raceboard" className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${isActive('/raceboard') ? 'bg-white/10 text-white font-bold' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                    <span className="material-symbols-outlined text-[24px]">leaderboard</span>
                    <span className="text-sm uppercase tracking-wider">Rank</span>
                </Link>

                <Link to="/profile" className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${isActive('/profile') ? 'bg-white/10 text-white font-bold' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                    <User size={24} />
                    <span className="text-sm uppercase tracking-wider">Profile</span>
                </Link>
            </nav>
        </div>
    );
};

const SubmissionFeed = () => {
    const location = useLocation();
    const { postId } = useParams();
    const initialEntry = location.state?.initialEntry;
    const preloadedFeed = location.state?.preloadedFeed;
    const feedContainerRef = useRef(null);
    const removalTimersRef = useRef({});
    const isInitializingRef = useRef(false);
    const isRefilling = useRef(false);

    // Initialize feed with preloaded data (optimized) or just clicked entry
    const [feed, setFeed] = useState([]);
    const [loading, setLoading] = useState(false);
    const [muted, setMuted] = useState(true);
    const [ratingsState, setRatingsState] = useState({}); // { [id]: 'LOVE'|'LIKE'|'DISLIKE' }
    const [detailedRatingsState, setDetailedRatingsState] = useState({}); // { [subId]: { [paramName]: score } }
    const [selectedCommentState, setSelectedCommentState] = useState({}); // { [subId]: 'Comment string' }
    const [activeShare, setActiveShare] = useState(null); // ID of submission being shared
    const [submittedDetailedState, setSubmittedDetailedState] = useState({}); // { [subId]: true } after explicit submit

    const getSessionState = useCallback(() => {
        return {
            queue: readSession(FEED_STORAGE.queue, []),
            pointer: readSession(FEED_STORAGE.pointer, 0),
            seen: readSession(FEED_STORAGE.seen, [])
        };
    }, []);

    const saveSessionState = useCallback((queue, pointer, seen) => {
        writeSession(FEED_STORAGE.queue, queue);
        writeSession(FEED_STORAGE.pointer, pointer);
        writeSession(FEED_STORAGE.seen, seen);
    }, []);

    const removeIdsFromQueue = useCallback((idsToRemove) => {
        const idsSet = new Set(idsToRemove);
        const { queue, pointer, seen } = getSessionState();

        if (!Array.isArray(queue) || queue.length === 0) return;

        let removedBeforePointer = 0;
        const nextQueue = [];

        queue.forEach((id, index) => {
            if (idsSet.has(id)) {
                if (index < pointer) removedBeforePointer += 1;
            } else {
                nextQueue.push(id);
            }
        });

        const nextPointer = Math.max(0, pointer - removedBeforePointer);
        const nextSeen = uniq([...seen, ...idsToRemove]);

        saveSessionState(nextQueue, nextPointer, nextSeen);
    }, [getSessionState, saveSessionState]);

    const scheduleRemovalForId = useCallback((id) => {
        if (!id || removalTimersRef.current[id]) return;
        removalTimersRef.current[id] = setTimeout(() => {
            removeIdsFromQueue([id]);
            delete removalTimersRef.current[id];
        }, VIEW_REMOVE_DELAY_MS);
    }, [removeIdsFromQueue]);

    const refillQueueIfNeeded = useCallback(async (queue, pointer, seen) => {
        const remaining = queue.length - pointer;
        console.log("🔍 Refill check - Remaining:", remaining, "Threshold:", REFILL_THRESHOLD);
        
        if (remaining > REFILL_THRESHOLD) {
            console.log("✅ Enough IDs, skipping refill");
            return { queue, pointer, seen };
        }
        if (isRefilling.current) {
            console.log("⏳ Already refilling, skipping");
            return { queue, pointer, seen };
        }

        isRefilling.current = true;
        try {
            // If pointer is at the end and we have some items, start with fresh batch (reshuffle + mark old as seen)
            if (pointer >= queue.length && queue.length > 0) {
                console.log("🔁 Reached end of queue, reshuffling existing items...");
                const reshuffled = shuffleArray(queue);
                saveSessionState(reshuffled, 0, seen);
                return { queue: reshuffled, pointer: 0, seen };
            }

            // Otherwise, fetch new items
            console.log("🆕 Fetching new items, excluding:", [...queue, ...seen].length);
            const excludeIds = uniq([...queue, ...seen]);
            const response = await getFeedIds(REFILL_LIMIT, excludeIds);
            const newIds = response?.success ? response.data?.ids || [] : [];
            console.log("📦 Refill got:", newIds.length, "new IDs");
            
            if (newIds.length === 0) {
                console.log("⚠️ No new IDs available, reshuffling queue");
                if (queue.length > 0) {
                    const reshuffled = shuffleArray(queue);
                    saveSessionState(reshuffled, 0, seen);
                    return { queue: reshuffled, pointer: 0, seen };
                }
                return { queue, pointer, seen };
            }

            const shuffled = shuffleArray(newIds);
            const mergedQueue = [...queue, ...shuffled];
            saveSessionState(mergedQueue, pointer, seen);
            console.log("✅ Refill complete, new queue size:", mergedQueue.length);
            return { queue: mergedQueue, pointer, seen };
        } catch (error) {
            console.error("Error refilling feed queue:", error);
            return { queue, pointer, seen };
        } finally {
            isRefilling.current = false;
        }
    }, [saveSessionState]);

    const loadNextBatch = useCallback(async () => {
        if (loading) return;
        setLoading(true);

        try {
            let { queue, pointer, seen } = getSessionState();
            console.log("🔄 loadNextBatch - Queue:", queue.length, "Pointer:", pointer, "Seen:", seen.length);
            
            const remaining = queue.length - pointer;
            if (remaining <= REFILL_THRESHOLD) {
                console.log("⚠️ Low IDs, refilling...");
                ({ queue, pointer, seen } = await refillQueueIfNeeded(queue, pointer, seen));
            }

            const idsToFetch = queue.slice(pointer, pointer + BATCH_SIZE);
            console.log("📥 Fetching IDs:", idsToFetch);
            if (idsToFetch.length === 0) {
                console.log("❌ No IDs to fetch");
                return;
            }

            const response = await getBatchSubmissions(idsToFetch);
            console.log("✅ Batch response:", response);
            
            if (response?.success && response.data?.length > 0) {
                console.log("📱 Adding posts to feed:", response.data.length);
                setFeed(prev => {
                    const existing = new Set(prev.map(item => item._id));
                    const nextItems = response.data.filter(item => !existing.has(item._id));
                    console.log("➕ New items to add:", nextItems.length);
                    return [...prev, ...nextItems];
                });
            } else {
                console.log("⛔ Response not successful or no data");
            }

            const nextPointer = pointer + idsToFetch.length;
            saveSessionState(queue, nextPointer, seen);
        } catch (error) {
            console.error("Error loading feed batch:", error);
        } finally {
            setLoading(false);
        }
    }, [getSessionState, loading, refillQueueIfNeeded, saveSessionState]);

    // Initial fetch
    useEffect(() => {
        const initializeFeed = async () => {
            if (isInitializingRef.current) return;
            isInitializingRef.current = true;
            console.log("🚀 Initializing feed...");

            try {
                let seedEntries = [];

                if (preloadedFeed && preloadedFeed.length > 0) {
                    seedEntries = preloadedFeed;
                } else if (initialEntry) {
                    seedEntries = [initialEntry];
                } else if (postId) {
                    try {
                        const res = await getSingleSubmission(postId);
                        if (res.success && res.data) {
                            seedEntries = [res.data];
                        }
                    } catch (e) {
                        console.error("Failed fetching url post ID", e);
                    }
                }

                if (seedEntries.length > 0) {
                    setFeed(seedEntries);
                    const seedIds = seedEntries.map(entry => entry._id).filter(Boolean);
                    const state = getSessionState();
                    const nextSeen = uniq([...state.seen, ...seedIds]);
                    saveSessionState(state.queue, state.pointer, nextSeen);
                    seedIds.forEach((id) => scheduleRemovalForId(id));
                }

                const currentState = getSessionState();
                console.log("📊 Current state - Queue:", currentState.queue.length, "Pointer:", currentState.pointer);
                
                if (!Array.isArray(currentState.queue) || currentState.queue.length === 0) {
                    console.log("📥 Fetching initial IDs...");
                    const excludeIds = uniq([...(currentState.seen || [])]);
                    const response = await getFeedIds(INITIAL_LIMIT, excludeIds);
                    const ids = response?.success ? response.data?.ids || [] : [];
                    console.log("✅ Got IDs:", ids.length);
                    const shuffled = shuffleArray(ids);
                    saveSessionState(shuffled, 0, currentState.seen || []);
                }

                console.log("🎬 Calling loadNextBatch...");
                // Use setTimeout to break circular dependency and call in next tick
                setTimeout(() => {
                    // Re-read state to ensure latest queue/pointer
                    const finalState = getSessionState();
                    const idsToFetch = finalState.queue.slice(finalState.pointer, finalState.pointer + BATCH_SIZE);
                    if (idsToFetch.length > 0) {
                        console.log("📥 Direct fetch of first batch:", idsToFetch.length, "IDs");
                        getBatchSubmissions(idsToFetch).then(response => {
                            if (response?.success && response.data?.length > 0) {
                                setFeed(prev => [...prev, ...response.data]);
                                const nextPointer = finalState.pointer + idsToFetch.length;
                                saveSessionState(finalState.queue, nextPointer, finalState.seen);
                                console.log("✅ First batch loaded:", response.data.length, "posts");
                            }
                        }).catch(err => console.error("Error loading first batch:", err));
                    }
                }, 0);
            } finally {
                isInitializingRef.current = false;
            }
        };

        initializeFeed();
    }, [postId]);

    // Hydrate ratings on feed changes
    useEffect(() => {
        if (!feed || feed.length === 0) return;

        setRatingsState(prev => {
            const next = { ...prev };
            feed.forEach(sub => {
                if (sub.userRating && !next[sub._id]) {
                    // Try to preserve exactly what the user selected, or map fallback.
                    let finalRating = sub.userRating;

                    if (sub.challenge?.parameters && sub.challenge.scoringType !== 'DETAILED') {
                        // Find the parameter that matches userRating (case-insensitive for safety since backend might uppercase it)
                        const matchedParam = sub.challenge.parameters.find(
                            p => p.name.toUpperCase() === sub.userRating.toUpperCase() ||
                                sub.userRating.toUpperCase() === 'EASY' // Fallback for old old ratings before param save update
                        );
                        if (matchedParam) {
                            finalRating = matchedParam.name; // Use exact exact name as button expects
                        }
                    }

                    next[sub._id] = finalRating;
                }
            });
            return next;
        });

        setDetailedRatingsState(prev => {
            const next = { ...prev };
            feed.forEach(sub => {
                if (sub.detailedUserRating && sub.detailedUserRating.ratings && !next[sub._id]) {
                    next[sub._id] = sub.detailedUserRating.ratings;
                } else if (sub.userRating === 'DETAILED' && !next[sub._id]) {
                    // Fallback to max score if it was rated before the detailed DB change
                    const fallback = {};
                    if (sub.challenge?.parameters) {
                        sub.challenge.parameters.forEach(p => {
                            fallback[p.name] = p.maxPoints || 5;
                        });
                    }
                    next[sub._id] = fallback;
                }
            });
            return next;
        });

        setSelectedCommentState(prev => {
            const next = { ...prev };
            feed.forEach(sub => {
                if (sub.detailedUserRating && sub.detailedUserRating.comment && !next[sub._id]) {
                    next[sub._id] = sub.detailedUserRating.comment;
                }
            });
            return next;
        });
    }, [feed]);

    useEffect(() => {
        const container = feedContainerRef.current;
        if (!container) return undefined;

        const onScroll = () => {
            const remaining = container.scrollHeight - container.scrollTop - container.clientHeight;
            if (remaining < container.clientHeight * 1.5) {
                loadNextBatch();
            }

            const index = Math.round(container.scrollTop / container.clientHeight);
            const currentEntry = feed[index];
            if (currentEntry?._id) {
                scheduleRemovalForId(currentEntry._id);
            }
        };

        container.addEventListener('scroll', onScroll);
        onScroll();
        return () => container.removeEventListener('scroll', onScroll);
    }, [feed, loadNextBatch, scheduleRemovalForId]);

    useEffect(() => {
        return () => {
            Object.values(removalTimersRef.current).forEach((timerId) => clearTimeout(timerId));
            removalTimersRef.current = {};
        };
    }, []);



    const submitDetailedRatings = async (submissionId) => {
        const submission = feed.find(f => f._id === submissionId);
        if (submission?.challenge?.scoringType !== 'DETAILED') return;

        const currentRatingsObj = detailedRatingsState[submissionId];
        if (!currentRatingsObj || Object.keys(currentRatingsObj).length === 0) {
            toast('Please rate at least one parameter first', { duration: 2000, position: 'bottom-center', style: { background: '#333', color: '#fff', borderRadius: '8px' } });
            return;
        }

        // Convert obj to array expected by backend
        const ratingsArray = Object.entries(currentRatingsObj).map(([paramName, score]) => ({
            parameterName: paramName,
            score
        }));

        const selectedComment = selectedCommentState[submissionId] || null;

        try {
            // Log exactly what user requested (Percentage math)
            console.log(`--- Ratings Log for Submission ${submissionId} ---`);
            let totalWeightedScore = 0;
            ratingsArray.forEach(r => {
                const paramDef = submission.challenge.parameters.find(p => p.name === r.parameterName);
                const weightage = paramDef ? paramDef.maxPoints : 0;
                const baseScore = (r.score / 5) * weightage;
                const finalPercentScore = (weightage / 100) * baseScore;
                totalWeightedScore += finalPercentScore;
                console.log(`${r.parameterName}: ${r.score}⭐ = ${baseScore.toFixed(2)} base. ${weightage}% of ${baseScore.toFixed(2)} = +${finalPercentScore.toFixed(2)}`);
            });
            if (selectedComment) console.log(`Comment: ${selectedComment}`);
            console.log(`Total Percentage Score: ${totalWeightedScore.toFixed(2)} / 100`);
            console.log(`-----------------------------------------------`);

            await rateDetailed(submissionId, submission.challenge._id, ratingsArray, selectedComment);
            console.log(`[Detail Rating] Submitted for ${submissionId}`);
            setSubmittedDetailedState(prev => ({ ...prev, [submissionId]: true }));
        } catch (error) {
            console.error("Error submitting detailed rating:", error);
            toast('Failed to submit rating', { duration: 2000, position: 'bottom-center', style: { background: '#333', color: '#fff', borderRadius: '8px' } });
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

    const handleCommentSelect = (e, submissionId, commentText) => {
        e.stopPropagation();
        setSelectedCommentState(prev => {
            // Toggle off if already selected, otherwise set it
            const isCurrentlySelected = prev[submissionId] === commentText;
            return {
                ...prev,
                [submissionId]: isCurrentlySelected ? null : commentText
            };
        });
    };

    // Toggle mute
    const toggleMute = (e) => {
        e.stopPropagation();
        setMuted(!muted);
    };

    const handleRate = async (e, submissionId, ratingType) => {
        e.stopPropagation();

        if (ratingsState[submissionId]) {
            toast('Already reacted', {
                duration: 2000,
                position: 'bottom-center',
                style: {
                    background: '#333',
                    color: '#fff',
                    borderRadius: '8px',
                },
            });
            return;
        }

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
        const shareUrl = `${window.location.origin}/challenge/feed/${activeShare}`; // Specific post URL
        if (platform === 'whatsapp') {
            window.open(`https://wa.me/?text=Check out this video! ${shareUrl}`, '_blank');
        } else if (platform === 'facebook') {
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
        } else if (platform === 'copy') {
            navigator.clipboard.writeText(shareUrl);
            toast.success("Link copied to clipboard!", {
                duration: 2000,
                position: 'bottom-center',
                style: {
                    background: '#333',
                    color: '#fff',
                    borderRadius: '8px',
                },
            });
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
        <div className="flex w-full h-[100dvh] bg-black overflow-hidden relative">
            <svg style={{ width: 0, height: 0, position: 'absolute' }} aria-hidden="true" focusable="false">
                <defs>
                    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#8c6A00" />
                        <stop offset="50%" stopColor="#FACC15" />
                        <stop offset="100%" stopColor="#F5D76E" />
                    </linearGradient>
                </defs>
            </svg>
            <FeedDesktopSidebar />

            <main className="flex-1 h-full flex justify-center items-center relative z-10 w-full overflow-hidden">
                {/* Back Button for mobile top-left over feed */}
                <div className="absolute top-4 left-4 z-50 md:hidden">
                    <Link to="/" className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/70 transition-colors">
                        <ArrowLeft size={24} />
                    </Link>
                </div>

                {/* Vertical Scroll Snap Container */}
                <div ref={feedContainerRef} className="w-full h-full md:h-[calc(100vh-40px)] md:max-w-[420px] mx-auto bg-black overflow-y-scroll snap-y snap-mandatory no-scrollbar relative md:rounded-2xl md:shadow-[0_0_40px_transparent] md:border md:border-white/5" style={{ scrollBehavior: 'smooth' }}>
                    {feed.map((entry, index) => {
                        return (
                            <div
                                key={`${entry._id}-${index}`}
                                data-id={entry._id}
                                className="submission-slide h-full w-full snap-start snap-always relative flex items-center justify-center bg-black"
                            >
                                {/* Media */}
                                <div className="relative w-full h-full flex items-center justify-center cursor-pointer" onClick={toggleMute}>
                                    {entry.mediaType === 'video' ? (
                                        <video
                                            src={entry.mediaUrl}
                                            className="h-full w-full object-cover"
                                            playsInline
                                            autoPlay={true}
                                            muted={muted}
                                            loop
                                        />
                                    ) : (
                                        <img
                                            src={entry.mediaUrl}
                                            className="h-full w-full object-cover"
                                            alt="Submission"
                                        />
                                    )}

                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none z-10"></div>
                                </div>

                                {/* Uploader Info & Challenge Text Overlay */}
                                <div className="absolute left-4 bottom-32 md:bottom-28 z-30 pointer-events-none flex flex-col gap-2 max-w-[80%]">
                                    {entry.user && (
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-10 h-10 rounded-full bg-cover bg-center border-2 shadow-lg"
                                                style={{
                                                    backgroundImage: `url(${entry.user.profilePic || 'https://via.placeholder.com/150'})`,
                                                    borderColor: entry.user.tribe ? 'white' : 'transparent'
                                                }}
                                            />
                                            <div className="flex flex-col">
                                                <span className="text-white font-bold text-sm drop-shadow-md leading-tight">{entry.user.name || "GridSports User"}</span>
                                                {entry.user.tribe && (
                                                    <span className="text-white/80 text-[10px] uppercase tracking-wider font-semibold drop-shadow-md">
                                                        {entry.user.tribe}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {entry.challenge && (
                                        <div className="mt-1">
                                            <h4 className="text-white font-semibold text-sm drop-shadow-md">
                                                {entry.challenge.name}
                                            </h4>
                                            {entry.challenge.description && (
                                                <p className="text-white/80 text-xs drop-shadow-md line-clamp-2 mt-0.5">
                                                    {entry.challenge.description}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Share Icon Top Right */}
                                <div className="absolute top-6 right-6 z-50 cursor-pointer pointer-events-auto rotate-45" onClick={(e) => handleShareClick(e, entry._id)}>
                                    <Send size={28} className="text-[#3b82f6] fill-[#3b82f6]" style={{ transform: 'rotate(-45deg)' }} />
                                </div>

                                {/* Actions Container */}
                                <div className="absolute inset-x-0 bottom-16 md:bottom-6 z-20 pointer-events-none">
                                    {/* Conditionally Render Rating UI */}
                                    {entry.challenge?.scoringType === 'DETAILED' ? (
                                        <div className="flex flex-col w-full px-4 pb-0 text-white pointer-events-auto bg-transparent pt-4">
                                            {/* Detail Rating Submit Button */}
                                            <div className="flex justify-end w-full px-2 mb-2">
                                                {!submittedDetailedState[entry._id] ? (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            submitDetailedRatings(entry._id);
                                                        }}
                                                        className="p-2 bg-black/50 rounded-full border border-white/20 hover:bg-white/10 transition-colors shadow-lg active:scale-95 flex items-center justify-center rotate-45"
                                                        title="Submit Rating"
                                                    >
                                                        <Send size={20} className="text-[#3b82f6] fill-[#3b82f6]" style={{ transform: 'rotate(-45deg)' }} />
                                                    </button>
                                                ) : (
                                                    <div className="w-10 h-10 bg-green-500 rounded-full shadow-[0_0_18px_rgba(34,197,94,0.5)] flex items-center justify-center" title="Submitted">
                                                        <CheckSquare size={20} className="text-white" />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-3 px-2">
                                                {entry.challenge?.parameters?.map((param, pIdx) => {
                                                    const maxPts = 5;
                                                    const currentScore = detailedRatingsState[entry._id]?.[param.name] || 0;
                                                    const isSubmitted = !!submittedDetailedState[entry._id];

                                                    return (
                                                        <div key={pIdx} className="flex justify-between items-center w-full">
                                                            <span className="text-[14px] font-semibold text-[#3b82f6]">{param.name}</span>
                                                            <div className="flex flex-row gap-2">
                                                                {Array.from({ length: 5 }).map((_, tIdx) => {
                                                                    const tileVal = Math.round(((tIdx + 1) / 5) * maxPts);
                                                                    const isActive = currentScore >= tileVal;

                                                                    return (
                                                                        <button
                                                                            key={tIdx}
                                                                            onClick={(e) => !isSubmitted && handleDetailedRate(e, entry._id, param.name, tileVal)}
                                                                            disabled={isSubmitted}
                                                                            className="flex items-center justify-center transition-transform active:scale-90 border-none bg-transparent disabled:opacity-60 disabled:cursor-not-allowed"
                                                                        >
                                                                            <Star
                                                                                size={20}
                                                                                className={`transition-colors ${isActive ? "" : "text-white fill-transparent"}`}
                                                                                style={isActive ? { fill: "url(#goldGradient)", stroke: "url(#goldGradient)" } : {}}
                                                                            />
                                                                        </button>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            {/* Predefined Comments UI for DETAILED Scoring */}
                                            {entry.challenge?.comments && entry.challenge.comments.length > 0 && (
                                                <div className="mt-6 w-full px-2">
                                                    <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#22d3ee]/80 to-transparent mb-4 shadow-[0_0_8px_#22d3ee]"></div>
                                                    <p className="text-[12px] font-bold text-white mb-3 uppercase tracking-wider">Comments</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {entry.challenge.comments.map((comment, cIdx) => {
                                                            const isSelected = selectedCommentState[entry._id] === comment;
                                                            const isSubmitted = !!submittedDetailedState[entry._id];
                                                            return (
                                                                <button
                                                                    key={cIdx}
                                                                    onClick={(e) => !isSubmitted && handleCommentSelect(e, entry._id, comment)}
                                                                    disabled={isSubmitted}
                                                                    className={`px-4 py-1.5 rounded-[12px] text-xs font-semibold transition-all duration-200 border disabled:opacity-60 disabled:cursor-not-allowed ${isSelected
                                                                        ? 'bg-[#22d3ee] border-[#22d3ee] text-black shadow-[0_0_12px_rgba(34,211,238,0.4)]'
                                                                        : 'bg-black/60 border-[#22d3ee]/80 text-[#22d3ee] hover:bg-[#22d3ee]/20'
                                                                        }`}
                                                                >
                                                                    {comment}
                                                                </button>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            )}


                                        </div>
                                    ) : (
                                        <div className="flex flex-col w-full px-4 pb-6 text-white pointer-events-auto bg-transparent pt-2">
                                            {entry.challenge?.parameters && entry.challenge.parameters.length > 0 && (
                                                <div className="flex w-full gap-2 justify-between mt-2 px-2">
                                                    {entry.challenge.parameters.map((param, pIdx) => {
                                                        const isSelected = ratingsState[entry._id] === param.name;
                                                        return (
                                                            <button
                                                                key={pIdx}
                                                                onClick={(e) => handleRate(e, entry._id, param.name)}
                                                                className={`flex-1 px-2 md:px-4 py-1.5 rounded-[12px] text-xs font-semibold transition-all duration-200 border ${isSelected
                                                                    ? 'bg-[#22d3ee] border-[#22d3ee] text-black shadow-[0_0_12px_rgba(34,211,238,0.4)]'
                                                                    : 'bg-black/60 border-[#22d3ee]/80 text-[#22d3ee] hover:bg-[#22d3ee]/20'
                                                                    } truncate`}
                                                                title={param.name}
                                                            >
                                                                {param.name}
                                                            </button>
                                                        )
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
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
                    <div className="fixed inset-0 z-[100] flex items-end justify-center pointer-events-auto" onClick={() => setActiveShare(null)}>
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
            </main>

            {/* Mobile Bottom Navigation (Floating over bottom) */}
            <div className="md:hidden absolute bottom-0 left-0 right-0 z-50">
                <BottomNav />
            </div>
        </div>
    );
};

export default SubmissionFeed;
