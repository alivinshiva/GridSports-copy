import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { useNavigate } from "react-router-dom";
import {
    Edit2,
    Trophy,
    LayoutGrid,
    Zap,
    X,
    Loader2,
    Users,
    Crown
} from "lucide-react";
import { getRankerLeaderboard, getTribeLeaderboard, getCurrentUserRank } from "@/services/leaderboardService";
import { getAllActiveWeekends } from "@/services/weekendService";

export default function ProfilePage() {
    const navigate = useNavigate();
    const { fetchProfile } = useAuth();
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null); // Add selectedImage state
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userRank, setUserRank] = useState(null);
    const [tribeRank, setTribeRank] = useState(null);
    const [tribeData, setTribeData] = useState(null);
    const [activeWeekendImage, setActiveWeekendImage] = useState(null);

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
                // Fetch current user rank info including tribe rank
                try {
                    const rankData = await getCurrentUserRank();
                    if (rankData && rankData.success && rankData.data) {
                        setUserRank(rankData.data.rankerRank || "Unranked");
                        setTribeRank(rankData.data.tribeRank || "-");
                    } else {
                        // Fallback: fetch from leaderboard
                        try {
                            const leaderboardData = await getRankerLeaderboard();
                            if (leaderboardData && leaderboardData.data) {
                                const rankInfo = leaderboardData.data.findIndex(u => u._id === profile.user._id);
                                if (rankInfo !== -1) {
                                    setUserRank(rankInfo + 1);
                                } else {
                                    setUserRank("Unranked");
                                }
                            }
                        } catch (error) {
                            console.error("Failed to fetch leaderboard for rank:", error);
                        }
                    }
                } catch (error) {
                    console.error("Failed to fetch current user rank:", error);
                }
            }

            // Fetch Active Weekend for background
            try {
                const weekendRes = await getAllActiveWeekends();
                if (weekendRes && weekendRes.success && weekendRes.data && weekendRes.data.length > 0) {
                    setActiveWeekendImage(weekendRes.data[0].imageUrl);
                }
            } catch (err) {
                console.error("Failed to fetch active weekends for profile background", err);
            }

            // 3. Fetch Tribe Data
            if (profile?.tribe) {
                try {
                    const tribesRes = await getTribeLeaderboard(1, 100);
                    if (tribesRes && tribesRes.data) {
                        const userTribe = tribesRes.data.find(t => t.name === profile.tribe);
                        if (userTribe) {
                            setTribeData(userTribe);
                        }
                    }
                } catch (err) {
                    console.error("Failed to fetch tribe data:", err);
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
            <div className="flex flex-1 justify-center sm:py-8">
                <div className="layout-content-container flex flex-col max-w-[1200px] flex-1 w-full px-0 sm:px-4">

                    {/* Profile Header Section */}
                    <div
                        className="flex p-4 sm:p-8 rounded-none sm:rounded-2xl mb-6 shadow-2xl border border-white/10 relative overflow-visible w-full"
                    >
                        {/* Background Image and Overlays */}
                        {activeWeekendImage && (
                            <div className="absolute inset-0 z-0">
                                <img src={activeWeekendImage} alt="Active Weekend" className="w-full h-full object-cover opacity-30" />
                                <div className="absolute inset-0 bg-gradient-to-r from-[#101117]/90 via-[#101117]/70 to-transparent"></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-[#101117] via-transparent to-transparent"></div>
                            </div>
                        )}
                        {!activeWeekendImage && (
                            <div className="absolute inset-0 bg-[#181920] z-0"></div>
                        )}

                        {/* Edit Profile Button - Top Right */}
                        <button
                            onClick={() => navigate("/profile/edit")}
                            className="absolute top-3 right-3 sm:top-6 sm:right-6 z-20 flex items-center justify-center gap-1 sm:gap-2 h-8 sm:h-9 md:h-10 px-2.5 sm:px-4 md:px-5 bg-white text-[#101117] text-[10px] sm:text-xs md:text-sm font-bold leading-normal tracking-wide hover:bg-gray-200 transition-all shadow-lg rounded-full"
                        >
                            <Edit2 size={14} className="sm:size-4" />
                            <span className="hidden sm:inline">Edit</span>
                        </button>

                        <div className="flex w-full flex-col gap-2 sm:gap-4 md:gap-8 relative z-10">
                            <div className="flex flex-col md:flex-row gap-3 sm:gap-6 items-start md:items-center w-full">
                                <div
                                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg sm:rounded-xl w-20 sm:w-[120px] md:w-[160px] lg:w-[180px] h-20 sm:h-[120px] md:h-[160px] lg:h-[180px] border-2 sm:border-3 border-white/20 cursor-pointer hover:opacity-90 transition-opacity bg-[#181920] shadow-xl flex-shrink-0"
                                    onClick={() => {
                                        setSelectedImage(profileImage);
                                        setIsImageModalOpen(true);
                                    }}
                                    style={{ backgroundImage: profileImage ? `url("${profileImage}")` : "none" }}
                                >
                                    {!profileImage && <div className="h-full w-full flex items-center justify-center text-white/40 text-xs">No Image</div>}
                                </div>
                                <div className="flex flex-col items-start justify-center gap-1 sm:gap-2 flex-1 w-full">
                                    <p className="text-white text-lg sm:text-2xl md:text-4xl font-bold leading-tight tracking-[0.5px] sm:tracking-[1px] uppercase drop-shadow-md">
                                        {profileData?.user?.name || "RACING USER"}
                                    </p>
                                    <p className="text-white/60 text-[11px] sm:text-sm md:text-base font-medium">
                                        Racing ID : {profileData?.user?._id?.substring(0, 6).toUpperCase() || "R22"}
                                    </p>
                                    <div className="flex items-center gap-1.5 sm:gap-2 mt-2 sm:mt-3 flex-wrap w-full">
                                        <div className="flex items-center gap-1 sm:gap-2 bg-black/40 backdrop-blur-sm px-2 sm:px-4 py-1 sm:py-2 rounded-full border border-white/10">
                                            <Trophy size={12} className="sm:size-4 text-yellow-500" />
                                            <span className="text-[10px] sm:text-sm font-bold text-white">#{userRank || '-'}</span>
                                        </div>
                                        <div className="flex items-center gap-1 sm:gap-2 bg-black/40 backdrop-blur-sm px-2 sm:px-4 py-1 sm:py-2 rounded-full border border-white/10">
                                            <Users size={12} className="sm:size-4 text-purple-400" />
                                            <span className="text-[10px] sm:text-sm font-bold text-white">T#{tribeRank || '-'}</span>
                                        </div>
                                        <div className="flex items-center gap-1 sm:gap-2 bg-black/40 backdrop-blur-sm px-2 sm:px-4 py-1 sm:py-2 rounded-full border border-white/10">
                                            <Zap size={12} className="sm:size-4 text-blue-400" />
                                            <span className="text-[10px] sm:text-sm font-bold text-white">{((profileData?.user?.creatorPoints || 0) + (profileData?.user?.rankerPoints || 0)).toLocaleString()}</span>
                                        </div>
                                        <div className="flex items-center gap-1 sm:gap-2 bg-black/40 backdrop-blur-sm px-2 sm:px-4 py-1 sm:py-2 rounded-full border border-white/10">
                                            <LayoutGrid size={12} className="sm:size-4 text-gray-400" />
                                            <span className="text-[10px] sm:text-sm font-bold text-white uppercase">{formatTribeName(profileData?.tribe || "RED GRID")}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* Tribe Contribution Card */}
                    {profileData?.tribe && (
                        <div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                                {/* User Contribution Section */}
                                <div className="bg-black/30 rounded-xl p-4 sm:p-6 border border-white/5">
                                    <p className="text-white/70 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-3">Tribe Contribution</p>
                                    <div className="flex items-baseline gap-3">
                                        <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                                            {((profileData?.user?.creatorPoints || 0) + (profileData?.user?.rankerPoints || 0)).toLocaleString()} /  {tribeData?.totalPoints ? Math.round(tribeData.totalPoints).toLocaleString() : '0'}
                                        </span>
                                        <span className="text-white/60 text-sm">points</span>
                                    </div>
                                    {tribeData?.totalPoints > 0 && (
                                        <div className="mt-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-white/60 text-xs font-medium">Contribution %</span>
                                                <span className="text-white font-bold text-sm">
                                                    {Math.round(((((profileData?.user?.creatorPoints || 0) + (profileData?.user?.rankerPoints || 0)) / tribeData.totalPoints) * 100) * 10) / 10}%
                                                </span>
                                            </div>
                                            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                                                <div
                                                    className="bg-white h-full rounded-full transition-all duration-300"
                                                    style={{
                                                        width: `${Math.min(100, ((((profileData?.user?.creatorPoints || 0) + (profileData?.user?.rankerPoints || 0)) / tribeData.totalPoints) * 100))}%`
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Tribe Status Badge */}
                            
                        </div>
                    )}
                        {/* Main Tabs & Content */}
                        <div className="flex flex-col gap-4 w-full px-1 sm:px-0">
                            <div className="pb-3 bg-transparent rounded-none sm:rounded-t-xl">
                                <div className="flex border-b border-white/10 px-4 sm:px-0 gap-8">
                                    <button
                                        onClick={() => setActiveTab("images")}
                                        className={`flex flex-col items-center justify-center border-b-[3px] ${activeTab === "images" ? "border-b-white text-white" : "border-b-transparent text-white/50 hover:text-white/80"} pb-[13px] pt-4 transition-colors`}
                                    >
                                        <p className="text-sm font-bold leading-normal tracking-widest uppercase">Images</p>
                                    </button>
                                    <button
                                        onClick={() => setActiveTab("videos")}
                                        className={`flex flex-col items-center justify-center border-b-[3px] ${activeTab === "videos" ? "border-b-white text-white" : "border-b-transparent text-white/50 hover:text-white/80"} pb-[13px] pt-4 transition-colors`}
                                    >
                                        <p className="text-sm font-bold leading-normal tracking-widest uppercase">Videos</p>
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
                                                className="group relative aspect-square rounded-lg overflow-hidden bg-[#181920] border border-white/5 cursor-pointer shadow-lg hover:border-white/20 transition-all"
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
                                            <div key={submission._id} className="group relative aspect-video rounded-lg overflow-hidden bg-[#181920] border border-white/5 shadow-lg">
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
        </AuthenticatedLayout>
    );
}
