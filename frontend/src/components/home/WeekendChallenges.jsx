import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getAllActiveWeekends } from "@/services/weekendService";

export function WeekendChallenges() {
    const [activeWeekends, setActiveWeekends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getAllActiveWeekends();
                if (response.success) {
                    setActiveWeekends(response.data);
                }
            } catch (error) {
                // Silently handle error
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Auto-scroll effect
    useEffect(() => {
        if (activeWeekends.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % activeWeekends.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [activeWeekends.length]);

    const handleDotClick = (index) => {
        setCurrentIndex(index);
    };

    if (loading) return <div>Loading weekends...</div>;
    if (activeWeekends.length === 0) return null;

    const currentWeekend = activeWeekends[currentIndex];

    return (
        <section className="mb-10 w-full relative group px-[6px] sm:px-[1px]">
            <div className="relative w-full h-[55vh] sm:h-[450px] overflow-hidden rounded-3xl">
                {/* Image Background with Transition */}
                <div
                    key={currentWeekend._id}
                    className="absolute inset-0 w-full h-full"
                >
                    <div className="absolute inset-0 bg-black/40 z-10"></div>
                    <img
                        src={currentWeekend.imageUrl}
                        alt={currentWeekend.title}
                        className="w-full h-full object-cover transition-all duration-700 ease-in-out transform scale-105"
                    />
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10"></div>

                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 z-20">
                        {/* Live Indicator */}
                        <div className="flex items-center gap-2 mb-1 sm:mb-2 animate-in fade-in slide-in-from-bottom-3 duration-500">
                            <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-red-600"></span>
                            </span>
                            <span className="text-red-500 font-bold uppercase tracking-widest text-[10px] sm:text-xs drop-shadow-md">Race Live</span>
                        </div>

                        <h2 className="text-2xl sm:text-4xl font-black text-white mb-3 sm:mb-4 uppercase tracking-[1px] leading-tight sm:leading-snug drop-shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col items-start gap-1 sm:gap-2 break-words w-full">
                            <span className="break-words w-full">{currentWeekend.title}</span>
                            <span className="flex items-center gap-1 text-gray-300 font-bold text-base sm:text-lg normal-case tracking-[1px] leading-relaxed break-words w-full">
                                <span className="material-symbols-outlined text-base sm:text-lg flex-shrink-0">location_on</span>
                                <span className="break-words">{currentWeekend.location}</span>
                            </span>
                        </h2>

                        <p className="flex items-center gap-2 text-base sm:text-lg text-gray-200 font-medium mb-6 sm:mb-8 tracking-[1px] leading-relaxed drop-shadow-md animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100 break-words w-full">
                            <span className="material-symbols-outlined text-lg sm:text-xl flex-shrink-0">calendar_month</span>
                            <span className="break-words">{currentWeekend.season}</span>
                        </p>

                        <div className="flex items-center gap-4 mt-2 sm:mt-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
                            <Link to={`/weekend/${currentWeekend._id}`} className="inline-flex items-center justify-center px-6 py-2.5 bg-red-600 text-white font-bold uppercase tracking-wider text-[10px] sm:text-xs hover:bg-red-700 transition-all transform hover:-translate-y-1 shadow-lg shadow-red-600/30 rounded-xl">
                                Enter Weekend
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Dots */}
            <div className="absolute bottom-6 right-6 z-30 flex gap-2">
                {activeWeekends.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => handleDotClick(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex
                            ? "bg-red-600 w-8"
                            : "bg-white/50 hover:bg-white/80"
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    );
}
