import { motion } from "framer-motion";
import { Zap, Gauge, ArrowRight, Flag, Timer, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useTribe } from "@/hooks/useTribe";

const challenges = [
    {
        id: "start-reaction",
        title: "Race Start Reaction",
        type: "Challenge",
        image: "https://images.unsplash.com/photo-1630048421694-64b01a7f00d7?q=80&w=2670&auto=format&fit=crop", // Red racing start lights
        info: "Fast",
        icon: Zap
    },
    {
        id: "speed-trap",
        title: "Speed Trap",
        type: "Challenge",
        image: "https://images.unsplash.com/photo-1596638787647-904d822d751e?q=80&w=2670&auto=format&fit=crop", // Car speedometer gauge
        info: null,
        icon: Gauge
    },
    {
        id: "pit-stop",
        title: "Pit Stop",
        type: "Challenge",
        image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=2670&auto=format&fit=crop", // Pit stop mechanic
        info: null,
        icon: Timer
    },
    {
        id: "cornering",
        title: "Cornering",
        type: "Challenge",
        image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?q=80&w=2574&auto=format&fit=crop", // Sports car cornering
        info: null,
        icon: ArrowRight
    },
    {
        id: "victory-lap",
        title: "Victory Lap",
        type: "Challenge",
        image: "https://images.unsplash.com/photo-1530041539828-114de669390e?q=80&w=2728&auto=format&fit=crop", // Checkered flag victory
        info: null,
        icon: Flag
    }
];

export function ChallengeRail() {
    const { tribe } = useTribe();

    return (
        <section className="py-4">
            <div className="flex items-center justify-between mb-4 px-1">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">This Weekend</h2>
                <button
                    className="text-sm font-semibold hover:opacity-80 transition-colors flex items-center"
                    style={{ color: tribe.color }}
                >
                    View All
                </button>
            </div>

            <div className="flex overflow-x-auto pb-6 -mx-4 px-4 space-x-4 md:space-x-6 scrollbar-hide snap-x snap-mandatory">
                {challenges.map((challenge, index) => (
                    <Link
                        to={`/game/${challenge.id}`}
                        key={challenge.id}
                        className="flex-none w-40 md:w-56 snap-start group"
                    >
                        <motion.div
                            whileTap={{ scale: 0.95 }}
                            className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden mb-3 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <img
                                src={challenge.image}
                                alt={challenge.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />

                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80" />

                            {challenge.info === "Fast" && (
                                <div className="absolute bottom-3 left-3 bg-white/20 backdrop-blur-md border border-white/20 text-white text-[10px] md:text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                                    <Zap size={12} fill="currentColor" className="text-yellow-400" />
                                    FAST
                                </div>
                            )}

                            {/* Hover Overlay with Tribe Color Border */}
                            <div
                                className="absolute inset-0 border-4 border-transparent transition-colors duration-300 rounded-2xl"
                                style={{ borderColor: 'transparent' }}
                            />
                        </motion.div>

                        <div className="space-y-1">
                            <h3 className="font-bold text-gray-900 text-sm md:text-base leading-tight group-hover:text-gray-700 transition-colors">
                                {challenge.title}
                            </h3>
                            <p className="text-gray-500 text-xs md:text-sm font-medium">
                                {challenge.type}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
