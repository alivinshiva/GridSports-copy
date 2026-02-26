import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, HelpCircle, X } from "lucide-react";

// Tribe images from assets
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

const tribes = [
    {
        id: "ORANGE TRIBE",
        name: "ORANGE TRIBE",
        primary: "#E78230",
        secondary: "#0B0B0F",
        bg: "linear-gradient(135deg, #E78230 0%, #0B0B0F 100%)",
        image: orangeImg,
    },
    {
        id: "SCARLET TRIBE",
        name: "SCARLET TRIBE",
        primary: "#E43D32",
        secondary: "#FFD100",
        bg: "linear-gradient(135deg, #E43D32 0%, #8B0000 100%)",
        image: scarletImg,
    },
    {
        id: "AZURE TRIBE",
        name: "AZURE TRIBE",
        primary: "#171859",
        secondary: "#FDD900",
        bg: "linear-gradient(135deg, #1a1b6b 0%, #0d0e40 100%)",
        image: azureImg,
    },
    {
        id: "SILVER TRIBE",
        name: "SILVER TRIBE",
        primary: "#C7CBD1",
        secondary: "#00C2B2",
        bg: "linear-gradient(135deg, #C7CBD1 0%, #6b7280 100%)",
        image: silverImg,
    },
    {
        id: "GREEN TRIBE",
        name: "GREEN TRIBE",
        primary: "#23554C",
        secondary: "#B6FF4A",
        bg: "linear-gradient(135deg, #23554C 0%, #0f2e28 100%)",
        image: greenImg,
    },
    {
        id: "BLUE TRIBE",
        name: "BLUE TRIBE",
        primary: "#0A1F62",
        secondary: "#49A7FF",
        bg: "linear-gradient(135deg, #0A1F62 0%, #061240 100%)",
        image: blueImg,
    },
    {
        id: "PINK TRIBE",
        name: "PINK TRIBE",
        primary: "#FF4FD8",
        secondary: "#2B2D83",
        bg: "linear-gradient(135deg, #FF4FD8 0%, #6d1b8e 100%)",
        image: pinkImg,
    },
    {
        id: "WHITE TRIBE",
        name: "WHITE TRIBE",
        primary: "#FFFFFF",
        secondary: "#1C31C0",
        accent: "#E10600",
        bg: "linear-gradient(135deg, #e8e8e8 0%, #b0b0b0 100%)",
        image: whiteImg,
    },
    {
        id: "CARBON TRIBE",
        name: "CARBON TRIBE",
        primary: "#FFFFFF",
        secondary: "#111111",
        accent: "#C8102E",
        bg: "linear-gradient(135deg, #2a2a2a 0%, #111111 100%)",
        image: carbonImg,
    },
    {
        id: "GRAPHITE TRIBE",
        name: "GRAPHITE TRIBE",
        primary: "#2A2A2A",
        secondary: "#FF3B30",
        bg: "linear-gradient(135deg, #FF3B30 0%, #8b0000 100%)",
        image: graphiteImg,
    },
    {
        id: "ONYX TRIBE",
        name: "ONYX TRIBE",
        primary: "#0B0B0F",
        secondary: "#FFFFFF",
        bg: "linear-gradient(135deg, #1a1a1f 0%, #0B0B0F 100%)",
        image: onyxImg,
    },
];

// Which tribes go in each row (matching layout: 4, 4, 3)
const row1 = tribes.slice(0, 4);
const row2 = tribes.slice(4, 8);
const row3 = tribes.slice(8, 11);

