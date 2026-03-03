import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { HomeHeader } from '../components/home/HomeHeader';
import logo from '../assets/logo1.svg';

export default function Disclaimer() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-neutral-950 min-h-screen font-sans text-white flex flex-col selection:bg-cyan-500/30">
            <Helmet>
                <title>Disclaimer | SHOWGRID</title>
                <meta name="description" content="Affiliation/Non-Association Disclaimer for SHOWGRID / GRIDSPORTS Platform" />
            </Helmet>

            <HomeHeader />

            <main className="max-w-[800px] w-full mx-auto px-4 md:px-6 py-24 md:py-32 flex-1 relative">
                {/* Ambient Background Glow */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-2xl h-64 bg-red-500/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>

                <div className="bg-neutral-900/40 border border-white/10 hover:border-white/20 transition-all duration-300 rounded-3xl p-6 md:p-12 shadow-2xl backdrop-blur-md relative overflow-hidden group">
                    {/* Top gradient accent */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500 opacity-80 group-hover:opacity-100 transition-opacity"></div>

                    <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 mb-8">
                        <div className="p-4 bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/20 rounded-2xl w-fit shrink-0">
                            <AlertTriangle className="w-10 h-10 text-red-500" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-500 tracking-widest uppercase mb-2">Disclaimer</h1>
                            <p className="text-white/60 text-sm md:text-base font-bold uppercase tracking-widest flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                                F1 / FIA / TEAMS
                            </p>
                        </div>
                    </div>

                    <div className="w-full h-px bg-white/5 mb-10"></div>

                    <div className="prose prose-invert max-w-none text-white/80 leading-relaxed text-sm md:text-base space-y-6">
                        <section className="mt-8">
                            <h2 className="flex items-center gap-3 text-xl md:text-2xl font-black text-white mb-6 uppercase tracking-wider"><div className="w-2 h-8 flex-shrink-0 bg-gradient-to-b from-red-500 to-orange-500 rounded-full"></div>Unofficial Fan Challenge</h2>
                            <p className="mb-2">Showgrid / GRIDSPORTS is an independent fan-driven content and community platform. We are not affiliated with, endorsed by, sponsored by, or officially connected to:</p>
                            <ul className="list-disc pl-6 space-y-2 mb-4">
                                <li>Formula 1 / F1,</li>
                                <li>the FIA (Fédération Internationale de l'Automobile),</li>
                                <li>any teams, drivers, event promoters, broadcasters, sponsors, or rights holders.</li>
                            </ul>
                        </section>

                        <section className="mt-8">
                            <h2 className="flex items-center gap-3 text-xl md:text-2xl font-black text-white mb-6 uppercase tracking-wider"><div className="w-2 h-8 flex-shrink-0 bg-gradient-to-b from-red-500 to-orange-500 rounded-full"></div>Trademarks & References</h2>
                            <p>All trademarks, logos, and brand names belong to their respective owners. Any references to race events are for commentary and fan participation only.</p>
                        </section>

                        <section className="mt-8">
                            <h2 className="flex items-center gap-3 text-xl md:text-2xl font-black text-white mb-6 uppercase tracking-wider"><div className="w-2 h-8 flex-shrink-0 bg-gradient-to-b from-red-500 to-orange-500 rounded-full"></div>Color-Based Tribes (No Team Branding)</h2>
                            <p>Our Tribes are color-based communities and are not official representations of any real-world team. Users must not upload official logos, sponsor marks, or misleading branding that implies official association.</p>
                        </section>

                        <section className="mt-8">
                            <h2 className="flex items-center gap-3 text-xl md:text-2xl font-black text-white mb-6 uppercase tracking-wider"><div className="w-2 h-8 flex-shrink-0 bg-gradient-to-b from-red-500 to-orange-500 rounded-full"></div>Broadcast & Copyright Notice</h2>
                            <p>Do not upload copyrighted race broadcasts, paid stream clips, or content you do not own. Upload only original content or content you are authorized to share.</p>
                        </section>

                        <section className="mt-8">
                            <h2 className="flex items-center gap-3 text-xl md:text-2xl font-black text-white mb-6 uppercase tracking-wider"><div className="w-2 h-8 flex-shrink-0 bg-gradient-to-b from-red-500 to-orange-500 rounded-full"></div>Questions / Rights Requests</h2>
                            <p className="mb-2">If you are a rights holder and believe content infringes your rights, contact:</p>
                            <p className="font-semibold text-white/90">Email: <a href="mailto:hello@showgrid.ai" className="text-cyan-400 hover:text-cyan-300 font-normal">hello@showgrid.ai</a></p>
                            <p>Include: links, proof of ownership, and requested action (remove/restrict).</p>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}
