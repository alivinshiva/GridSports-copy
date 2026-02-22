import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllSubmissions } from "@/services/submissionService";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, Play } from "lucide-react";

// Skeleton Loader Component
const SkeletonCard = () => (
    <div className="w-full bg-slate-100 dark:bg-[#1a1a1c] rounded-2xl animate-pulse overflow-hidden">
        {/* Randomish height for masonry feel */}
        <div className="w-full pb-[130%] bg-slate-200 dark:bg-[#252528]"></div>
    </div>
);

const VideoItem = ({ src }) => {
    const videoRef = useRef(null);

    const handleMouseEnter = () => {
        if (videoRef.current) {
            videoRef.current.play().catch(e => console.log("Play interrupted"));
        }
    };

    const handleMouseLeave = () => {
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    };

    return (
        <div
            className="w-full relative h-full flex flex-col"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <video
                ref={videoRef}
                src={src}
                className="w-full h-auto block object-cover"
                loop
                muted
                playsInline
            />
            {/* Play icon overlay - Modern Frosted Glass */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:opacity-0 group-hover:scale-110 transition-all duration-300">
                <div className="w-14 h-14 rounded-full bg-white/20 dark:bg-black/30 backdrop-blur-md border border-white/30 dark:border-white/10 flex items-center justify-center shadow-xl">
                    <Play className="w-6 h-6 text-white ml-1 drop-shadow-md" fill="currentColor" />
                </div>
            </div>
        </div>
    );
};

export function DiscoveryFeed() {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [columns, setColumns] = useState([]);
    const [columnCount, setColumnCount] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const response = await getAllSubmissions();
                if (response.success) {
                    setSubmissions(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch submissions:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSubmissions();
    }, []);

    // Determine column count based on window width
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width < 640) setColumnCount(1);
            else if (width < 1024) setColumnCount(2);
            else if (width < 1280) setColumnCount(3);
            else setColumnCount(4);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Distribute submissions into columns
    useEffect(() => {
        if (!submissions.length && !loading) return;

        // If loading, create fake columns for skeletons
        const itemsToDistribute = loading ? Array(8).fill({ _id: 'skeleton' }) : submissions;

        const cols = Array.from({ length: columnCount }, () => []);
        itemsToDistribute.forEach((item, index) => {
            cols[index % columnCount].push(loading ? { ...item, _id: `skel-${index}` } : item);
        });
        setColumns(cols);
    }, [submissions, columnCount, loading]);

    if (!loading && submissions.length === 0) {
        return (
            <section className="py-8">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950/30 flex items-center justify-center">
                        <Compass className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-400">
                        Discovery
                    </h2>
                </div>
                <div className="text-center py-16 bg-slate-50 dark:bg-[#18181b]/50 rounded-3xl border border-dashed border-slate-200 dark:border-white/10 flex flex-col items-center">
                    <div className="w-16 h-16 bg-white dark:bg-white/5 rounded-full flex items-center justify-center mb-4 shadow-sm">
                        <Compass className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-700 dark:text-white mb-2">No discoveries yet</h3>
                    <p className="text-slate-500 max-w-sm">Be the first to share your challenge submission and inspire the grid!</p>
                </div>
            </section>
        );
    }

    const handleItemClick = (item) => {
        if (loading) return;
        navigate('/challenge/feed', { state: { initialEntry: item } });
    };

    return (
        <section className="py-8 pb-32">
            {/* Enhanced Header */}
            <div className="flex items-center justify-between mb-8 max-w-[1200px] mx-auto px-2">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center shadow-inner shadow-primary/20">
                        <Compass className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                        Discovery
                    </h2>
                </div>

                {!loading && (
                    <div className="px-4 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm font-semibold text-slate-600 dark:text-slate-300 shadow-sm">
                        {submissions.length} <span className="text-slate-400 font-normal">posts</span>
                    </div>
                )}
            </div>

            {/* Masonry Layout */}
            <div className="flex gap-4 items-start max-w-[1200px] mx-auto">
                <AnimatePresence>
                    {columns.map((col, colIndex) => (
                        <div key={colIndex} className="flex-1 flex flex-col gap-4 min-w-0">
                            {col.map((item, itemIndex) => (
                                loading ? (
                                    <SkeletonCard key={item._id} />
                                ) : (
                                    <motion.div
                                        key={item._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: (colIndex + itemIndex) * 0.05 }}
                                        className="group bg-white dark:bg-[#18181b] rounded-2xl overflow-hidden cursor-pointer relative border border-slate-100 dark:border-white/5 hover:border-primary/30 dark:hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1"
                                        onClick={() => handleItemClick(item)}
                                    >
                                        {/* Hover Overlay Gradient */}
                                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none"></div>

                                        {item.mediaType === 'video' ? (
                                            <VideoItem src={item.mediaUrl} />
                                        ) : (
                                            <div className="w-full relative overflow-hidden">
                                                <img
                                                    src={item.mediaUrl}
                                                    alt="Challenge Submission"
                                                    className="w-full h-auto block object-cover transform transition-transform duration-700 group-hover:scale-105"
                                                />
                                            </div>
                                        )}

                                        {/* Subtle overlay info (optional) */}
                                        <div className="absolute bottom-4 left-4 right-4 z-20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-[10px] text-white font-bold shadow-md ring-2 ring-white/20">
                                                    {item.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                                </div>
                                                <span className="text-xs font-semibold text-white drop-shadow-md truncate">
                                                    {item.user?.name || 'Racer'}
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                )
                            ))}
                        </div>
                    ))}
                </AnimatePresence>
            </div>
        </section>
    );
}