function TribeCard({ tribe, isSelected, onSelect }) {
    const [hovered, setHovered] = useState(false);

    // Decide text color for the tribe name label
    const isLight = ["WHITE TRIBE", "SILVER TRIBE"].includes(tribe.id);
    const nameColor = isLight ? "#111111" : "#FFFFFF";

    return (
        <motion.button
            onClick={() => onSelect(tribe.id)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            whileTap={{ scale: 0.97 }}
            className="relative flex flex-col rounded-xl overflow-hidden cursor-pointer focus:outline-none"
            style={{
                border: isSelected ? `3px solid ${tribe.secondary}` : "3px solid transparent",
                boxShadow: isSelected
                    ? `0 0 20px ${tribe.primary}88, 0 0 40px ${tribe.primary}44`
                    : hovered
                        ? `0 8px 32px rgba(0,0,0,0.5)`
                        : "0 4px 16px rgba(0,0,0,0.3)",
                transition: "box-shadow 0.25s ease, border 0.25s ease",
            }}
        >
            {/* Selected checkmark */}
            <AnimatePresence>
                {isSelected && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center z-20 shadow-md"
                        style={{ backgroundColor: tribe.secondary || "#fff" }}
                    >
                        <Check size={14} strokeWidth={3} style={{ color: isLight ? "#fff" : tribe.primary }} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Card background + F1 car image */}
            <div
                className="w-full flex items-end justify-center relative overflow-hidden"
                style={{
                    backgroundImage: `url(${bgImage}), ${tribe.bg}`,
                    backgroundBlendMode: "overlay",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    paddingTop: "20px",
                    paddingBottom: "20px",
                    paddingLeft: "30px",
                    paddingRight: "30px",
                    minHeight: "140px",
                }}
            >
                {/* Subtle top accent bar */}
                <div
                    className="absolute top-0 left-0 right-0 h-1"
                    style={{ backgroundColor: tribe.secondary }}
                />
                <motion.img
                    src={tribe.image}
                    alt={tribe.name}
                    className="w-full object-contain"
                    style={{
                        maxHeight: "110px",
                        objectPosition: "bottom",
                        filter: "drop-shadow(0px 6px 10px rgba(0,0,0,0.5))",
                    }}
                    animate={{ scale: hovered ? 1.06 : 1 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                />
            </div>

            {/* Tribe name label */}
            <div
                className="w-full text-center py-1.5 px-2"
                style={{ backgroundColor: tribe.primary }}
            >
                <span
                    className="text-[10px] sm:text-xs font-black tracking-widest uppercase"
                    style={{ color: nameColor, letterSpacing: "0.08em" }}
                >
                    {tribe.name}
                </span>
            </div>
        </motion.button>
    );
}

export function TribePage() {
    const [selected, setSelected] = useState(null);
    const [showHelp, setShowHelp] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const redirectTo = location.state?.from || "/";

    const activeTribe = selected ? tribes.find((t) => t.id === selected) : null;

    const handleJoin = async () => {
        if (!activeTribe) return;
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
                alert(data.message || "Failed to join tribe");
            }
        } catch (error) {
            console.error("Join Tribe Error:", error);
            alert("Something went wrong. Please try again.");
        }
    };

    return (
        <div
            className="min-h-screen flex flex-col"
            style={{ backgroundColor: "#0B0B0F" }}
        >
            <div className="flex flex-col min-h-screen">
                {/* Header */}
                <header className="flex items-center justify-between px-4 md:px-10 py-4">
                    <div className="flex items-center gap-2">
                        <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-sm"
                            style={{ backgroundColor: "#E78230" }}
                        >
                            G
                        </div>
                        <span className="font-black text-white text-lg tracking-wide">
                            GRID<span style={{ color: "#E78230" }}>SPORTS</span>
                        </span>
                    </div>
                    <button
                        onClick={() => setShowHelp(true)}
                        className="w-9 h-9 rounded-full flex items-center justify-center text-white transition-opacity hover:opacity-80"
                        style={{ backgroundColor: "#E78230" }}
                    >
                        <HelpCircle size={18} />
                    </button>
                </header>

                {/* Main */}
                <main className="flex-1 flex flex-col items-center px-3 md:px-8 py-6 md:py-10">
                    <div className="w-full max-w-4xl">
                        {/* Title */}
                        <div className="text-center mb-8">
                            <h1 className="text-2xl md:text-4xl font-black text-white mb-2 tracking-wide uppercase">
                                Pick Your{" "}
                                <span style={{ color: "#E78230" }}>Tribe</span>
                            </h1>
                            <p className="text-gray-400 text-sm md:text-base max-w-md mx-auto leading-relaxed">
                                Your tribe defines your community and identity within Grid Sports. Choose the vibe that matches your energy.
                            </p>
                        </div>

                        {/* Tribe Grid — Row 1: 4 */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 mb-3 md:mb-4">
                            {row1.map((tribe) => (
                                <TribeCard
                                    key={tribe.id}
                                    tribe={tribe}
                                    isSelected={selected === tribe.id}
                                    onSelect={setSelected}
                                />
                            ))}
                        </div>

                        {/* Tribe Grid — Row 2: 4 */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 mb-3 md:mb-4">
                            {row2.map((tribe) => (
                                <TribeCard
                                    key={tribe.id}
                                    tribe={tribe}
                                    isSelected={selected === tribe.id}
                                    onSelect={setSelected}
                                />
                            ))}
                        </div>

                        {/* Tribe Grid — Row 3: 3 (centered) */}
                        <div className="flex justify-center gap-3 md:gap-4 mb-8">
                            {row3.map((tribe) => (
                                <div key={tribe.id} className="w-[calc(50%-6px)] sm:w-[calc(25%-12px)] max-w-[200px]">
                                    <TribeCard
                                        tribe={tribe}
                                        isSelected={selected === tribe.id}
                                        onSelect={setSelected}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                            <motion.button
                                whileTap={{ scale: 0.97 }}
                                onClick={() => navigate(-1)}
                                className="w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-gray-300 border transition-colors text-sm"
                                style={{ borderColor: "rgba(255,255,255,0.2)", backgroundColor: "rgba(255,255,255,0.06)" }}
                            >
                                Back
                            </motion.button>

                            <motion.button
                                whileTap={{ scale: 0.97 }}
                                onClick={handleJoin}
                                disabled={!selected}
                                className="w-full sm:w-auto px-10 py-3.5 rounded-full font-black text-white text-sm flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed uppercase tracking-widest"
                                style={{
                                    backgroundColor: activeTribe?.primary || "#E78230",
                                    boxShadow: selected ? `0 4px 24px ${activeTribe?.primary || "#E78230"}66` : undefined,
                                    color: activeTribe && ["WHITE TRIBE", "SILVER TRIBE"].includes(activeTribe.id) ? "#111" : "#fff",
                                }}
                            >
                                {activeTribe ? `Join ${activeTribe.name}` : "Select a Tribe"}
                                {selected && <ArrowRight size={16} />}
                            </motion.button>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="py-4 px-4 text-center">
                    <p className="text-xs text-gray-600">© 2024 Grid Sports Inc. All rights reserved.</p>
                </footer>
            </div>

            <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
        </div>
    );
}

function HelpModal({ isOpen, onClose }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-lg rounded-3xl p-8 shadow-2xl border"
                        style={{ backgroundColor: "#111118", borderColor: "rgba(255,255,255,0.1)" }}
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-5 right-5 p-2 rounded-full transition-colors text-gray-400 hover:text-white"
                            style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
                        >
                            <X size={18} />
                        </button>

                        <div className="flex items-center gap-4 mb-6">
                            <div
                                className="w-12 h-12 rounded-2xl flex items-center justify-center text-white"
                                style={{ backgroundColor: "#E78230" }}
                            >
                                <HelpCircle size={24} />
                            </div>
                            <h2 className="text-2xl font-black text-white uppercase tracking-wide">Tribe Rules</h2>
                        </div>

                        <div className="space-y-3 text-gray-400 text-sm leading-relaxed">
                            <p>• You can follow only one tribe at a time and only participate in that match.</p>
                            <p>• You follow only one team per year. After that, you can unfollow and join another team.</p>
                            <p>• Share memes, posts, and videos of your team's matches with the community.</p>
                            <p>• See yourself on a leaderboard scale and track where your team stands.</p>
                            <p>
                                • <strong className="text-white">Event Timing:</strong> Matches start 2 hours before the race and end 7 hours after the start.
                            </p>
                        </div>

                        <button
                            onClick={onClose}
                            className="w-full mt-8 py-3.5 rounded-xl font-black text-white uppercase tracking-widest transition-opacity hover:opacity-90"
                            style={{ backgroundColor: "#E78230" }}
                        >
                            Got it, thanks!
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
