import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Check, Clock, MapPin, X, Share, Copy, Facebook, Instagram, MessageCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { getSingleSubmission } from "@/services/submissionService";

const TRIBE_COLORS = {
    "ORANGE TRIBE": "#1E1E1E",
    "SCARLET TRIBE": "#FFD700",
    "AZURE TRIBE": "#48349c",
    "SILVER TRIBE": "#00FF40",
    "GREEN TRIBE": "#FFA500",
    "BLUE TRIBE": "#FF2400",
    "PINK TRIBE": "#DC143C",
    "WHITE TRIBE": "#E5E4E2",
    "CARBON TRIBE": "#FFFFFF",
    "GRAPHITE TRIBE": "#ff3b30",
    "ONYX TRIBE": "#404040"
};

export default function UploadSuccess() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, fetchProfile } = useAuth();

    // Get dynamic data passed from UploadChallenge
    const {
        location: challengeLocation,
        challengeName,
        endTime,
        submissionId
    } = location.state || {};

    const [timeLeftDisplay, setTimeLeftDisplay] = useState(null);
    const [tribe, setTribe] = useState(null);
    const [tribeColor, setTribeColor] = useState("#1E1E1E"); // Default Primary
    const [submissionMedia, setSubmissionMedia] = useState(null);
    const [showShareModal, setShowShareModal] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

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
        const fetchSubmission = async () => {
            if (submissionId) {
                try {
                    const res = await getSingleSubmission(submissionId);
                    if (res.success && res.data) {
                        setSubmissionMedia({
                            url: res.data.mediaUrl,
                            type: res.data.mediaType
                        });
                    }
                } catch (error) {
                    console.error("Error fetching submission details:", error);
                }
            }
        };
        fetchSubmission();
    }, [submissionId]);

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

    const handleShare = (platform) => {
        const shareUrl = `${window.location.origin}/challenge/feed/${submissionId || ""}`;
        const text = `Check out my entry for ${challengeName || "the challenge"} on GridSports!`;

        if (platform === "copy") {
            navigator.clipboard.writeText(shareUrl);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
            return;
        }

        let url = "";
        switch (platform) {
            case "whatsapp":
                url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + " " + shareUrl)}`;
                break;
            case "facebook":
                url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
                break;
            case "instagram":
                // Instagram doesn't have a direct share link, usually just copy is used, or a custom protocol if on mobile
                // Fallback to copy link for Instagram since web intent doesn't exist natively for feed post sharing
                alert("Link copied! Open Instagram to paste and share.");
                navigator.clipboard.writeText(shareUrl);
                return;
            default:
                break;
        }

        if (url) {
            window.open(url, "_blank");
        }
    };

    return (
        <AuthenticatedLayout>
            <div className="flex-grow flex flex-col items-center justify-center px-4 py-12 md:py-24 w-full relative">

                {/* Share Modal */}
                {showShareModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                        <div className="bg-[#181920] border border-white/10 rounded-2xl w-full max-w-sm p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-white tracking-wide">Share Entry</h3>
                                <button onClick={() => setShowShareModal(false)} className="text-white/50 hover:text-white transition-colors">
                                    <X size={24} />
                                </button>
                            </div>
                            <div className="flex items-center justify-around gap-4 mb-6">
                                <button
                                    onClick={() => handleShare("whatsapp")}
                                    className="flex flex-col items-center gap-2 text-white/70 hover:text-green-400 transition-colors"
                                >
                                    <div className="size-12 rounded-full bg-[#25D366]/20 flex items-center justify-center mb-1">
                                        <MessageCircle size={24} className="text-[#25D366]" />
                                    </div>
                                    <span className="text-xs font-medium">WhatsApp</span>
                                </button>
                                <button
                                    onClick={() => handleShare("facebook")}
                                    className="flex flex-col items-center gap-2 text-white/70 hover:text-blue-500 transition-colors"
                                >
                                    <div className="size-12 rounded-full bg-[#1877F2]/20 flex items-center justify-center mb-1">
                                        <Facebook size={24} className="text-[#1877F2]" />
                                    </div>
                                    <span className="text-xs font-medium">Facebook</span>
                                </button>
                                <button
                                    onClick={() => handleShare("instagram")}
                                    className="flex flex-col items-center gap-2 text-white/70 hover:text-pink-500 transition-colors"
                                >
                                    <div className="size-12 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 opacity-80 flex items-center justify-center mb-1">
                                        <Instagram size={24} className="text-white" />
                                    </div>
                                    <span className="text-xs font-medium">Instagram</span>
                                </button>
                            </div>

                            <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/10">
                                <input
                                    type="text"
                                    readOnly
                                    value={`${window.location.origin}/challenge/feed/${submissionId || ""}`}
                                    className="bg-transparent text-white/60 text-sm outline-none w-full px-2"
                                />
                                <button
                                    onClick={() => handleShare("copy")}
                                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2 shrink-0"
                                >
                                    {isCopied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                                    {isCopied ? "Copied" : "Copy"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

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
                                className="relative text-white rounded-full w-[59px] h-[59px] md:size-24 flex items-center justify-center shadow-[0_0_40px_rgba(0,0,0,0.1)] transition-all duration-300"
                                style={{ backgroundColor: tribeColor }}
                            >
                                <Check className="w-[32px] h-[32px] md:w-[50px] md:h-[50px]" strokeWidth={3} />
                            </div>
                        </div>

                        {/* Dynamic Tribe Name Badge */}
                        {tribe && (
                            <div
                                className="px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-widest animate-in fade-in slide-in-from-bottom-2 duration-500"
                                style={{
                                    borderColor: tribeColor,
                                    color: ["WHITE TRIBE", "SILVER TRIBE", "CARBON TRIBE"].includes(tribe.toUpperCase()) ? "#111" : tribeColor,
                                    backgroundColor: ["WHITE TRIBE", "SILVER TRIBE", "CARBON TRIBE"].includes(tribe.toUpperCase()) ? tribeColor : `${tribeColor}15`
                                }}
                            >
                                {tribe}
                            </div>
                        )}
                    </div>

                    {/* Heading */}
                    <div className="flex flex-col gap-3">
                        <h1 className="text-white tracking-tight text-[28px] md:text-[32px] font-extrabold leading-tight px-4 font-display drop-shadow-md">
                            You're in!
                        </h1>
                        <p className="text-white/80 text-sm md:text-md font-medium px-4">
                            Your entry is now live and being rated by <span style={{ color: tribeColor }}>{tribe || "the grid"}</span>.
                        </p>
                    </div>

                    {/* Challenge Detail Card */}
                    <div className="mx-4 mt-8 p-6 md:p-8 rounded-2xl bg-[#181920] border border-white/5 flex flex-col gap-2 items-center shadow-2xl w-full max-w-[500px] hover:border-white/10 transition-colors">
                        <p className="text-xs md:text-sm uppercase tracking-widest font-bold" style={{ color: tribeColor }}>Challenge Entry</p>
                        <h2 className="text-white text-[24px] md:text-[24px] font-bold leading-tight tracking-tight font-display text-center">
                            {challengeName || "Challenge Name"}
                        </h2>
                        <div className="flex items-center justify-center gap-2 mt-2 w-full">
                            <MapPin className="size-5 md:size-6" style={{ color: tribeColor }} />
                            <span className="font-semibold text-lg md:text-lg" style={{ color: tribeColor }}>{challengeLocation || "Location"}</span>
                        </div>
                    </div>

                    {/* Countdown Timer */}
                    <div className="mt-8 flex flex-col gap-2 w-full">
                        <div className="flex items-center justify-center gap-2 text-white/70">
                            <Clock size={20} />
                            <p className="text-base font-medium">
                                {timeLeftDisplay && timeLeftDisplay.props && timeLeftDisplay.props.children === "Ratings Closed"
                                    ? "Status: "
                                    : "Ratings close in "}
                                {timeLeftDisplay || "Calculating..."}
                            </p>
                        </div>
                    </div>

                    {/* Image/Video Grid Preview (Circular) */}
                    {(submissionMedia || user?.profilePic) && (
                        <div className="grid grid-cols-1 gap-3 p-4 justify-center mt-4 w-full">
                            <div className="flex flex-col gap-3 text-center items-center">
                                <div className="px-4">
                                    {submissionMedia && submissionMedia.type === 'video' ? (
                                        <div className="size-24 rounded-full border-4 shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-colors duration-500 overflow-hidden"
                                            style={{ borderColor: `${tribeColor}80` }}>
                                            <video
                                                src={submissionMedia.url}
                                                className="w-full h-full object-cover"
                                                autoPlay
                                                muted
                                                loop
                                                playsInline
                                            />
                                        </div>
                                    ) : (
                                        <div
                                            className="size-24 bg-center bg-no-repeat bg-cover rounded-full border-4 shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-colors duration-500"
                                            style={{
                                                backgroundImage: `url("${submissionMedia ? submissionMedia.url : user.profilePic}")`,
                                                borderColor: `${tribeColor}80`
                                            }}
                                        >
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Action Hub - Full Width Share Button */}
                    <div className="w-full mt-10 flex flex-col gap-4 z-40">

                        {/* Share Button - Smaller */}
                        <button
                            className="w-full h-12 md:h-14 bg-white/5 text-white font-semibold md:font-bold rounded-xl shadow-md border border-white/10 flex items-center justify-center gap-2 hover:bg-white/10 transition-all text-base md:text-lg"
                            onClick={() => setShowShareModal(true)}
                        >
                            <Share className="size-4 md:size-5" />
                            Share with friends
                        </button>

                        <div className="flex flex-col md:flex-row gap-4 w-full mt-[-8px]">
                            {/* View Entry - Matching Share Button */}
                            <button
                                onClick={() => navigate('/profile')}
                                className="
                                    w-full flex items-center justify-center
                                    rounded-xl
                                    h-12 md:h-14
                                    bg-[#181920]
                                    text-white
                                    hover:bg-white/5
                                    transition-all duration-200
                                    text-base md:text-lg
                                    tracking-wide
                                    border border-white/10
                                    shadow-md
                                "
                                style={{ fontFamily: "'Sora-Regular', sans-serif" }}
                            >
                                View your entry
                            </button>

                            <button
                                onClick={() => navigate('/challenge/feed')}
                                className="
                                    w-full flex items-center justify-center
                                    rounded-xl
                                    h-12 md:h-14
                                    transition-all duration-200
                                    text-base md:text-lg
                                    tracking-wide
                                    shadow-md
                                "
                                style={{
                                    backgroundColor: tribeColor,
                                    color: ["WHITE TRIBE", "SILVER TRIBE", "CARBON TRIBE"].includes(tribe?.toUpperCase()) ? "#111" : "#FFF",
                                    filter: 'brightness(0.95)',
                                    fontFamily: "'Sora-Regular', sans-serif"
                                }}
                            >
                                Rate other fans
                            </button>
                        </div>
                    </div>

                    <p className="mt-8 mb-20 md:mb-0 text-white/40 text-sm w-full text-center">
                        Ready to see how you rank? Keep an eye on the leaderboard.
                    </p>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
