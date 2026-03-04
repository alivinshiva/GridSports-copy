import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, Loader2, AlertCircle, X, ShieldCheck } from "lucide-react";
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
   TRIBE RULES MODAL
=========================== */
const TRIBE_RULES = [
    { title: "What is a Tribe?", body: "A Tribe is your community \"side\" for the season. Tribes are color-based (e.g., Orange, Scarlet, Azure) and are designed for fans to participate without using official team branding." },
    { title: "Following a Tribe", body: "You may follow only one Tribe at any time. Your participation (uploads, ratings, and points) will apply only to the Tribe you currently follow." },
    { title: "Switching Tribes", body: "You may follow one Tribe per season/year. Switching may affect your eligibility for leaderboards or rewards. We may restrict switching during an active Match window." },
    { title: "Match Window (Event Timing)", body: "Each race weekend has a Match window. A Match opens 2 hours before the official race start time and closes 7 hours after the start." },
    { title: "How Points Work", body: "Earn points by uploading content that fits the active challenge, and/or rating community uploads fairly and consistently." },
    { title: "Upload Rules", body: "Upload only content you own or have rights to. No stolen content, hate speech, harassment, graphic violence, explicit content, spam, or misleading tags. We may remove content that violates rules." },
    { title: "Rating Rules (Fair Play)", body: "Rate honestly — no mass downvoting, brigading, or coordinated manipulation. Don't trade ratings or use bots. Suspicious behavior may lead to score adjustments or account action." },
    { title: "Moderation & Enforcement", body: "We may remove content, reset points, limit participation, suspend accounts, or update rules when necessary." },
    { title: "No F1 / FIA Affiliation", body: "GRIDSPORTS / Showgrid is an independent fan challenge. Not affiliated with Formula 1, the FIA, any F1 teams, drivers, race promoters, sponsors, or broadcasters." },
    { title: "Intellectual Property", body: "Do not upload copyrighted race broadcasts or content you don't own. If you believe your content was used without permission, contact us for review/takedown." },
];

function TribeRulesModal({ onAccept, onClose }) {
    return (
        <AnimatePresence>
            <motion.div
                key="tribe-rules-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.94, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.94, y: 30 }}
                    transition={{ type: "spring", stiffness: 280, damping: 28 }}
                    className="relative bg-[#111118] border border-white/10 rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl"
                >
                    {/* Header */}
                    <div className="flex items-center gap-3 px-6 pt-6 pb-4 border-b border-white/10">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shrink-0">
                            <ShieldCheck size={20} className="text-white" />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-lg font-black text-white uppercase tracking-widest" style={{ fontFamily: "'Sora-SemiBold', sans-serif" }}>Tribe Rules</h2>
                            <p className="text-xs text-gray-400 mt-0.5">Read before choosing your tribe</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Scrollable Rules */}
                    <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">
                        {TRIBE_RULES.map((rule, i) => (
                            <div key={i} className="flex gap-3">
                                <span className="mt-0.5 w-6 h-6 rounded-full bg-white/10 text-white text-xs font-black flex items-center justify-center shrink-0">{i + 1}</span>
                                <div>
                                    <p className="text-white text-sm font-bold mb-0.5" style={{ fontFamily: "'Sora-SemiBold', sans-serif" }}>{rule.title}</p>
                                    <p className="text-gray-400 text-sm leading-relaxed" style={{ fontFamily: "'Sora-Regular', sans-serif" }}>{rule.body}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer Buttons */}
                    <div className="px-6 py-5 border-t border-white/10 flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 rounded-full border border-white/20 text-gray-300 text-sm font-bold hover:bg-white/5 transition-colors"
                            style={{ fontFamily: "'Sora-SemiBold', sans-serif" }}
                        >
                            Cancel
                        </button>
                        <motion.button
                            whileTap={{ scale: 0.97 }}
                            onClick={onAccept}
                            className="flex-1 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-black uppercase tracking-widest shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
                            style={{ fontFamily: "'Sora-SemiBold', sans-serif" }}
                        >
                            <Check size={16} /> I Agree, Choose My Tribe
                        </motion.button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

/* ===========================
   MAIN PAGE
=========================== */
export function TribePage() {
    const [selected, setSelected] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showRulesModal, setShowRulesModal] = useState(false);
    const [rulesAccepted, setRulesAccepted] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const redirectTo = location.state?.from || "/";

    // Auto-show rules modal on first visit (no tribe in localStorage)
    useEffect(() => {
        const hasTribe = localStorage.getItem("gridsports_tribe");
        if (!hasTribe) {
            setShowRulesModal(true);
        } else {
            // Already has a tribe — no rules needed
            setRulesAccepted(true);
        }
    }, []);

    const handleRulesAccept = () => {
        setRulesAccepted(true);
        setShowRulesModal(false);
    };

    const handleRulesClose = () => {
        setShowRulesModal(false);
        navigate(redirectTo);
    };

    const activeTribe = tribes.find((t) => t.id === selected);

    const handleJoin = async () => {
        if (!activeTribe) return;

        // Check if user is already in this tribe
        const currentTribe = localStorage.getItem("gridsports_tribe");
        if (currentTribe && currentTribe === activeTribe.id) {
            setErrorMessage(`You are already a member of ${activeTribe.id}. You cannot rejoin the same tribe.`);
            setTimeout(() => setErrorMessage(""), 5000);
            return;
        }

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

            {/* TRIBE RULES MODAL */}
            {showRulesModal && (
                <TribeRulesModal
                    onAccept={handleRulesAccept}
                    onClose={handleRulesClose}
                />
            )}
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

                {/* RULES SECTION (always visible) */}
                <div className="bg-[#111118] p-6 rounded-2xl mb-12 text-gray-300 text-sm leading-relaxed">
                    <h2 className="text-2xl md:text-4xl mb-10" style={{ fontFamily: "'Sora-SemiBold', sans-serif" }}>Read Before Follow Your Tribe?</h2>
                    <ul className="space-y-3 list-disc pl-5" style={{ fontFamily: "'Sora-Regular', sans-serif" }}>
                        <li>You can follow only one Tribe at a time and your points count only for that Tribe.</li>
                        <li>You can follow one Tribe per season/year. After that, you may switch.</li>
                        <li>Upload and rate content to earn points for yourself and add points to your Tribe's leaderboard.</li>
                        <li>Keep it original: upload content you created or have rights to. No reposted broadcast clips or copyrighted footage.</li>
                        <li><strong className="text-white">Event Timing:</strong> Each Match opens 2 hours before the race start and closes 7 hours after the start.</li>
                        <li>Unofficial Notice: This is a fan challenge. Not affiliated with Formula 1, the FIA, or any teams/drivers.</li>
                    </ul>
                    {rulesAccepted && (
                        <button
                            onClick={() => setShowRulesModal(true)}
                            className="mt-5 text-xs text-gray-500 hover:text-gray-300 underline underline-offset-4 transition-colors"
                            style={{ fontFamily: "'Sora-Regular', sans-serif" }}
                        >
                            View Full Tribe Rules
                        </button>
                    )}
                </div>

                {/* TRIBE GRID — disabled until rules accepted */}
                <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-12 transition-all duration-300 ${!rulesAccepted ? "opacity-30 pointer-events-none select-none" : ""}`}>
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
                        disabled={!selected || isSubmitting || !rulesAccepted}
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