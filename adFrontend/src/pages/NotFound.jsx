import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, ShieldAlert, WifiOff, TerminalSquare, Activity } from "lucide-react";
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
        <div className="min-h-screen bg-[#0a0a0b] text-white font-sans flex flex-col overflow-hidden relative selection:bg-cyan-500/30">

            {/* Top Navigation Bar */}
            <div className="absolute top-0 w-full p-6 md:px-12 flex justify-between items-center z-50 border-b border-white/5 bg-black/40 backdrop-blur-xl">
                <div className="flex items-center gap-4">
                    <img src={logo} alt="SHOWGRID Admin" className="w-8 h-8 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]" />
                    <span className="font-extrabold text-xl tracking-tight text-white drop-shadow-md">SHOWGRID <span className="font-medium text-cyan-400">Admin</span></span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                    <WifiOff size={14} className="animate-pulse" /> <span>Signal Lost</span>
                </div>
            </div>

            {/* Main Content */}
            <section className="relative flex-grow flex items-center justify-center p-6">

                {/* Cyber grid background */}
                <div className="absolute inset-0 z-0 opacity-20" style={{
                    backgroundImage: 'linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                    transform: 'perspective(1000px) rotateX(60deg) scale(2.5) translateY(-10%)',
                    transformOrigin: 'top'
                }}></div>

                {/* Deep background ambient glows */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-to-r from-cyan-900/40 via-blue-900/20 to-indigo-900/40 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="relative z-10 w-full max-w-3xl mx-auto flex flex-col items-center">

                    {/* Status Console Block */}
                    <div className="w-full bg-black/60 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">

                        {/* Console Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5">
                            <div className="flex space-x-2">
                                <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                            </div>
                            <div className="flex items-center gap-2 text-white/40 text-xs font-mono">
                                <TerminalSquare size={14} /> sys.admin.error.log
                            </div>
                        </div>

                        {/* Console Body */}
                        <div className="p-8 md:p-12 text-center relative overflow-hidden">
                            {/* Inner glow */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>

                            <ShieldAlert size={56} className="mx-auto text-cyan-400 mb-6 drop-shadow-[0_0_20px_rgba(34,211,238,0.4)]" strokeWidth={1} />

                            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-cyan-100 to-cyan-500 mb-2">
                                404
                            </h1>
                            <div className="text-xl md:text-2xl font-bold tracking-widest text-cyan-400/80 uppercase mb-8">Access Denied</div>

                            <p className="text-gray-400 text-base md:text-lg max-w-lg mx-auto leading-relaxed mb-10 font-medium">
                                The administrative sector you are trying to reach is offline, restricted, or does not exist in the current grid hierarchy.
                            </p>

                            <div className="flex flex-col items-center w-full max-w-md mx-auto space-y-6">
                                {/* Activity Monitor */}
                                <div className="w-full flex items-center justify-between px-6 py-4 rounded-xl bg-cyan-950/30 border border-cyan-500/20">
                                    <div className="flex items-center gap-3">
                                        <Activity size={18} className="text-cyan-400 animate-pulse" />
                                        <span className="text-sm text-cyan-200 font-medium">Auto-reboot sequence initiated</span>
                                    </div>
                                    <div className="text-lg font-bold text-white font-mono w-8 text-right drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">0{countdown}</div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col sm:flex-row gap-4 w-full">
                                    <button
                                        onClick={() => navigate(-1)}
                                        className="flex-1 flex items-center justify-center bg-transparent hover:bg-white/5 text-gray-300 border border-white/20 px-6 py-3.5 rounded-xl font-bold text-sm transition-all active:scale-95 group"
                                    >
                                        <ArrowLeft className="mr-2 w-4 h-4 text-gray-500 group-hover:text-gray-300 transition-colors group-hover:-translate-x-1" /> Override & Back
                                    </button>
                                    <button
                                        onClick={() => navigate("/")}
                                        className="flex-1 flex items-center justify-center bg-cyan-500 hover:bg-cyan-400 text-black px-6 py-3.5 rounded-xl font-black uppercase tracking-wider text-sm transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] active:scale-95 group"
                                    >
                                        Admin Core <ArrowRight className="ml-2 w-4 h-4 text-cyan-900 group-hover:text-black transition-colors group-hover:translate-x-1" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
