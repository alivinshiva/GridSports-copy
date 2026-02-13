import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function LandingHero() {
    return (
        <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden shadow-2xl group cursor-pointer">
            {/* Background Image */}
            <img
                src="https://images.unsplash.com/photo-1541447271487-09612b3f49f7?q=80&w=2574&auto=format&fit=crop"
                alt="Bahrain Circuit"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

            {/* Content */}
            <div className="absolute inset-0 p-6 md:p-12 flex flex-col justify-center items-start text-white">
                <div className="flex items-center space-x-2 mb-3">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-racing-orange opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-racing-orange"></span>
                    </span>
                    <span className="text-xs md:text-sm font-bold tracking-widest uppercase text-racing-orange">Race Live</span>
                </div>

                <h3 className="text-gray-300 text-sm md:text-lg font-medium mb-1">Current Round</h3>
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 md:mb-8 leading-[0.9] tracking-tight">
                    Grid Race - <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Bahrain</span>
                </h2>

                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                    <Link to="/schedule" className="bg-racing-orange text-white px-8 py-3 rounded-full font-bold text-sm md:text-base hover:bg-amber-600 transition-colors shadow-lg shadow-racing-orange/25 flex items-center justify-center group/btn active:scale-95 transform transition-transform">
                        Enter Race
                        <ArrowRight size={20} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                    <button className="bg-white/10 backdrop-blur-md text-white px-8 py-3 rounded-full font-bold text-sm md:text-base hover:bg-white/20 transition-colors border border-white/10 active:scale-95 transform transition-transform">
                        See Raceboard
                    </button>
                </div>
            </div>
        </div>
    );
}
