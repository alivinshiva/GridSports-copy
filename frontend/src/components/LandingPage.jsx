import { Link } from "react-router-dom";
import { ArrowRight, Trophy, UserPlus, Shield, Calendar, UploadCloud, TrendingUp, CheckCircle } from "lucide-react";
import logo from "../assets/logo1.svg";

export function LandingPage() {
    return (
        <div className="min-h-screen bg-neutral-950 text-white font-sans flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        {/* Logo / Brand Name */}
                        <Link to="/" className="flex items-center gap-2 md:gap-3">
                            <img src={logo} alt="SHOWGRID Logo" className="w-8 h-8 md:w-10 md:h-10 drop-shadow-lg" />
                            <span className="text-lg md:text-2xl font-extrabold tracking-tight text-white drop-shadow-md">SHOWGRID</span>
                        </Link>
                    </div>

                    {/* Login Button */}
                    <Link
                        to="/login"
                        className="bg-white text-black hover:bg-gray-200 font-semibold py-2 px-6 md:py-2.5 md:px-10 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)] text-center text-sm md:text-base"
                    >
                        Login
                    </Link>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative flex-grow flex items-center justify-center py-20 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Text Content */}
                    <div className="space-y-8 z-10">
                        <div className="inline-flex items-center space-x-2 bg-red-900/30 border border-red-500/30 rounded-full px-4 py-1.5">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                            </span>
                            <span className="text-red-400 text-xs font-bold uppercase tracking-wider">Season 2026 Live</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
                            Predict the <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 animate-gradient-x">Perfect Lap.</span>
                        </h1>

                        <p className="text-gray-400 text-lg max-w-xl leading-relaxed">
                            Join the ultimate F1 prediction league. compete with friends, climb the ranks, and prove your knowledge of the grid.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link to="/signup" className="flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transform hover:-translate-y-1">
                                Start Racing <ArrowRight className="ml-2 w-5 h-5" />
                            </Link>
                            {/* <Link to="/login" className="flex items-center justify-center bg-gray-900 hover:bg-gray-800 text-white border border-gray-700 px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:-translate-y-1">
                                Login
                            </Link> */}
                        </div>
                    </div>

                    {/* Hero Image */}
                    <div className="relative group perspective-1000">
                        {/* Abstract background blobs */}
                        <div className="absolute -inset-4 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-700"></div>

                        <img
                            src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=2070"
                            alt="F1 Car"
                            className="relative w-full rounded-3xl shadow-2xl border border-gray-800 transform transition-transform duration-700 group-hover:scale-[1.02] group-hover:rotate-1"
                        />
                        {/* Card Reflection/Gloss */}
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-white/5 to-transparent pointer-events-none"></div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="bg-neutral-900/50 py-24 px-6 border-y border-gray-800">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">How It Works</h2>
                        <p className="text-gray-400 text-lg">Your journey to the top of the grid.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="bg-black/40 p-8 rounded-3xl border border-gray-800 hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-all duration-300 group flex flex-col">
                            <div className="w-14 h-14 bg-gray-800 rounded-2xl flex items-center justify-center mb-6 relative overflow-hidden transition-all">
                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                                <UserPlus className="w-7 h-7 text-white group-hover:text-cyan-400 relative z-10 transition-colors" />
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold mb-3">1. Create Your Account</h3>
                            <p className="text-gray-400 mb-6 text-[15px] leading-relaxed">Sign up in seconds with email or social login. No complex forms, just your racing spirit.</p>
                            <ul className="text-[15px] text-gray-400 space-y-2 mt-auto">
                                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-cyan-500" /> Quick registration</li>
                                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-blue-500" /> Email verification</li>
                                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-cyan-500" /> Profile customization</li>
                            </ul>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-black/40 p-8 rounded-3xl border border-gray-800 hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all duration-300 group flex flex-col">
                            <div className="w-14 h-14 bg-gray-800 rounded-2xl flex items-center justify-center mb-6 relative overflow-hidden transition-all">
                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                                <Shield className="w-7 h-7 text-white group-hover:text-cyan-400 relative z-10 transition-colors" />
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold mb-3">2. Choose Your Tribe</h3>
                            <p className="text-gray-400 mb-6 text-[15px] leading-relaxed">Select from 11 F1-inspired racing tribes. Each tribe has unique colors and fierce competition.</p>
                            <ul className="text-[15px] text-gray-400 space-y-2 mt-auto">
                                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-cyan-500" /> 11 unique tribes</li>
                                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-blue-500" /> Team colors & identity</li>
                                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-cyan-500" /> Tribe-specific leaderboards</li>
                            </ul>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-black/40 p-8 rounded-3xl border border-gray-800 hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-all duration-300 group flex flex-col">
                            <div className="w-14 h-14 bg-gray-800 rounded-2xl flex items-center justify-center mb-6 relative overflow-hidden transition-all">
                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                                <Calendar className="w-7 h-7 text-white group-hover:text-cyan-400 relative z-10 transition-colors" />
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold mb-3">3. Weekend Challenges</h3>
                            <p className="text-gray-400 mb-6 text-[15px] leading-relaxed">Every Fri-Sun, new challenges drop. Activities range from fitness tracking to skill showcases.</p>
                            <ul className="text-[15px] text-gray-400 space-y-2 mt-auto">
                                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-cyan-500" /> 3-day challenge periods</li>
                                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-blue-500" /> Multiple challenge types</li>
                                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-cyan-500" /> Varying difficulty levels</li>
                            </ul>
                        </div>

                        {/* Feature 4 */}
                        <div className="bg-black/40 p-8 rounded-3xl border border-gray-800 hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all duration-300 group flex flex-col">
                            <div className="w-14 h-14 bg-gray-800 rounded-2xl flex items-center justify-center mb-6 relative overflow-hidden transition-all">
                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                                <UploadCloud className="w-7 h-7 text-white group-hover:text-cyan-400 relative z-10 transition-colors" />
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold mb-3">4. Submit Your Proof</h3>
                            <p className="text-gray-400 mb-6 text-[15px] leading-relaxed">Complete challenges and submit photos, videos, or activity data as proof.</p>
                            <ul className="text-[15px] text-gray-400 space-y-2 mt-auto">
                                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-cyan-500" /> Photo submissions</li>
                                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-blue-500" /> Video uploads</li>
                                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-cyan-500" /> Activity tracking sync</li>
                            </ul>
                        </div>

                        {/* Feature 5 */}
                        <div className="bg-black/40 p-8 rounded-3xl border border-gray-800 hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-all duration-300 group flex flex-col">
                            <div className="w-14 h-14 bg-gray-800 rounded-2xl flex items-center justify-center mb-6 relative overflow-hidden transition-all">
                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                                <TrendingUp className="w-7 h-7 text-white group-hover:text-cyan-400 relative z-10 transition-colors" />
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold mb-3">5. Earn Points & Rank Up</h3>
                            <p className="text-gray-400 mb-6 text-[15px] leading-relaxed">Get instant points for submissions. Climb personal and tribe leaderboards.</p>
                            <ul className="text-[15px] text-gray-400 space-y-2 mt-auto">
                                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-cyan-500" /> Real-time point updates</li>
                                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-blue-500" /> Multiple leaderboards</li>
                                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-cyan-500" /> Rank progression</li>
                            </ul>
                        </div>

                        {/* Feature 6 */}
                        <div className="bg-black/40 p-8 rounded-3xl border border-gray-800 hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all duration-300 group flex flex-col">
                            <div className="w-14 h-14 bg-gray-800 rounded-2xl flex items-center justify-center mb-6 relative overflow-hidden transition-all">
                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                                <Trophy className="w-7 h-7 text-white group-hover:text-cyan-400 relative z-10 transition-colors" />
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold mb-3">6. Win Rewards</h3>
                            <p className="text-gray-400 mb-6 text-[15px] leading-relaxed">Top performers earn badges, achievements, and exclusive recognition.</p>
                            <ul className="text-[15px] text-gray-400 space-y-2 mt-auto">
                                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-cyan-500" /> Weekly winners</li>
                                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-blue-500" /> Achievement badges</li>
                                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-cyan-500" /> Hall of fame</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-neutral-950 py-12 px-6 border-t border-gray-800">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center space-x-3">
                        <img src={logo} alt="SHOWGRID Logo" className="w-12 h-12 drop-shadow-md" />
                        <span className="text-2xl font-extrabold tracking-tight text-white drop-shadow-md">SHOWGRID</span>
                    </div>

                    <div className="flex space-x-6 text-sm text-gray-500">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-white transition-colors">Contact</a>
                    </div>

                    <div className="text-gray-600 text-sm">
                        &copy; 2026 SHOWGRID. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}
