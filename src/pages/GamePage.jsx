import { LightsOutGame } from "../components/LightsOutGame";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

export function GamePage() {
    return (
        <div className="min-h-screen bg-racing-black text-white flex flex-col">
            {/* Minimal Header */}
            <header className="p-4 flex items-center z-50">
                <Link to="/" className="flex items-center text-gray-400 hover:text-white transition-colors">
                    <ChevronLeft size={24} />
                    <span className="font-bold ml-1">Back to Paddock</span>
                </Link>
            </header>

            {/* Game Area */}
            <main className="flex-1 flex flex-col items-center justify-center relative overflow-hidden">
                {/* Background Atmosphere */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-racing-gray/50 via-racing-black to-racing-black pointer-events-none" />

                <LightsOutGame />
            </main>
        </div>
    );
}
