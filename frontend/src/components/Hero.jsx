import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useTribe } from "@/hooks/useTribe";

export function Hero({ weekends }) {
    const { tribe } = useTribe();
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-play carousel
    useEffect(() => {
        if (!weekends || weekends.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % weekends.length);
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(interval);
    }, [weekends]);

    if (!weekends || weekends.length === 0) {
        // Fallback static content for no active weekends
        return (
            <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden shadow-2xl group cursor-pointer bg-black mb-10">
                {/* Background Image */}
                <img
                    src="https://images.unsplash.com/photo-1647271942828-4be029649c88?q=80&w=2574&auto=format&fit=crop"
                    alt="Bahrain Circuit"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80"
                />

                {/* Content Gradient */}
                <div className="absolute inset-0 bg-gradient-to-l from-white/95 via-white/80 to-transparent md:w-[45%] ml-auto" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent md:hidden" />


                {/* Content Container */}
                <div className="absolute inset-0 p-6 md:p-12 flex flex-col justify-end md:justify-center items-start md:items-end text-white md:text-gray-900 pointer-events-none">
                    <div className="md:w-[40%] flex flex-col md:items-start space-y-4 pointer-events-auto">

                        {/* Live Indicator */}
                        <div className="flex items-center space-x-2 mb-1">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: tribe.color }}></span>
                                <span className="relative inline-flex rounded-full h-3 w-3" style={{ backgroundColor: tribe.color }}></span>
                            </span>
                            <span className="text-xs md:text-sm font-bold tracking-widest uppercase" style={{ color: tribe.color }}>Race Live</span>
                        </div>

                        <div className="space-y-1">
                            <h3 className="text-gray-300 md:text-gray-500 text-sm md:text-lg font-medium">Current Round</h3>
                            <h2 className="text-3xl md:text-5xl font-black leading-tight tracking-tight text-white md:text-gray-900">
                                Grid Race - Bahrain
                            </h2>
                        </div>

                        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 w-full pt-4">
                            <button
                                disabled
                                className="text-white px-8 py-3.5 rounded-full font-bold text-sm md:text-base opacity-50 cursor-not-allowed shadow-lg flex items-center justify-center w-full sm:w-auto"
                                style={{ backgroundColor: tribe.color, boxShadow: `0 4px 15px ${tribe.color}50` }}
                            >
                                Enter Race
                            </button>
                            <button className="bg-white/10 md:bg-gray-200/50 backdrop-blur-md text-white md:text-gray-800 px-8 py-3.5 rounded-full font-bold text-sm md:text-base hover:bg-white/20 md:hover:bg-gray-200 transition-colors active:scale-95 transform transition-transform w-full sm:w-auto">
                                See Raceboard
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const currentWeekend = weekends[currentIndex];

    return (
        <section className="mb-10">
            <div className="group relative overflow-hidden rounded-xl bg-white dark:bg-[#2d2218] shadow-sm border border-[#f4ede7] dark:border-[#3d2e21] flex flex-col md:flex-row">
                {/* Image Section */}
                <div className="w-full md:w-2/3 aspect-video md:aspect-auto md:h-auto relative overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentWeekend._id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8 }}
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url('${currentWeekend.imageUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuC9V8JczUYEIpqpoa6nJo1saMAaKDx0DMxf0-3IP97IIrbrjozybmJczzPtXASTUOKnI5cPOzMyaFyrTQodgYa_qO6nC4JD7XeYfxmE0cd4TY8h2sZP03STuOfqYvh3ZLMdKou9MAq-_wBkVJUokOJ8GWunivnvgieqX7B_-jC0znWm4Cl-J9zVoIN7EL8y-J2rGg-PQw_PbTbykap0DGMMuMaUNgXmTzIl72B5t82D1F9JnbdyBCiAcNqZkEL0QhSpFmoRjNA3gBU"}')` }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:bg-gradient-to-r"></div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Content Section */}
                <div className="relative w-full md:w-1/3 p-8 flex flex-col justify-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                        <p className="text-primary text-sm font-bold uppercase tracking-wider">Race Live</p>
                    </div>

                    <div>
                        <p className="text-[#9c7349] dark:text-[#c4a68a] text-sm font-medium">Current Round</p>
                        <AnimatePresence mode="wait">
                            <motion.h2
                                key={currentWeekend._id}
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -10, opacity: 0 }}
                                transition={{ duration: 0.4 }}
                                className="text-3xl font-extrabold leading-tight"
                            >
                                {currentWeekend.title}
                            </motion.h2>
                        </AnimatePresence>
                    </div>

                    <div className="flex flex-col gap-3 mt-4">
                        <Link
                            to={`/weekend/${currentWeekend._id}`}
                            className="w-full py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center"
                        >
                            Enter Race
                        </Link>
                        <Link to="/raceboard" className="w-full py-3 bg-[#f4ede7] dark:bg-[#3d2e21] text-[#1c140d] dark:text-white font-bold rounded-xl transition-all hover:bg-[#ebe2d9] flex items-center justify-center">
                            See Raceboard
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
