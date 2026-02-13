import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, ChevronLeft, Globe, Share2, HelpCircle, X } from "lucide-react";

const tribes = [
    { id: "red", name: "Red Grid", letter: "R", subtitle: "Passion and fire", color: "#DC2626", bg: "linear-gradient(135deg, #DC2626 0%, #991B1B 100%)" },
    { id: "blue", name: "Blue Grid", letter: "B", subtitle: "Calm and precision", color: "#2563EB", bg: "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)" },
    { id: "silver", name: "Silver Grid", letter: "S", subtitle: "Speed and tech", color: "#9CA3AF", bg: "linear-gradient(135deg, #D1D5DB 0%, #6B7280 100%)" },
    { id: "orange", name: "Orange Grid", letter: "O", subtitle: "Energy and drive", color: "#EA580C", bg: "linear-gradient(135deg, #F97316 0%, #C2410C 100%)" },
    { id: "green", name: "Green Grid", letter: "G", subtitle: "Growth and endurance", color: "#059669", bg: "linear-gradient(135deg, #10B981 0%, #047857 100%)" },
    { id: "purple", name: "Purple Grid", letter: "P", subtitle: "Creativity and wisdom", color: "#7C3AED", bg: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)" },
    { id: "yellow", name: "Yellow Grid", letter: "Y", subtitle: "Optimism and light", color: "#CA8A04", bg: "linear-gradient(135deg, #FACC15 0%, #CA8A04 100%)" },
    { id: "teal", name: "Teal Grid", letter: "T", subtitle: "Balance and clarity", color: "#0D9488", bg: "linear-gradient(135deg, #14B8A6 0%, #0F766E 100%)" },
    { id: "pink", name: "Pink Grid", letter: "P", subtitle: "Playful and bold", color: "#DB2777", bg: "linear-gradient(135deg, #EC4899 0%, #BE185D 100%)" },
    { id: "black", name: "Black Grid", letter: "B", subtitle: "Power and stealth", color: "#1F2937", bg: "linear-gradient(135deg, #374151 0%, #111827 100%)" },
];

