import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Check, Clock, MapPin, X, Share } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";

const TRIBE_COLORS = {
    "IRON TRIBE": "#434343",
    "ROYAL TRIBE": "#DAA520", // Goldenrod
    "INDIGO TRIBE": "#4B0082",
    "EMERALD TRIBE": "#10B981", // Emerald-500
    "ORANGE TRIBE": "#F97316", // Orange-500
    "SCARLET TRIBE": "#FF2400",
    "CRIMSON TRIBE": "#DC143C",
    "PLATINUM TRIBE": "#71717A", // Zinc-500 
    "TITANIUM TRIBE": "#52525B", // Zinc-600
    "AZURE TRIBE": "#007FFF",
    "SILVER TRIBE": "#A1A1AA" // Zinc-400
};

export default function UploadSuccess() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, fetchProfile } = useAuth();

    // Get dynamic data passed from UploadChallenge
    const {
        location: challengeLocation,
        challengeName,
        endTime
    } = location.state || {};

    const [timeLeftDisplay, setTimeLeftDisplay] = useState(null);
    const [tribe, setTribe] = useState(null);
    const [tribeColor, setTribeColor] = useState("#F97316"); // Default Primary

    useEffect(() => {
        // Fetch Profile for Tribe Data
        const loadProfile = async () => {
            if (fetchProfile) {
                const profileData = await fetchProfile();
                if (profileData?.tribe) {
                    setTribe(profileData.tribe);
                    const color = TRIBE_COLORS[profileData.tribe.toUpperCase()];
                    if (color) setTribeColor(color);
                }
            }
        };
        loadProfile();
    }, [fetchProfile]);

    useEffect(() => {
        if (!endTime) return;

        const calculateTimeLeft = () => {
            const difference = new Date(endTime) - new Date();

            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((difference / 1000 / 60) % 60);
                const seconds = Math.floor((difference / 1000) % 60);

                const dayString = days > 0 ? `${days}d ` : "";

                return (
                    <span className="font-bold" style={{ color: tribeColor }}>
                        {dayString}{hours}h {minutes}m {seconds}s
                    </span>
                );
            } else {
                return <span className="font-bold text-red-500">Ratings Closed</span>;
            }
        };

        setTimeLeftDisplay(calculateTimeLeft());
        const timer = setInterval(() => {
            setTimeLeftDisplay(calculateTimeLeft());
        }, 1000); // Update every second

        return () => clearInterval(timer);
    }, [endTime, tribeColor]);

    return (
        <AuthenticatedLayout>
            <div className="flex-grow flex flex-col items-center justify-center px-4 py-12 md:py-24 w-full">
                <div className="flex flex-col max-w-[600px] w-full text-center items-center">
                    {/* Success Icon Section */}
                    <div className="flex flex-col items-center gap-6 mb-4 mt-8 md:mt-0">
                        <div className="relative">
                            {/* Subtle Glow - adjusted for light mode */}
                            <div
                                className="absolute inset-0 blur-3xl rounded-full scale-150 opacity-30"
                                style={{ backgroundColor: tribeColor }}
                            ></div>
                            <div
                                className="relative text-white rounded-full size-24 flex items-center justify-center shadow-[0_0_40px_rgba(0,0,0,0.1)]"
                                style={{ backgroundColor: tribeColor }}
                            >
                                <Check size={56} strokeWidth={3} />
                            </div>
                        </div>

                        {/* Dynamic Tribe Name Badge */}
                        {tribe && (
                            <div
                                className="px-4 py-1.5 rounded-full border bg-opacity-10 text-xs font-bold uppercase tracking-widest animate-in fade-in slide-in-from-bottom-2 duration-500"
                                style={{
                                    borderColor: tribeColor,
                                    color: tribeColor,
                                    backgroundColor: `${tribeColor}15`
                                }}
                            >
                                {tribe}
                            </div>
                        )}
                    </div>

                    {/* Heading */}
                    <div className="flex flex-col gap-2">
                        <h1 className="text-[#1c140d] dark:text-white tracking-tight text-[40px] md:text-[48px] font-extrabold leading-tight px-4 font-display">
                            You're in!
                        </h1>
                        <p className="text-[#1c140d]/80 dark:text-white/80 text-lg md:text-xl font-medium px-4">
                            Your entry is now live and being rated by <span style={{ color: tribeColor }}>{tribe || "the grid"}</span>.
                        </p>
                    </div>

                    {/* Challenge Detail Card */}
                    <div className="mx-4 mt-8 p-6 rounded-xl bg-white dark:bg-white/5 border border-[#e8dbce] dark:border-white/10 flex flex-col gap-1 items-center shadow-sm w-full">
                        <p className="text-xs uppercase tracking-widest font-bold" style={{ color: tribeColor }}>Challenge Entry</p>
                        <h2 className="text-[#1c140d] dark:text-white text-[24px] font-bold leading-tight tracking-tight font-display">
                            {challengeName || "Challenge Name"}
                        </h2>
                        <div className="flex items-center justify-center gap-2 mt-2 w-full">
                            <MapPin className="size-5" style={{ color: tribeColor }} />
                            <span className="font-semibold text-lg" style={{ color: tribeColor }}>{challengeLocation || "Location"}</span>
                        </div>
                    </div>

                    {/* Countdown Timer */}
                    <div className="mt-8 flex flex-col gap-2 w-full">
                        <div className="flex items-center justify-center gap-2 text-[#1c140d]/70 dark:text-white/70">
                            <Clock size={20} />
                            <p className="text-base font-medium">
                                {timeLeftDisplay && timeLeftDisplay.props && timeLeftDisplay.props.children === "Ratings Closed"
                                    ? "Status: "
                                    : "Ratings close in "}
                                {timeLeftDisplay || "Calculating..."}
                            </p>
                        </div>
                    </div>

                    {/* Image Grid Preview (Circular) */}
                    {user?.profilePic && (
                        <div className="grid grid-cols-1 gap-3 p-4 justify-center mt-4 w-full">
                            <div className="flex flex-col gap-3 text-center items-center">
                                <div className="px-4">
                                    <div
                                        className="size-24 bg-center bg-no-repeat bg-cover rounded-full border-4 shadow-lg transition-colors duration-500"
                                        style={{
                                            backgroundImage: `url("${user.profilePic}")`,
                                            borderColor: `${tribeColor}40`
                                        }}
                                    >
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Action Hub - Full Width Share Button */}
                    <div className="w-full mt-8 flex flex-col gap-4 z-50">

                        {/* Share Button - Smaller */}
                        <button
                            className="w-full h-11 md:h-14 bg-gray-600 dark:bg-white text-white dark:text-black font-semibold md:font-bold rounded-xl shadow-md md:shadow-lg flex items-center justify-center gap-2 hover:bg-gray-500 dark:hover:bg-gray-200 transition-all text-base md:text-lg"
                            onClick={() => alert("Share with Stamp feature coming soon! (Download image with overlay)")}
                        >
                            <Share className="size-4 md:size-5" />
                            Share with Stamp
                        </button>

                        <div className="flex flex-col md:flex-row gap-4 w-full">
                            {/* View Entry - BIGGER */}
                            <button
                                onClick={() => navigate('/profile')}
                                className="
                                    flex-1 flex items-center justify-center
                                    rounded-2xl md:rounded-xl
                                    h-20 md:h-14
                                    bg-[#f4ede7] dark:bg-white/10
                                    text-[#1c140d] dark:text-white
                                    hover:bg-[#e8dbce] dark:hover:bg-white/15
                                    transition-all duration-200
                                    text-xl md:text-base
                                    font-extrabold
                                    tracking-wide
                                    px-6
                                    border border-[#e8dbce] dark:border-white/10
                                    shadow-lg md:shadow-none
                                    hover:scale-[1.03]
                                    active:scale-[0.98]
                                "
                            >
                                View your entry
                            </button>

                            {/* Rate Fans -  Adjusted brightness/opacity */}
                            <button
                                onClick={() => navigate('/challenge/entries')}
                                className="
                                    flex-1 flex items-center justify-center
                                    rounded-2xl md:rounded-xl
                                    h-20 md:h-14
                                    text-white
                                    transition-all duration-200
                                    text-xl md:text-base
                                    font-extrabold
                                    tracking-wide
                                    px-6
                                    shadow-2xl md:shadow-lg
                                    hover:scale-[1.03]
                                    active:scale-[0.98]
                                "
                                style={{
                                    backgroundColor: tribeColor,
                                    boxShadow: `0 10px 25px -5px ${tribeColor}66`,
                                    filter: 'brightness(0.95)'
                                }}
                            >
                                Rate other fans
                            </button>
                        </div>
                    </div>

                    <p className="mt-6 mb-20 md:mb-0 text-[#1c140d]/40 dark:text-white/40 text-sm w-full text-center">
                        Ready to see how you rank? Keep an eye on the leaderboard.
                    </p>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
