import { useEffect, useState, useRef } from "react";
import { getAllSubmissions } from "@/services/submissionService";

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
            className="w-full h-full bg-black relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <video
                ref={videoRef}
                src={src}
                className="w-full h-full object-cover"
                loop
                muted
                playsInline
            />
            {/* Optional: Play icon overlay when paused? User said "play on hover", usually implies clean look when paused. */}
        </div>
    );
};

export function DiscoveryFeed() {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);

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

    if (loading) {
        return <div className="text-center py-10 opacity-50">Loading feed...</div>;
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
        <section className="py-8">
            <h2 className="text-2xl font-bold tracking-tight mb-6">Discovery Feed</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {submissions.map((item) => (
                    <div
                        key={item._id}
                        className="group relative aspect-[9/16] sm:aspect-square bg-gray-100 dark:bg-[#1e1e1e] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
                    >
                        {item.mediaType === 'video' ? (
                            <VideoItem src={item.mediaUrl} />
                        ) : (
                            <img
                                src={item.mediaUrl}
                                alt="Challenge Submission"
                                className="w-full h-full object-cover"
                            />
                        )}

                        {/* Like Button Overlay */}
                        <div className="absolute bottom-4 right-4 z-10">
                            <button className="flex items-center justify-center size-10 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-red-600 hover:text-white transition-colors">
                                <span className="material-symbols-outlined text-xl">favorite</span>
                            </button>
                        </div>

                        {/* Optional: Challenge Tag */}
                        {item.challenge && (
                            <div className="absolute top-4 left-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <span className="bg-black/60 backdrop-blur-md text-white text-xs px-2 py-1 rounded-md font-medium truncate max-w-[150px] inline-block">
                                    {item.challenge.name}
                                </span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}
