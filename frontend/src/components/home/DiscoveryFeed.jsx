import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllSubmissions } from "@/services/submissionService";
import { motion, AnimatePresence } from "framer-motion";

const VideoItem = ({ src }) => {
    const videoRef = useRef(null);

    const handleMouseEnter = () => {
        if (videoRef.current) {
            videoRef.current.play();
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
            className="w-full relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <video
                ref={videoRef}
                src={src}
                className="w-full h-auto block rounded-xl"
                loop
                muted
                playsInline
            />
            {/* Play icon overlay - Hidden when playing/hovered */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:opacity-0 transition-opacity">
                <span className="material-symbols-outlined text-white/80 text-4xl drop-shadow-md">play_circle</span>
            </div>
        </div>
    );
};

export function DiscoveryFeed() {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [columns, setColumns] = useState([]);
    const [columnCount, setColumnCount] = useState(1); // Default to 1
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

        handleResize(); // Initial check
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Distribute submissions into columns
    useEffect(() => {
        if (!submissions.length) return;

        const cols = Array.from({ length: columnCount }, () => []);
        submissions.forEach((item, index) => {
            cols[index % columnCount].push(item);
        });
        setColumns(cols);
    }, [submissions, columnCount]);


    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (submissions.length === 0) {
        return (
            <section className="py-8">
                <h2 className="text-2xl font-bold tracking-tight mb-6">Discovery Feed</h2>
                <div className="text-center py-12 bg-gray-50 dark:bg-[#1e1e1e] rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
                    <p className="text-gray-500">No submissions yet. Be the first to share your challenge!</p>
                </div>
            </section>
        );
    }

    const handleItemClick = (item) => {
        navigate('/challenge/feed', { state: { initialEntry: item } });
    };

    return (
        <section className="py-8 pb-24">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Discovery Feed</h2>
                <span className="text-sm font-medium text-gray-500">{submissions.length} posts</span>
            </div>

            {/* Masonry Layout using JS Columns */}
            <div className="flex gap-4 items-start">
                <AnimatePresence>
                    {columns.map((col, colIndex) => (
                        <div key={colIndex} className="flex-1 flex flex-col gap-4 min-w-0">
                            {col.map((item, itemIndex) => (
                                <motion.div
                                    key={item._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: (colIndex + itemIndex) * 0.05 }}
                                    className="group bg-white dark:bg-[#18181b] rounded-xl overflow-hidden cursor-pointer relative border-4 border-white dark:border-[#2a2a2d] hover:border-gray-500 dark:hover:border-gray-500 transition-colors duration-300 shadow-sm"
                                    onClick={() => handleItemClick(item)}
                                >
                                    {/* Hover Overlay Effect - Subtle Flash/Glow */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 z-10 pointer-events-none"></div>

                                    {item.mediaType === 'video' ? (
                                        <VideoItem src={item.mediaUrl} />
                                    ) : (
                                        <img
                                            src={item.mediaUrl}
                                            alt="Challenge Submission"
                                            className="w-full h-auto block rounded-xl transform transition-transform duration-500 group-hover:scale-[1.02]"
                                        />
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    ))}
                </AnimatePresence>
            </div>
        </section>
    );
}
