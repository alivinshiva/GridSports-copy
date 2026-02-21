import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Check, Clock, MapPin, X, Share } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

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
        <div className="bg-[#fcfaf8] dark:bg-[#221910] min-h-screen flex flex-col transition-colors duration-300">
            {/* Top Navigation Bar */}
            <div className="w-full flex justify-center">
                <div className="layout-content-container flex flex-col w-full max-w-[960px]">
                    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f4ede7] dark:border-b-primary/20 px-6 py-4 md:px-10">
                        <div className="flex items-center gap-4" style={{ color: tribeColor }}>
                            <div className="size-8">
                                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M13.8261 17.4264C16.7203 18.1174 20.2244 18.5217 24 18.5217C27.7756 18.5217 31.2797 18.1174 34.1739 17.4264C36.9144 16.7722 39.9967 15.2331 41.3563 14.1648L24.8486 40.6391C24.4571 41.267 23.5429 41.267 23.1514 40.6391L6.64374 14.1648C8.00331 15.2331 11.0856 16.7722 13.8261 17.4264Z" fill="currentColor"></path>
                                    <path clipRule="evenodd" d="M39.998 12.236C39.9944 12.2537 39.9875 12.2845 39.9748 12.3294C39.9436 12.4399 39.8949 12.5741 39.8346 12.7175C39.8168 12.7597 39.7989 12.8007 39.7813 12.8398C38.5103 13.7113 35.9788 14.9393 33.7095 15.4811C30.9875 16.131 27.6413 16.5217 24 16.5217C20.3587 16.5217 17.0125 16.131 14.2905 15.4811C12.0012 14.9346 9.44505 13.6897 8.18538 12.8168C8.17384 12.7925 8.16216 12.767 8.15052 12.7408C8.09919 12.6249 8.05721 12.5114 8.02977 12.411C8.00356 12.3152 8.00039 12.2667 8.00004 12.2612C8.00004 12.261 8 12.2607 8.00004 12.2612C8.00004 12.2359 8.0104 11.9233 8.68485 11.3686C9.34546 10.8254 10.4222 10.2469 11.9291 9.72276C14.9242 8.68098 19.1919 8 24 8C28.8081 8 33.0758 8.68098 36.0709 9.72276C37.5778 10.2469 38.6545 10.8254 39.3151 11.3686C39.9006 11.8501 39.9857 12.1489 39.998 12.236ZM4.95178 15.2312L21.4543 41.6973C22.6288 43.5809 25.3712 43.5809 26.5457 41.6973L43.0534 15.223C43.0709 15.1948 43.0878 15.1662 43.104 15.1371L41.3563 14.1648C43.104 15.1371 43.1038 15.1374 43.104 15.1371L43.1051 15.135L43.1065 15.1325L43.1101 15.1261L43.1199 15.1082C43.1276 15.094 43.1377 15.0754 43.1497 15.0527C43.1738 15.0075 43.2062 14.9455 43.244 14.8701C43.319 14.7208 43.4196 14.511 43.5217 14.2683C43.6901 13.8679 44 13.0689 44 12.2609C44 10.5573 43.003 9.22254 41.8558 8.2791C40.6947 7.32427 39.1354 6.55361 37.385 5.94477C33.8654 4.72057 29.133 4 24 4C18.867 4 14.1346 4.72057 10.615 5.94478C8.86463 6.55361 7.30529 7.32428 6.14419 8.27911C4.99695 9.22255 3.99999 10.5573 3.99999 12.2609C3.99999 13.1275 4.29264 13.9078 4.49321 14.3607C4.60375 14.6102 4.71348 14.8196 4.79687 14.9689C4.83898 15.0444 4.87547 15.1065 4.9035 15.1529C4.91754 15.1762 4.92954 15.1957 4.93916 15.2111L4.94662 15.223L4.95178 15.2312ZM35.9868 18.996L24 38.22L12.0131 18.996C12.4661 19.1391 12.9179 19.2658 13.3617 19.3718C16.4281 20.1039 20.0901 20.5217 24 20.5217C27.9099 20.5217 31.5719 20.1039 34.6383 19.3718C35.082 19.2658 35.5339 19.1391 35.9868 18.996Z" fill="currentColor" fillRule="evenodd"></path>
                                </svg>
                            </div>
                            {/* Dynamic Header Tribe Name */}
                            <h2 className="text-[#1c140d] dark:text-white text-xl font-bold leading-tight tracking-[-0.015em] font-display">
                                {tribe || "Tribe"}
                            </h2>
                        </div>
                        <button
                            onClick={() => navigate('/schedule')}
                            className="flex items-center justify-center rounded-xl h-10 w-10 bg-[#f4ede7] dark:bg-primary/20 text-[#1c140d] dark:text-white hover:bg-gray-100 dark:hover:bg-primary/30 transition-all"
                        >
                            <X size={24} style={{ color: tribeColor }} />
                        </button>
                    </header>
                </div>
            </div>

            {/* Main Success Content */}
            <main className="flex-grow flex items-center justify-center px-4 py-24">
                <div className="layout-content-container flex flex-col max-w-[600px] w-full text-center">
                    {/* Success Icon Section */}
                    <div className="flex flex-col items-center gap-6 mb-4">
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
                    <div className="mx-4 mt-8 p-6 rounded-xl bg-white dark:bg-white/5 border border-[#e8dbce] dark:border-white/10 flex flex-col gap-1 items-center shadow-sm">
                        <p className="text-xs uppercase tracking-widest font-bold" style={{ color: tribeColor }}>Challenge Entry</p>
                        <h2 className="text-[#1c140d] dark:text-white text-[24px] font-bold leading-tight tracking-tight font-display">
                            {challengeName || "Challenge Name"}
                        </h2>
                        <div className="flex items-center gap-2 mt-2">
                            <MapPin className="size-5" style={{ color: tribeColor }} />
                            <span className="font-semibold text-lg" style={{ color: tribeColor }}>{challengeLocation || "Location"}</span>
                        </div>
                    </div>

                    {/* Countdown Timer */}
                    <div className="mt-8 flex flex-col gap-2">
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
                        <div className="grid grid-cols-1 gap-3 p-4 justify-center mt-4">
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
                    <div className="fixed bottom-0 left-0 w-full p-4 bg-white dark:bg-[#221910] border-t border-[#f4ede7] dark:border-white/10 md:static md:bg-transparent md:border-0 md:p-0 md:mt-8 flex flex-col gap-4 z-50">

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
                                    filter: 'brightness(0.95)' // Slightly less bright/saturated
                                }}
                            >
                                Rate other fans
                            </button>
                        </div>

                    </div>

                    <p className="mt-6 mb-20 md:mb-0 text-[#1c140d]/40 dark:text-white/40 text-sm">
                        Ready to see how you rank? Keep an eye on the leaderboard.
                    </p>
                </div>
            </main>

            {/* Footer Space */}
            <footer className="hidden md:flex py-6 justify-center border-t border-[#f4ede7] dark:border-white/5">
                <div className="text-[#1c140d]/30 dark:text-white/30 text-xs font-medium">
                    © 2024 Tribe Racing Community
                </div>
            </footer>
        </div>
    );
}
