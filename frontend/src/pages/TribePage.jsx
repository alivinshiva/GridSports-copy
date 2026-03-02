import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, Loader2, AlertCircle, X } from "lucide-react";
import { Helmet } from "react-helmet-async";

import orangeImg from "@/assets/tribes/ORANGE_TRIBE-Photoroom.png";
import scarletImg from "@/assets/tribes/SCARLET_TRIBE-Photoroom.png";
import azureImg from "@/assets/tribes/AZURE_TRIBE-Photoroom.png";
import silverImg from "@/assets/tribes/SILVER_TRIBE-Photoroom.png";
import greenImg from "@/assets/tribes/EMERALD_TRIBE-Photoroom.png";
import blueImg from "@/assets/tribes/INDIGO_TRIBE-Photoroom.png";
import pinkImg from "@/assets/tribes/ROYAL_TRIBE-Photoroom.png";
import whiteImg from "@/assets/tribes/CRIMSON_TRIBE (1)-Photoroom.png";
import carbonImg from "@/assets/tribes/IRON_TRIBE-Photoroom.png";
import graphiteImg from "@/assets/tribes/TITANIUM_TRIBE-Photoroom.png";
import onyxImg from "@/assets/tribes/PLATINUM_TRIBE-Photoroom.png";

import bgImage from "@/assets/tribes/background.jpg";

/* ===========================
   TRIBES DATA
=========================== */
const tribes = [
    {
        id: "ORANGE TRIBE",
        primary: "#E78230",
        bg: "linear-gradient(135deg, #E78230 0%, #0B0B0F 100%)",
        image: orangeImg,
    },
    {
        id: "SCARLET TRIBE",
        primary: "#E43D32",
        bg: "linear-gradient(135deg, #E43D32 0%, #8B0000 100%)",
        image: scarletImg,
    },
    {
        id: "AZURE TRIBE",
        primary: "#48349c",
        bg: "linear-gradient(135deg, #48349c 0%, #171030 100%)",
        image: azureImg,
    },
    {
        id: "SILVER TRIBE",
        primary: "#C7CBD1",
        bg: "linear-gradient(135deg, #C7CBD1 0%, #6b7280 100%)",
        image: silverImg,
    },
    {
        id: "GREEN TRIBE",
        primary: "#23554C",
        bg: "linear-gradient(135deg, #23554C 0%, #0f2e28 100%)",
        image: greenImg,
    },
    {
        id: "BLUE TRIBE",
        primary: "#0A1F62",
        bg: "linear-gradient(135deg, #0A1F62 0%, #061240 100%)",
        image: blueImg,
    },
    {
        id: "PINK TRIBE",
        primary: "#FF4FD8",
        bg: "linear-gradient(135deg, #FF4FD8 0%, #6d1b8e 100%)",
        image: pinkImg,
    },
    {
        id: "WHITE TRIBE",
        primary: "#E5E5E5",
        bg: "linear-gradient(135deg, #e8e8e8 0%, #b0b0b0 100%)",
        image: whiteImg,
    },
    {
        id: "CARBON TRIBE",
        primary: "#1E1E1E", // ✅ FIXED (was white)
        bg: "linear-gradient(135deg, #2a2a2a 0%, #111111 100%)",
        image: carbonImg,
    },
    {
        id: "GRAPHITE TRIBE",
        primary: "#ff3b30",
        bg: "linear-gradient(135deg, #ff3b30 0%, #801d18 100%)",
        image: graphiteImg,
    },
    {
        id: "ONYX TRIBE",
        primary: "#404040", // Set back to grey as requested
        bg: "linear-gradient(135deg, #1a1a1f 0%, #0B0B0F 100%)",
        image: onyxImg,
    },
];

/* ===========================
   TRIBE CARD
=========================== */
function TribeCard({ tribe, isSelected, onSelect }) {
    const isLight = ["WHITE TRIBE", "SILVER TRIBE", "CARBON TRIBE"].includes(tribe.id);
    const textColor = isLight ? "#111" : "#fff";

    return (
        <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelect(tribe.id)}
            className="relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300"
            style={{
                border: isSelected
                    ? `3px solid ${tribe.primary}`
                    : "3px solid transparent",
                boxShadow: isSelected
                    ? `0 0 25px ${tribe.primary}88`
                    : "0 6px 18px rgba(0,0,0,0.4)",
            }}
        >
            {/* Selected Icon */}
            <AnimatePresence>
                {isSelected && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center z-20 bg-white"
                    >
                        <Check size={14} strokeWidth={3} color={tribe.primary} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Background + Image */}
            <div
                className="w-full flex items-end justify-center relative px-[5px] md:px-[5px] py-[15px]"
                style={{
                    backgroundImage: `url(${bgImage}), ${tribe.bg}`,
                    backgroundBlendMode: "overlay",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    minHeight: "180px",
                }}
            >
                <img
                    src={tribe.image}
                    alt={tribe.id}
                    className="w-full object-contain"
                    style={{
                        maxHeight: "140px",
                        filter: "drop-shadow(0px 6px 12px rgba(0,0,0,0.6))",
                    }}
                />
            </div>

            {/* Label */}
            <div
                className="text-center py-3"
                style={{ backgroundColor: tribe.primary }}
            >
                <span
                    className="text-sm font-black tracking-widest uppercase"
                    style={{ color: textColor, fontFamily: "'Sora-SemiBold', sans-serif" }}
                >
                    {tribe.id}
                </span>
            </div>
        </motion.button>
    );
}

