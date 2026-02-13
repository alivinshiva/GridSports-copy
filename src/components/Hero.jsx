import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTribe } from "@/hooks/useTribe";

export function Hero() {
    const { tribe } = useTribe();

    return (
        <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden shadow-2xl group cursor-pointer bg-black">
            {/* Background Image */}
            <img
                src="https://images.unsplash.com/photo-1647271942828-4be029649c88?q=80&w=2574&auto=format&fit=crop"
                alt="Bahrain Circuit"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80"
            />

            {/* Content Gradient - Right-heavy as per design */}
            <div className="absolute inset-0 bg-gradient-to-l from-white/95 via-white/80 to-transparent md:w-[45%] ml-auto" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent md:hidden" />


            {/* Content Container */}
            <div className="absolute inset-0 p-6 md:p-12 flex flex-col justify-end md:justify-center items-start md:items-end text-white md:text-gray-900">
                <div className="md:w-[40%] flex flex-col md:items-start space-y-4">

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
                            className="text-white px-8 py-3.5 rounded-full font-bold text-sm md:text-base hover:opacity-90 transition-opacity shadow-lg flex items-center justify-center group/btn active:scale-95 transform transition-transform w-full sm:w-auto"
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
