import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { useNavigate } from "react-router-dom";
import {
    Edit2,
    Medal,
    Trophy,
    TrendingUp,
    LayoutGrid,
    PlayCircle,
    Users,
    ShieldCheck,
    Award,
    PartyPopper,
    Zap,
    X,
    Loader2
} from "lucide-react";
import { getRankerLeaderboard } from "@/services/leaderboardService";

export default function ProfilePage() {
    const navigate = useNavigate();
    const { fetchProfile } = useAuth();
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null); // Add selectedImage state
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userRank, setUserRank] = useState(null);

    const [activeTab, setActiveTab] = useState("images"); // 'images' or 'videos'

    // Images State
    const [imageSubmissions, setImageSubmissions] = useState([]);
    const [isImagesLoading, setIsImagesLoading] = useState(false);

    // Videos State
    const [videoSubmissions, setVideoSubmissions] = useState([]);
    const [isVideosLoading, setIsVideosLoading] = useState(false);



    const fetchImages = useCallback(async () => {
        setIsImagesLoading(true);
        try {
            // Fetching larger limit (50) to cover "all" recent for profile context
            const response = await fetch(`${import.meta.env.VITE_AD_API_URL}/api/v1/submission/all-image-submission?page=1&limit=50`, {
                credentials: "include",
            });
            const data = await response.json();
            if (data.success) {
                setImageSubmissions(data.data);
            }
        } catch (error) {
            console.error("Error fetching images", error);
        } finally {
            setIsImagesLoading(false);
        }
    }, [isImagesLoading]);

    const fetchVideos = useCallback(async () => {
        setIsVideosLoading(true);
        try {
            // Fetching larger limit (50)
            const response = await fetch(`${import.meta.env.VITE_AD_API_URL}/api/v1/submission/all-video-submission?page=1&limit=50`, {
                credentials: "include",
            });
            const data = await response.json();
            if (data.success) {
                setVideoSubmissions(data.data);
            }
        } catch (error) {
            console.error("Error fetching videos", error);
        } finally {
            setIsVideosLoading(false);
        }
    }, [isVideosLoading]);

    // Initial Load & Polling
    useEffect(() => {
        const fetchAllData = async () => {
            // 1. Fetch Profile
            const profile = await fetchProfile();
            if (profile) {
                setProfileData(profile);
                // Fetch leaderboard to determine rank based on points
                try {
                    const leaderboardData = await getRankerLeaderboard();
                    if (leaderboardData && leaderboardData.data) {
                        const rankInfo = leaderboardData.data.findIndex(u => u._id === profile.user._id);
                        if (rankInfo !== -1) {
                            setUserRank(rankInfo + 1);
                        } else {
                            // If not in the list (e.g., 0 points), we just show a dash or calculate based on total known users
                            setUserRank("Unranked");
                        }
                    }
                } catch (error) {
                    console.error("Failed to fetch leaderboard for rank:", error);
                }
            }
            setLoading(false);

            // 2. Fetch Images & Videos
            fetchImages();
            fetchVideos();
        };

        // Initial Fetch
        fetchAllData();

        // Polling every 2 minutes (120000ms)
        const intervalId = setInterval(() => {
            fetchImages();
            fetchVideos();
            // Optional: Poll profile if needed, but keeping it simple for now as per "only the date is come"
            // If user wants profile polled too:
            const pollProfile = async () => {
                const profile = await fetchProfile();
                if (profile) setProfileData(profile);
            };
            pollProfile();
        }, 120000);

        return () => clearInterval(intervalId);
    }, [fetchProfile]); // fetchProfile is now stable via useCallback





    const profileImage = profileData?.imageUrl;

    const formatTribeName = (tribe) => {
        if (!tribe) return "No Tribe";
        return tribe.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
    };

    if (loading) {
        return (
            <AuthenticatedLayout>
                <div className="flex flex-1 justify-center py-8 items-center min-h-[50vh]">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout>
            {/* Image Modal */}
            {isImageModalOpen && (
                <div
                    className="fixed inset-0 z-[100] bg-black md:bg-black/90 flex items-center justify-center p-4"
                    onClick={() => {
                        setIsImageModalOpen(false);
                        setSelectedImage(null);
                    }}
                >
                    <div className="relative max-w-2xl w-full flex flex-col items-center">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsImageModalOpen(false);
                                setSelectedImage(null);
                            }}
                            className="absolute -top-12 right-0 md:-right-12 text-white p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <X size={32} />
                        </button>
                        <img
                            src={selectedImage || profileImage}
                            alt="Full Screen"
                            className="w-full h-auto max-h-[80vh] object-contain rounded-xl shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                </div>
            )}
            <div className="flex flex-1 justify-center py-8">
                <div className="layout-content-container flex flex-col max-w-[1024px] flex-1 px-4 md:px-0 w-full">

                    {/* Profile Header Section */}
                    <div className="flex p-4 bg-white dark:bg-white/5 rounded-xl mb-6 shadow-sm border border-[#e8dbce] dark:border-white/10">
                        <div className="flex w-full flex-col gap-6 md:flex-row md:justify-between md:items-center">
                            <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center w-full md:w-auto">
                                <div
                                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full min-h-32 w-32 md:min-h-32 md:w-32 border-4 border-primary cursor-pointer hover:opacity-90 transition-opacity"
                                    onClick={() => {
                                        setSelectedImage(profileImage);
                                        setIsImageModalOpen(true);
                                    }}
                                    style={{ backgroundImage: profileImage ? `url("${profileImage}")` : "none" }}
                                >
                                    {!profileImage && <div className="h-full w-full flex items-center justify-center bg-gray-200 dark:bg-gray-800 rounded-full text-gray-400 text-xs">No Image</div>}
                                </div>
                                <div className="flex flex-col items-center md:items-start justify-center gap-2">
                                    <p className="text-[#1c140d] dark:text-white text-xl md:text-3xl font-bold leading-tight tracking-[-0.015em]">
                                        {profileData?.user?.name || "Racing User"}
                                    </p>
                                    <div className="flex items-center gap-2 text-primary">
                                        <LayoutGrid size={18} />
                                        <span className="text-sm font-bold uppercase tracking-wider">
                                            {formatTribeName(profileData?.tribe || "Red Grid")}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => navigate("/profile/edit")}
                                className="flex min-w-[100px] md:min-w-[120px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-9 md:h-11 px-4 md:px-6 bg-primary text-white text-xs md:text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                            >
                                <Edit2 size={16} className="mr-2 md:size-[18px]" />
                                <span className="truncate">Edit Profile</span>
                            </button>
                        </div>
                    </div>

                    {/* Stats Section */}
                    <div className="flex flex-wrap gap-4 mb-8">
                        {/* Overall Points */}
                        <div className="flex min-w-[200px] flex-1 flex-col gap-2 rounded-xl p-6 bg-white dark:bg-white/5 border border-[#e8dbce] dark:border-white/10 shadow-sm hover:border-primary/40 transition-colors">
                            <div className="flex items-center justify-between">
                                <p className="text-[#9c7349] dark:text-[#c4a17d] text-sm font-medium leading-normal">Overall Points</p>
                                <Zap size={24} className="text-primary opacity-60" />
                            </div>
                            <p className="text-green-600 dark:text-green-400 tracking-light text-3xl font-bold leading-tight">
                                {((profileData?.user?.creatorPoints || 0) + (profileData?.user?.rankerPoints || 0)).toLocaleString()}
                            </p>
                        </div>
                        {/* Tribe Rank */}
                        <div className="flex min-w-[200px] flex-1 flex-col gap-2 rounded-xl p-6 bg-white dark:bg-white/5 border border-[#e8dbce] dark:border-white/10 shadow-sm hover:border-primary/40 transition-colors">
                            <div className="flex items-center justify-between">
                                <p className="text-[#9c7349] dark:text-[#c4a17d] text-sm font-medium leading-normal">Tribe Rank</p>
                                <Trophy size={24} className="text-primary opacity-60" />
                            </div>
                            <p className="text-[#1c140d] dark:text-white tracking-light text-3xl font-bold leading-tight">
                                {userRank ? (typeof userRank === 'number' ? `#${userRank}` : userRank) : '-'}
                            </p>
                        </div>
                        {/* Season Rank (Locked) */}
                        <div className="flex min-w-[200px] flex-1 flex-col gap-2 rounded-xl p-6 bg-slate-50 dark:bg-white/5 border border-[#e8dbce] dark:border-white/10 shadow-sm opacity-70">
                            <div className="flex items-center justify-between">
                                <p className="text-[#9c7349] dark:text-[#c4a17d] text-sm font-medium leading-normal">Season Rank</p>
                                <span className="material-symbols-outlined text-gray-400 text-xl">lock</span>
                            </div>
                            <p className="text-gray-500 tracking-light text-xl font-bold leading-tight mt-1 flex items-center gap-2">
                                Locked
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-8">
                        {/* Main Tabs & Content */}
                        <div className="flex flex-col gap-4 w-full">
                            <div className="pb-3 bg-white dark:bg-white/5 rounded-t-xl">
                                <div className="flex border-b border-[#e8dbce] dark:border-white/10 px-4 gap-8">
                                    <button
                                        onClick={() => setActiveTab("images")}
                                        className={`flex flex-col items-center justify-center border-b-[3px] ${activeTab === "images" ? "border-b-primary text-[#1c140d] dark:text-white" : "border-b-transparent text-[#9c7349] dark:text-[#c4a17d]"} pb-[13px] pt-4 transition-colors`}
                                    >
                                        <p className="text-sm font-bold leading-normal tracking-[0.015em]">Images</p>
                                    </button>
                                    <button
                                        onClick={() => setActiveTab("videos")}
                                        className={`flex flex-col items-center justify-center border-b-[3px] ${activeTab === "videos" ? "border-b-primary text-[#1c140d] dark:text-white" : "border-b-transparent text-[#9c7349] dark:text-[#c4a17d]"} pb-[13px] pt-4 transition-colors`}
                                    >
                                        <p className="text-sm font-bold leading-normal tracking-[0.015em]">Videos</p>
                                    </button>
                                </div>
                            </div>

                            {/* Content Grid */}
                            <div className="min-h-[200px]">
                                {activeTab === "images" && (
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                        {imageSubmissions.map((submission) => (
                                            <div
                                                key={submission._id}
                                                className="group relative aspect-square rounded-lg overflow-hidden bg-black/10 dark:bg-white/10 border border-[#e8dbce] dark:border-white/10 cursor-pointer"
                                                onClick={() => {
                                                    setSelectedImage(submission.mediaUrl);
                                                    setIsImageModalOpen(true);
                                                }}
                                            >
                                                <img src={submission.mediaUrl} alt="User Submission" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                            </div>
                                        ))}
                                        {isImagesLoading && (
                                            <div className="col-span-full flex justify-center py-4">
                                                <Loader2 className="animate-spin text-primary" size={24} />
                                            </div>
                                        )}
                                        {!isImagesLoading && imageSubmissions.length === 0 && (
                                            <div className="col-span-full text-center py-8 text-gray-500">
                                                No images found.
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === "videos" && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {videoSubmissions.map((submission) => (
                                            <div key={submission._id} className="group relative aspect-video rounded-lg overflow-hidden bg-black/10 dark:bg-white/10 border border-[#e8dbce] dark:border-white/10">
                                                <video
                                                    src={submission.mediaUrl}
                                                    controls
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ))}
                                        {isVideosLoading && (
                                            <div className="col-span-full flex justify-center py-4">
                                                <Loader2 className="animate-spin text-primary" size={24} />
                                            </div>
                                        )}
                                        {!isVideosLoading && videoSubmissions.length === 0 && (
                                            <div className="col-span-full text-center py-8 text-gray-500">
                                                No videos found.
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