/* ===========================
   MAIN PAGE
=========================== */
export function TribePage() {
    const [selected, setSelected] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const redirectTo = location.state?.from || "/";

    const activeTribe = tribes.find((t) => t.id === selected);

    const handleJoin = async () => {
        if (!activeTribe) return;

        setIsSubmitting(true);
        setErrorMessage("");
        try {
            const response = await fetch(`${import.meta.env.VITE_MAIN_API_URL}/api/v1/profile/create-tribe`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tribe: activeTribe.id }),
                credentials: "include",
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem("gridsports_tribe", activeTribe.id);
                navigate(redirectTo);
            } else {
                setErrorMessage(data.message || "Failed to join tribe.");
                setTimeout(() => setErrorMessage(""), 5000);
            }
        } catch (error) {
            // Silently handle error
            setErrorMessage("Network error. Please try again later.");
            setTimeout(() => setErrorMessage(""), 5000);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0B0B0F] px-6 py-10 text-white relative">
            <Helmet>
                <title>Choose Your Tribe | SHOWGRID</title>
                <meta name="description" content="Select your racing tribe on SHOWGRID to participate in exclusive competitions and challenges." />
            </Helmet>

            {/* ERROR TOAST */}
            <AnimatePresence>
                {errorMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, x: "-50%" }}
                        animate={{ opacity: 1, y: 0, x: "-50%" }}
                        exit={{ opacity: 0, y: -20, x: "-50%" }}
                        className="fixed top-24 left-1/2 z-[100] flex items-center gap-3 bg-red-600 border border-red-500 text-white px-6 py-4 rounded-2xl shadow-2xl w-max max-w-[90%]"
                    >
                        <AlertCircle size={22} className="shrink-0" />
                        <span className="font-bold text-sm md:text-base flex-1 tracking-wide">{errorMessage}</span>
                        <button onClick={() => setErrorMessage("")} className="p-1.5 hover:bg-white/20 rounded-full transition-colors shrink-0">
                            <X size={18} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ✅ YOUR ORIGINAL NAVBAR ABOVE THIS (NOT MODIFIED) */}

            <div className="max-w-6xl mx-auto">

                {/* HEADING */}
                <h1 className="text-4xl font-black text-center mb-8 uppercase" style={{ fontFamily: "'Sora-SemiBold', sans-serif" }}>
                    Pick Your Tribe
                </h1>

                {/* RULES SECTION */}
                <div className="bg-[#111118] p-6 rounded-2xl mb-12 text-gray-300 text-sm leading-relaxed">

                    <h2 className="text-2xl md:text-4xl mb-10" style={{ fontFamily: "'Sora-SemiBold', sans-serif" }}>Read Before Follow Your Tribe?</h2>

                    <ul className="space-y-3 list-disc pl-5" style={{ fontFamily: "'Sora-Regular', sans-serif" }}>
                        <li>
                            You can follow only one tribe at a time and only participate in that match.
                        </li>
                        <li>
                            You follow only one team per year. After that, you can unfollow and join another team.
                        </li>
                        <li>
                            Share memes, posts, and videos of your team's matches with the community.
                        </li>
                        <li>
                            See yourself on a leaderboard scale and track where your team stands.
                        </li>
                        <li>
                            <strong className="text-white">Event Timing:</strong> Matches start 2 hours before the race and end 7 hours after the start.
                        </li>
                    </ul>
                </div>

                {/* TRIBE GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-12">
                    {tribes.map((tribe) => (
                        <TribeCard
                            key={tribe.id}
                            tribe={tribe}
                            isSelected={selected === tribe.id}
                            onSelect={setSelected}
                        />
                    ))}
                </div>

                {/* JOIN BUTTON */}
                <div className="flex justify-center">
                    <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={handleJoin}
                        disabled={!selected || isSubmitting}
                        className={`px-10 py-3 rounded-full font-black uppercase tracking-widest disabled:opacity-40 flex items-center gap-2 ${!activeTribe ? "bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg shadow-blue-500/25 text-white" : "text-white"
                            }`}
                        style={activeTribe ? {
                            backgroundColor: activeTribe.primary,
                            boxShadow: `0 4px 20px ${activeTribe.primary}66`,
                            fontFamily: "'Sora-SemiBold', sans-serif",
                        } : {
                            fontFamily: "'Sora-SemiBold', sans-serif",
                        }}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 size={16} className="animate-spin inline" /> Joining...
                            </>
                        ) : activeTribe ? (
                            `Join ${activeTribe.id}`
                        ) : (
                            "Select a Tribe"
                        )}
                        {!isSubmitting && selected && <ArrowRight size={16} className="inline ml-2" />}
                    </motion.button>
                </div>

            </div>
        </div>
    );
}