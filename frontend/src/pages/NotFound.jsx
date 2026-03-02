import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertTriangle, ArrowRight, ArrowLeft } from "lucide-react";
import logo from "../assets/logo1.svg";

export default function NotFound() {
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        if (countdown === 0) {
            navigate("/");
            return;
        }

        const timer = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [countdown, navigate]);

    return (
        <div className="min-h-screen bg-neutral-950 text-white font-sans flex flex-col overflow-hidden relative">
            {/* Header matches LandingPage */}
            <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        {/* Logo / Brand Name */}
                        <Link to="/" className="flex items-center gap-2 md:gap-3 transition-opacity hover:opacity-80">
                            <img src={logo} alt="SHOWGRID Logo" className="w-8 h-8 md:w-10 md:h-10 drop-shadow-lg" />
                            <span className="text-lg md:text-2xl font-extrabold tracking-tight text-white drop-shadow-md">SHOWGRID</span>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content matching Hero Section style */}
            <section className="relative flex-grow flex items-center justify-center py-20 px-6">

                {/* Abstract background blobs (from LandingPage hero) */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-r from-cyan-600 to-blue-900 rounded-full blur-[120px] opacity-20 pointer-events-none"></div>

                <div className="relative z-10 max-w-2xl mx-auto text-center space-y-8">

                    {/* Error Badge */}
                    <div className="inline-flex items-center justify-center space-x-2 bg-red-900/30 border border-red-500/30 rounded-full px-4 py-1.5 mx-auto">
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                        <span className="text-red-400 text-xs font-bold uppercase tracking-wider">System Error 404</span>
                    </div>

                    <h1 className="text-7xl md:text-9xl font-extrabold tracking-tight leading-none">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 animate-gradient-x">Lost.</span>
                    </h1>

                    <p className="text-gray-400 text-lg max-w-xl mx-auto leading-relaxed">
                        The race track you're looking for doesn't exist or has been moved to the pits. Let's get you back on the grid.
                    </p>

                    <div className="flex flex-col items-center justify-center space-y-4 pt-4">
                        <p className="text-sm font-medium text-gray-500">
                            Auto-redirecting to the pole position in <span className="font-bold text-white">{countdown}</span>s...
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
                            <button
                                onClick={() => navigate(-1)}
                                className="flex items-center justify-center bg-gray-900 hover:bg-gray-800 text-white border border-gray-700 px-8 py-3.5 rounded-full font-bold text-base transition-all transform hover:-translate-y-1"
                            >
                                <ArrowLeft className="mr-2 w-5 h-5" /> Go Back
                            </button>
                            <button
                                onClick={() => navigate("/")}
                                className="flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white px-8 py-3.5 rounded-full font-bold text-base transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transform hover:-translate-y-1"
                            >
                                Home Page <ArrowRight className="ml-2 w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
