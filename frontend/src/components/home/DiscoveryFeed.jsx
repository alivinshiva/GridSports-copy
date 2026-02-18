import { useEffect, useState, useRef } from "react";
import { getAllSubmissions } from "@/services/submissionService";
import { motion, AnimatePresence } from "framer-motion";

const VideoItem = ({ src, inLightbox = false }) => {
    const videoRef = useRef(null);

    const handleMouseEnter = () => {
        if (!inLightbox && videoRef.current) {
            videoRef.current.play();
        }
    };

    const handleMouseLeave = () => {
        if (!inLightbox && videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    };

    return (
        <div
            className={`w-full relative ${inLightbox ? 'h-full flex items-center justify-center' : ''}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <video
                ref={videoRef}
                src={src}
                className={inLightbox ? "max-w-full max-h-[90vh] object-contain rounded-lg" : "w-full h-auto block rounded-xl"}
                loop={!inLightbox} // Loop in feed, maybe not in lightbox? User didn't specify, keeping consistent.
                muted={!inLightbox} // Muted in feed, Sound ON in lightbox potentially? Let's keep muted by default to avoid blasting.
                controls={inLightbox} // Controls ONLY in lightbox
                playsInline
                autoPlay={inLightbox}
            />
            {/* Play icon overlay - Hidden when playing/hovered in feed, hidden in lightbox */}
            {!inLightbox && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:opacity-0 transition-opacity">
                    <span className="material-symbols-outlined text-white/80 text-4xl drop-shadow-md">play_circle</span>
                </div>
            )}
        </div>
    );
};

export function DiscoveryFeed() {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState(null);

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

    // Lock body scroll when lightbox is open
    useEffect(() => {
        if (selectedItem) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [selectedItem]);


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

    return (
        <section className="py-8 pb-24">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Discovery Feed</h2>
                <span className="text-sm font-medium text-gray-500">{submissions.length} posts</span>
            </div>

            {/* Masonry Layout using CSS Columns with Framer Motion Stagger */}
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
                <AnimatePresence>
                    {submissions.map((item, index) => (
                        <motion.div
                            key={item._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.05 }}
                            className="group break-inside-avoid bg-white dark:bg-[#18181b] rounded-xl overflow-hidden cursor-pointer relative border-4 border-white dark:border-[#2a2a2d] hover:border-gray-500 dark:hover:border-gray-500 transition-colors duration-300 shadow-sm"
                            onClick={() => setSelectedItem(item)}
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
                </AnimatePresence>
            </div>

            {/* Lightbox Modal */}
            <AnimatePresence>
                {selectedItem && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedItem(null)} // Close on background click
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative max-w-5xl w-full max-h-[90vh] flex items-center justify-center"
                            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking content
                        >
                            <button
                                onClick={() => setSelectedItem(null)}
                                className="absolute -top-12 right-0 text-white/50 hover:text-white transition-colors"
                            >
                                <span className="material-symbols-outlined text-4xl">close</span>
                            </button>

                            {selectedItem.mediaType === 'video' ? (
                                <VideoItem src={selectedItem.mediaUrl} inLightbox={true} />
                            ) : (
                                <img
                                    src={selectedItem.mediaUrl}
                                    alt="Full Size"
                                    className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                                />
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
