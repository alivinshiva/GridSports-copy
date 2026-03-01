import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllRandomSubmissions } from "@/services/submissionService";
import { Loader2 } from "lucide-react";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";

const EntryCard = ({ entry, handleEntryClick, muted, toggleMute }) => {
    const videoRef = useRef(null);

    const handleMouseEnter = () => {
        if (entry.mediaType === 'video' && videoRef.current) {
            videoRef.current.play().catch(() => {});
        }
    };

    const handleMouseLeave = () => {
        if (entry.mediaType === 'video' && videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    };

    return (
        <div
            className="group relative flex flex-col bg-white dark:bg-white/5 rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 hover:border-primary/50 transition-all shadow-sm hover:shadow-md aspect-[9/16]"
            onClick={() => handleEntryClick(entry)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="relative w-full h-full bg-black overflow-hidden">
                {entry.mediaType === 'video' ? (
                    <video
                        ref={videoRef}
                        src={entry.mediaUrl}
                        className="w-full h-full object-cover"
                        muted={muted}
                        playsInline
                        loop
                    />
                ) : (
                    <img src={entry.mediaUrl} alt="Submission" className="w-full h-full object-cover" />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-30 pointer-events-none"></div>

                {entry.mediaType === 'video' && (
                    <div className="absolute bottom-3 right-3 z-20">
                        <button
                            onClick={toggleMute}
                            className="bg-black/40 backdrop-blur-sm p-2 rounded-full hover:bg-black/60 transition-colors"
                        >
                            <span className="material-symbols-outlined text-white text-lg">
                                {muted ? 'volume_off' : 'volume_up'}
                            </span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

const ChallengeEntries = () => {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(false);

    const [muted, setMuted] = useState(true);

    const navigate = useNavigate();

    const fetchRandomEntries = useCallback(async () => {
        if (loading) return;
        setLoading(true);
        try {
            const response = await getAllRandomSubmissions(15);
            if (response.success && response.data.length > 0) {
                setEntries(prev => {
                    const newEntries = response.data.filter(newItem =>
                        !prev.some(existing => existing._id === newItem._id)
                    );
                    return [...prev, ...newEntries];
                });
            }
        } catch (error) {
            // Silently handle error
        } finally {
            setLoading(false);
        }
    }, [loading]);

    useEffect(() => {
        fetchRandomEntries();
    }, []);

    const toggleMute = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setMuted(!muted);
    };

    const handleEntryClick = (entry) => {
        const clickedIndex = entries.findIndex(e => e._id === entry._id);
        const preloadedFeed = clickedIndex !== -1 ? entries.slice(clickedIndex) : [entry];

        navigate('/challenge/feed', {
            state: {
                initialEntry: entry,
                preloadedFeed: preloadedFeed
            }
        });
    };

    return (
        <AuthenticatedLayout>
            {/* Entry Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
                {entries.map((entry, index) => {
                    return (
                        <EntryCard
                            key={`${entry._id}-${index}`}
                            entry={entry}
                            handleEntryClick={handleEntryClick}
                            muted={muted}
                            toggleMute={toggleMute}
                        />
                    );
                })}
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex flex-col items-center justify-center py-8 gap-3">
                    <Loader2 className="animate-spin text-primary w-6 h-6" />
                </div>
            )}
        </AuthenticatedLayout>
    );
};

export { ChallengeEntries };