export function TribePage() {
    const [selected, setSelected] = useState(null);
    const [hovered, setHovered] = useState(null);
    const [showHelp, setShowHelp] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const redirectTo = location.state?.from || "/";

    const activeTribe = selected ? tribes.find((t) => t.id === selected) : null;
    const hoveredTribe = hovered ? tribes.find((t) => t.id === hovered) : null;

    // The button color follows: hovered > selected > default orange
    const buttonColor = hoveredTribe?.color || activeTribe?.color || "#EA580C";
    const buttonLabel = activeTribe ? `Join ${activeTribe.name.replace(" Grid", "")} Tribe` : "Select a Tribe";

    const handleJoin = () => {
        if (!activeTribe) return;
        // Save tribe choice to localStorage
        localStorage.setItem("gridsports_tribe", JSON.stringify(activeTribe));
        navigate(redirectTo);
    };

    const handleSaveExit = () => {
        if (activeTribe) {
            localStorage.setItem("gridsports_tribe", JSON.stringify(activeTribe));
        }
        navigate("/"); // Or wherever 'Exit' should go
    };

    return (
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#FAF7F2" }}>
            <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
            {/* Header */}
            <header className="flex items-center justify-between px-4 md:px-8 py-4 border-b border-gray-200/60">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: "#EA580C" }}>
                        G
                    </div>
                    <span className="font-bold text-gray-900 text-lg">Grid Sports</span>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleSaveExit}
                        className="px-4 py-2 border border-gray-300 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        Save & Exit
                    </button>
                    <button
                        onClick={() => setShowHelp(true)}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                        style={{ backgroundColor: "#EA580C" }}
                    >
                        <HelpCircle size={18} />
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center px-4 py-8 md:py-12">
                <div className="w-full max-w-5xl">
                    {/* Title */}
                    <div className="text-center mb-8 md:mb-12">
                        <h1 className="text-2xl md:text-4xl font-black text-gray-900 mb-3">
                            Pick a color tribe to represent
                        </h1>
                        <p className="text-gray-500 text-sm md:text-base max-w-md mx-auto leading-relaxed">
                            Your tribe defines your community and identity within Grid Sports. Choose the vibe that matches your energy.
                        </p>
                    </div>

                    {/* Color Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-6 mb-10">
                        {tribes.map((tribe) => {
                            const isSelected = selected === tribe.id;
                            const isHovered = hovered === tribe.id;

                            return (
                                <motion.button
                                    key={tribe.id}
                                    onClick={() => setSelected(tribe.id)}
                                    onMouseEnter={() => setHovered(tribe.id)}
                                    onMouseLeave={() => setHovered(null)}
                                    whileTap={{ scale: 0.97 }}
                                    className={`relative rounded-2xl p-3 md:p-5 text-left transition-all duration-300 flex flex-col items-center bg-white ${isSelected
                                        ? "shadow-lg scale-[1.03] z-10"
                                        : "hover:shadow-lg hover:-translate-y-1"
                                        }`}
                                    style={{
                                        border: isSelected ? `3px solid ${tribe.color}` : `3px solid transparent`,
                                        boxShadow: isSelected ? `0 8px 24px ${tribe.color}25` : undefined,
                                    }}
                                >
                                    {/* Checkmark */}
                                    <AnimatePresence>
                                        {isSelected && (
                                            <motion.div
                                                initial={{ scale: 0, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                exit={{ scale: 0, opacity: 0 }}
                                                className="absolute -top-3 -right-3 w-7 h-7 rounded-full flex items-center justify-center z-20 shadow-md"
                                                style={{ backgroundColor: tribe.color }}
                                            >
                                                <Check size={16} className="text-white" strokeWidth={3} />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Color Swatch */}
                                    <div
                                        className="w-full aspect-square rounded-2xl flex items-center justify-center transition-transform duration-300 mb-3"
                                        style={{
                                            background: tribe.bg,
                                            maxWidth: "150px",
                                            transform: isHovered ? "scale(1.03)" : "scale(1)",
                                        }}
                                    >
                                        <span className="text-white/80 text-3xl md:text-5xl font-black tracking-tighter shimmer-text">{tribe.letter}</span>
                                    </div>

                                    {/* Label */}
                                    <div className="w-full text-left space-y-0.5">
                                        <h3 className="font-bold text-gray-900 text-xs md:text-base leading-tight">{tribe.name}</h3>
                                        <p className="text-[10px] md:text-sm font-medium" style={{ color: tribe.color }}>
                                            {tribe.subtitle}
                                        </p>
                                    </div>
                                </motion.button>
                            );
                        })}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <motion.button
                            whileTap={{ scale: 0.97 }}
                            onClick={() => navigate(-1)}
                            className="w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors text-sm"
                        >
                            Back
                        </motion.button>

                        <motion.button
                            whileTap={{ scale: 0.97 }}
                            onClick={handleJoin}
                            disabled={!selected}
                            className="w-full sm:w-auto px-10 py-3.5 rounded-full font-bold text-white text-sm flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg"
                            style={{
                                backgroundColor: buttonColor,
                                boxShadow: selected ? `0 4px 20px ${buttonColor}44` : undefined,
                            }}
                        >
                            {buttonLabel} {selected && <ArrowRight size={16} />}
                        </motion.button>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-200/60 py-6 px-4">
                <div className="max-w-3xl mx-auto">
                    <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-xs text-gray-400 mb-4">
                        <a href="#" className="hover:text-gray-600 transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-gray-600 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-gray-600 transition-colors">Support Center</a>
                        <a href="#" className="hover:text-gray-600 transition-colors">Community Guidelines</a>
                    </div>
                    <p className="text-center text-xs text-gray-400 mb-3">© 2024 Grid Sports Inc. All rights reserved.</p>
                    <div className="flex justify-center gap-3 text-gray-400">
                        <Globe size={16} />
                        <Share2 size={16} />
                    </div>
                </div>
            </footer>
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
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-lg bg-white rounded-3xl p-8 shadow-2xl"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-400"
                        >
                            <X size={20} />
                        </button>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white" style={{ backgroundColor: "#EA580C" }}>
                                <HelpCircle size={24} />
                            </div>
                            <h2 className="text-2xl font-black text-gray-900 leading-tight">Tribe Rules</h2>
                        </div>

                        <div className="space-y-4 text-gray-600 leading-relaxed">
                            <p>• You can follow only one tribe at a time and only participate in that match.</p>
                            <p>• You follow only one team per year. After that, you can unfollow and join another team.</p>
                            <p>• Share memes, posts, and videos of your team's matches with the community.</p>
                            <p>• See yourself on a leaderboard scale and track where your team stands.</p>
                            <p>• <strong>Event Timing:</strong> Matches start 2 hours before the race and end 7 hours after the start.</p>
                        </div>

                        <button
                            onClick={onClose}
                            className="w-full mt-8 py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors"
                        >
                            Got it, thanks!
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
