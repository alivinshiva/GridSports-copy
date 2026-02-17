import { Link } from "react-router-dom";
import { ArrowRight, Trophy, Video, Camera, Users } from "lucide-react";

export function LandingPage() {
    return (
        <div className="min-h-screen bg-neutral-950 text-white font-sans flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        {/* Logo / Brand Name */}
                        <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-900/20">
                            <span className="text-white font-bold text-xl tracking-tighter">G</span>
                        </div>
                        <span className="font-bold text-2xl tracking-tight text-white">Grid Sports</span>
                    </div>

                    {/* Login Button */}
                    <Link
                        to="/login"
                        className="bg-white text-black hover:bg-gray-200 font-semibold py-2.5 px-6 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
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
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 animate-gradient-x">Perfect Lap.</span>
                        </h1>

                        <p className="text-gray-400 text-lg max-w-xl leading-relaxed">
                            Join the ultimate F1 prediction league. compete with friends, climb the ranks, and prove your knowledge of the grid.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link to="/signup" className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg shadow-red-600/30 hover:shadow-red-600/50 transform hover:-translate-y-1">
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
                        <div className="absolute -inset-4 bg-gradient-to-r from-red-600 to-orange-600 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-700"></div>

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

            {/* Rules Section */}
            <section className="bg-neutral-900/50 py-24 px-6 border-y border-gray-800">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">How It Works</h2>
                        <p className="text-gray-400 text-lg">Master the grid in three simple steps.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Step 1 */}
                        <div className="bg-black/40 p-8 rounded-3xl border border-gray-800 hover:border-red-500/50 transition-colors group">
                            <div className="w-14 h-14 bg-gray-800 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-red-500/20 group-hover:text-red-500 transition-colors">
                                <Video className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">1. Join Challenges</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Choose from diverse weekly challenges: photo submissions, video predictions, or quick quizzes based on the race weekend.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="bg-black/40 p-8 rounded-3xl border border-gray-800 hover:border-red-500/50 transition-colors group">
                            <div className="w-14 h-14 bg-gray-800 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-red-500/20 group-hover:text-red-500 transition-colors">
                                <Trophy className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">2. Earn Points</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Get rated by the community and earn points. Climb the global leaderboard and dominate your tribe.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="bg-black/40 p-8 rounded-3xl border border-gray-800 hover:border-red-500/50 transition-colors group">
                            <div className="w-14 h-14 bg-gray-800 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-red-500/20 group-hover:text-red-500 transition-colors">
                                <Users className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">3. Win the Season</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Accumulate points across the 2026 season. Top players win exclusive merchandise and VIP experiences.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-neutral-950 py-12 px-6 border-t border-gray-800">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">G</span>
                        </div>
                        <span className="font-bold text-xl text-gray-300">Grid Sports</span>
                    </div>

                    <div className="flex space-x-6 text-sm text-gray-500">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-white transition-colors">Contact</a>
                    </div>

                    <div className="text-gray-600 text-sm">
                        &copy; 2026 Grid Sports. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}
