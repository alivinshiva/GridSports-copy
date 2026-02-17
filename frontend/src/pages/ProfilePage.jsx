import { useState, useEffect } from "react";
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
    X // Import X icon
} from "lucide-react";

export default function ProfilePage() {
    const navigate = useNavigate();
    const { fetchProfile } = useAuth(); // Assuming fetchProfile is available from useAuth
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProfile = async () => {
            const data = await fetchProfile();
            if (data) {
                setProfileData(data);
            }
            setLoading(false);
        };
        loadProfile();
    }, [fetchProfile]);

    const profileImage = profileData?.imageUrl;

    // Map backend tribe IDs to display names if needed, or just use the ID/Name from backend
    // The backend returns tribe enum like "IRON TRIBE". Let's format it.
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
                    onClick={() => setIsImageModalOpen(false)}
                >
                    <div className="relative max-w-2xl w-full flex flex-col items-center">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsImageModalOpen(false);
                            }}
                            className="absolute -top-12 right-0 md:-right-12 text-white p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <X size={32} />
                        </button>
                        <img
                            src={profileImage}
                            alt="Profile Full Screen"
                            className="w-full h-auto max-h-[80vh] object-contain rounded-xl shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                </div>
            )}
            <div className="flex flex-1 justify-center py-8">
                {/* ... rest of the layout ... */}
                <div className="layout-content-container flex flex-col max-w-[1024px] flex-1 px-4 md:px-0 w-full">

                    {/* Profile Header Section */}
                    <div className="flex p-4 bg-white dark:bg-white/5 rounded-xl mb-6 shadow-sm border border-[#e8dbce] dark:border-white/10">
                        <div className="flex w-full flex-col gap-6 md:flex-row md:justify-between md:items-center">
                            <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center w-full md:w-auto">
                                <div
                                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full min-h-32 w-32 md:min-h-32 md:w-32 border-4 border-primary cursor-pointer hover:opacity-90 transition-opacity"
                                    onClick={() => setIsImageModalOpen(true)}
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
                        <div className="flex min-w-[200px] flex-1 flex-col gap-2 rounded-xl p-6 bg-white dark:bg-white/5 border border-[#e8dbce] dark:border-white/10 shadow-sm hover:border-primary/40 transition-colors">
                            <div className="flex items-center justify-between">
                                <p className="text-[#9c7349] dark:text-[#c4a17d] text-sm font-medium leading-normal">Season Rank</p>
                                <Medal size={24} className="text-primary opacity-60" />
                            </div>
                            <p className="text-[#1c140d] dark:text-white tracking-light text-3xl font-bold leading-tight">#142</p>
                        </div>
                        <div className="flex min-w-[200px] flex-1 flex-col gap-2 rounded-xl p-6 bg-white dark:bg-white/5 border border-[#e8dbce] dark:border-white/10 shadow-sm hover:border-primary/40 transition-colors">
                            <div className="flex items-center justify-between">
                                <p className="text-[#9c7349] dark:text-[#c4a17d] text-sm font-medium leading-normal">Race Wins</p>
                                <Trophy size={24} className="text-primary opacity-60" />
                            </div>
                            <p className="text-[#1c140d] dark:text-white tracking-light text-3xl font-bold leading-tight">42</p>
                        </div>
                        <div className="flex min-w-[200px] flex-1 flex-col gap-2 rounded-xl p-6 bg-white dark:bg-white/5 border border-[#e8dbce] dark:border-white/10 shadow-sm hover:border-primary/40 transition-colors">
                            <div className="flex items-center justify-between">
                                <p className="text-[#9c7349] dark:text-[#c4a17d] text-sm font-medium leading-normal">Rating Impact</p>
                                <TrendingUp size={24} className="text-primary opacity-60" />
                            </div>
                            <p className="text-green-600 dark:text-green-400 tracking-light text-3xl font-bold leading-tight">+1,250</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Tabs & Content (Left Column) */}
                        <div className="lg:col-span-2 flex flex-col gap-4">
                            <div className="pb-3 bg-white dark:bg-white/5 rounded-t-xl">
                                <div className="flex border-b border-[#e8dbce] dark:border-white/10 px-4 gap-8">
                                    <button className="flex flex-col items-center justify-center border-b-[3px] border-b-primary text-[#1c140d] dark:text-white pb-[13px] pt-4">
                                        <p className="text-sm font-bold leading-normal tracking-[0.015em]">My Entries</p>
                                    </button>
                                    {/* Badges Link Removed as requested */}
                                </div>
                            </div>

                            {/* Video Thumbnails Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="group relative aspect-video rounded-lg overflow-hidden bg-black/10 dark:bg-white/10 border border-[#e8dbce] dark:border-white/10 cursor-pointer">
                                    <div className="absolute inset-0 bg-center bg-cover transition-transform group-hover:scale-105" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD82AHuMvSif7HAVsNUolIHRgGVqZnA8Az2XZ5qNLiQjlOfQrEFwz6jdNPxrsA8vnhknAa0tpdB5lKFdlbnvJx1qhzuk_x-Pc-pDl0dpfFrBWFu1nMc0JZzGZIevxvYJRCN2SgpoKL8iBmcYDkBhQYvXaJ-l3SFQ6MpJUG0o9JLBxh_ccZY2loYN5u1imrdv274TSoe7uCljD5XKYcCFSpT-aOFZSGenmGoiX9LhDAq85odvYcLjIwIjgCzsU9X92pexN0LAMqf7jc')" }}></div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                                    <div className="absolute bottom-3 left-3 text-white">
                                        <p className="text-sm font-bold">Monaco Grand Prix Recap</p>
                                        <p className="text-xs opacity-80">2:45 • 3 days ago</p>
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <PlayCircle className="text-white h-12 w-12" strokeWidth={1.5} />
                                    </div>
                                </div>
                                <div className="group relative aspect-video rounded-lg overflow-hidden bg-black/10 dark:bg-white/10 border border-[#e8dbce] dark:border-white/10 cursor-pointer">
                                    <div className="absolute inset-0 bg-center bg-cover transition-transform group-hover:scale-105" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBcALN3nmbgluJa2G88lYMaephSb99isNXVaI7WWeRwHOHVGK4S6TNXCsfiT15HWncMJW2BBR8kVskOEaFh-tbjxfBtiTHLUul0f0i45Z5FV4d2uERmZIk4OOKO0f_5k5noZt8f9pchP5EeC41H1X8_JFxAIU-nEAjtivdBJDFv6nlscbFl1YC4jtK1v2qBW8eaqJ4mQEONCyA3RM2PFEEqFmasAkOkuCzVYERvM5yW7-yb9syPLaCzKvoDDqMqEg5uG8e3cxq4V14')" }}></div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                                    <div className="absolute bottom-3 left-3 text-white">
                                        <p className="text-sm font-bold">Midnight Street Sprint</p>
                                        <p className="text-xs opacity-80">1:12 • 1 week ago</p>
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <PlayCircle className="text-white h-12 w-12" strokeWidth={1.5} />
                                    </div>
                                </div>
                                <div className="group relative aspect-video rounded-lg overflow-hidden bg-black/10 dark:bg-white/10 border border-[#e8dbce] dark:border-white/10 cursor-pointer">
                                    <div className="absolute inset-0 bg-center bg-cover transition-transform group-hover:scale-105" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDrOVW8LMRY_DI3aaJpzAddRwwWCh3mUqSUkwEQaKplYx3I0o9gF00GNHQt4yw2ZbAcPmTEHeFD35M0wpwCu2g1z3Nwz2yjGy9JOcRS4AjZHz_EY7BNsfTVYlCZvzVlWV9eB--7VBrUfAL6JQElWGpNVDTbMMOmSbERZyC3u8wUtWSNCgbW1twczuGIMPwaiaBTbQ-AmwH0o3_DqBlF5JaNMsS4-IRYazvhaLLHCUoV5_FeWv6v7-5Cet2idPsRjQ7BsIWDUPtFBfU')" }}></div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                                    <div className="absolute bottom-3 left-3 text-white">
                                        <p className="text-sm font-bold">Neon Drifting Highlights</p>
                                        <p className="text-xs opacity-80">4:20 • 2 weeks ago</p>
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <PlayCircle className="text-white h-12 w-12" strokeWidth={1.5} />
                                    </div>
                                </div>
                                <div className="group relative aspect-video rounded-lg overflow-hidden bg-black/10 dark:bg-white/10 border border-[#e8dbce] dark:border-white/10 cursor-pointer">
                                    <div className="absolute inset-0 bg-center bg-cover transition-transform group-hover:scale-105" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB49FNlMUWMMESYI5ngwMG8qQABIdO7z1Zd2JRJLlvc30FQUi3RZz3S9z1HeSu8A7N4rkbEGOuahyA8ppW5SrANNElx72f0ub6XiSZKVSJbpmp5a1xHArAgQjq10v2eQUrmuIlmzdVkmj5YQFngpobwSHFsJES-DCmluY7-dm_5uv2BNyYoH3gOS-q3bz8WqxJWXxmMGGzAT4MMoMhxnnOG4fhopp2ZPm9l2EzHQZHE5KwQHfu9CD2F8zDVV4db0EwciY8TLnCRqj4')" }}></div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                                    <div className="absolute bottom-3 left-3 text-white">
                                        <p className="text-sm font-bold">Practice Session Lap 4</p>
                                        <p className="text-xs opacity-80">0:58 • 1 month ago</p>
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <PlayCircle className="text-white h-12 w-12" strokeWidth={1.5} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tribe & Badges (Right Column) */}
                        <div className="flex flex-col gap-6">
                            {/* Tribe Contribution Card */}
                            <div className="bg-white dark:bg-white/5 p-6 rounded-xl border border-[#e8dbce] dark:border-white/10 shadow-sm">
                                <h3 className="text-[#1c140d] dark:text-white text-lg font-bold mb-4 flex items-center gap-2">
                                    <Users className="text-primary" size={24} />
                                    Tribe Contribution
                                </h3>
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center justify-between text-sm">
                                        <p className="text-[#9c7349] dark:text-[#c4a17d]">Red Grid Rank</p>
                                        <p className="text-[#1c140d] dark:text-white font-bold">Elite Member</p>
                                    </div>
                                    <div className="w-full bg-[#f4ede7] dark:bg-white/10 h-3 rounded-full overflow-hidden">
                                        <div className="bg-primary h-full w-[85%] rounded-full"></div>
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <p className="text-[#9c7349] dark:text-[#c4a17d] font-medium">850 / 1,000 Points</p>
                                        <p className="text-primary font-bold">Next level: 150 more</p>
                                    </div>
                                </div>
                            </div>

                            {/* Badges Mini View */}
                            <div className="bg-white dark:bg-white/5 p-6 rounded-xl border border-[#e8dbce] dark:border-white/10 shadow-sm">
                                <h3 className="text-[#1c140d] dark:text-white text-lg font-bold mb-4 flex items-center justify-between">
                                    <span className="flex items-center gap-2">
                                        <ShieldCheck className="text-primary" size={24} />
                                        Recent Badges
                                    </span>
                                    <a className="text-primary text-xs font-bold uppercase hover:underline" href="#">View All</a>
                                </h3>
                                <div className="flex flex-wrap gap-4">
                                    <div className="group relative flex flex-col items-center gap-2">
                                        <div className="size-14 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center border-2 border-yellow-400 group-hover:scale-110 transition-transform">
                                            <Award className="text-yellow-600 dark:text-yellow-400" size={30} />
                                        </div>
                                        <p className="text-[10px] text-center font-bold dark:text-white uppercase leading-tight">Race Winner</p>
                                    </div>
                                    <div className="group relative flex flex-col items-center gap-2">
                                        <div className="size-14 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center border-2 border-purple-400 group-hover:scale-110 transition-transform">
                                            <PartyPopper className="text-purple-600 dark:text-purple-400" size={30} />
                                        </div>
                                        <p className="text-[10px] text-center font-bold dark:text-white uppercase leading-tight">Top Meme</p>
                                    </div>
                                    <div className="group relative flex flex-col items-center gap-2">
                                        <div className="size-14 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center border-2 border-blue-400 group-hover:scale-110 transition-transform">
                                            <Zap className="text-blue-600 dark:text-blue-400" size={30} />
                                        </div>
                                        <p className="text-[10px] text-center font-bold dark:text-white uppercase leading-tight">Speed Demon</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
