import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { HomeHeader } from '../components/home/HomeHeader';
import logo from '../assets/logo1.svg';

export default function PrivacyPolicy() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-neutral-950 min-h-screen font-sans text-white flex flex-col selection:bg-cyan-500/30">
            <Helmet>
                <title>Privacy Policy | SHOWGRID</title>
                <meta name="description" content="Privacy Policy for SHOWGRID / GRIDSPORTS Platform" />
            </Helmet>

            <HomeHeader />

            <main className="max-w-[800px] w-full mx-auto px-4 md:px-6 py-24 md:py-32 flex-1 relative">
                {/* Ambient Background Glow */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-2xl h-64 bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>

                <div className="bg-neutral-900/40 border border-white/10 hover:border-white/20 transition-all duration-300 rounded-3xl p-6 md:p-12 shadow-2xl backdrop-blur-md relative overflow-hidden group">
                    {/* Top gradient accent */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-80 group-hover:opacity-100 transition-opacity"></div>

                    <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 mb-8">
                        <div className="p-4 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/20 rounded-2xl w-fit shrink-0">
                            <Shield className="w-10 h-10 text-cyan-400" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 tracking-widest uppercase mb-2">Privacy Policy</h1>
                            <p className="text-white/60 text-sm md:text-base font-medium flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
                                Effective Date: <span className="text-white/80">03 03 2026</span>
                            </p>
                        </div>
                    </div>

                    <div className="w-full h-px bg-white/5 mb-10"></div>

                    <div className="prose prose-invert max-w-none text-white/80 leading-relaxed text-sm md:text-base space-y-6">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-lg md:text-xl text-white/90 font-medium leading-relaxed shadow-inner">
                            This Privacy Policy explains how <span className="text-cyan-400">CLAUSE SOLUTIONS</span> ("we", "us") collects, uses, shares, and protects personal data when you use the Showgrid / GRIDSPORTS Platform.
                        </div>

                        <section className="mt-8">
                            <h2 className="flex items-center gap-3 text-xl md:text-2xl font-black text-white mb-6 uppercase tracking-wider"><div className="w-2 h-8 flex-shrink-0 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full"></div>1. Information We Collect</h2>

                            <h3 className="text-lg font-semibold text-white/90 mt-4 mb-2">A) Information you provide</h3>
                            <ul className="list-disc pl-6 space-y-2 mb-4">
                                <li><strong>Account details:</strong> name, handle/username, email, phone number, date of birth</li>
                                <li><strong>Optional profile details:</strong> Instagram ID, bio, preferences, Tribe choice</li>
                                <li><strong>User Content:</strong> photos, videos, captions, comments, ratings you submit</li>
                                <li><strong>Communications:</strong> messages to support, feedback, reports, surveys</li>
                            </ul>

                            <h3 className="text-lg font-semibold text-white/90 mt-4 mb-2">B) Information collected automatically</h3>
                            <ul className="list-disc pl-6 space-y-2 mb-4">
                                <li><strong>Device & technical data:</strong> device type, browser, OS, language, IP address</li>
                                <li><strong>Usage data:</strong> pages viewed, time spent, clicks, interactions, referral URLs</li>
                                <li><strong>Log data:</strong> error logs, diagnostics, performance data</li>
                                <li><strong>Cookies & similar technologies:</strong> (see Cookies section)</li>
                            </ul>

                            <h3 className="text-lg font-semibold text-white/90 mt-4 mb-2">C) Information from third parties (if enabled)</h3>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>Authentication providers:</strong> (e.g., Google/Apple login)</li>
                                <li><strong>Analytics providers:</strong> (aggregated usage insights)</li>
                                <li><strong>Payment partners:</strong> (if you purchase anything or receive rewards)</li>
                            </ul>
                        </section>

                        <section className="mt-8">
                            <h2 className="flex items-center gap-3 text-xl md:text-2xl font-black text-white mb-6 uppercase tracking-wider"><div className="w-2 h-8 flex-shrink-0 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full"></div>2. How We Use Your Information</h2>
                            <p className="mb-2">We use data to:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>create and manage your Account</li>
                                <li>operate Tribes, Matches, leaderboards, and scoring</li>
                                <li>detect fraud, bots, spam, and policy violations</li>
                                <li>personalize your experience (language, suggested challenges)</li>
                                <li>communicate updates, policy changes, and support responses</li>
                                <li>improve Platform performance and user experience</li>
                                <li>comply with legal obligations and enforce Terms</li>
                            </ul>
                        </section>

                        <section className="mt-8">
                            <h2 className="flex items-center gap-3 text-xl md:text-2xl font-black text-white mb-6 uppercase tracking-wider"><div className="w-2 h-8 flex-shrink-0 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full"></div>3. Legal Basis / Consent (Where Required)</h2>
                            <p className="mb-2">Depending on your location, we rely on:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>contract necessity (to provide the service)</li>
                                <li>legitimate interests (security, integrity, product improvement)</li>
                                <li>consent (marketing messages/cookies where required)</li>
                                <li>legal obligation (compliance, responding to lawful requests)</li>
                            </ul>
                        </section>

                        <section className="mt-8">
                            <h2 className="flex items-center gap-3 text-xl md:text-2xl font-black text-white mb-6 uppercase tracking-wider"><div className="w-2 h-8 flex-shrink-0 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full"></div>4. How We Share Your Information</h2>
                            <p className="mb-2">We may share:</p>
                            <ul className="list-disc pl-6 space-y-2 mb-4">
                                <li><strong>Service providers:</strong> (hosting, analytics, customer support tools) under confidentiality obligations</li>
                                <li><strong>Payment/verification partners:</strong> (only if rewards/payments are involved)</li>
                                <li><strong>Legal & safety:</strong> if required by law, court order, or to prevent fraud/abuse</li>
                                <li><strong>Business transfers:</strong> in a merger, acquisition, or sale (with appropriate safeguards)</li>
                            </ul>
                            <p className="text-white/60 text-sm italic">We do not sell your personal data in the ordinary sense. (If your business model changes, update this section.)</p>
                        </section>

                        <section className="mt-8">
                            <h2 className="flex items-center gap-3 text-xl md:text-2xl font-black text-white mb-6 uppercase tracking-wider"><div className="w-2 h-8 flex-shrink-0 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full"></div>5. Public Content & Visibility</h2>
                            <p>
                                Your handle, Tribe, uploads, captions, and ratings may be visible to other users depending on Platform settings. Please avoid posting sensitive personal information in public areas.
                            </p>
                        </section>

                        <section className="mt-8">
                            <h2 className="flex items-center gap-3 text-xl md:text-2xl font-black text-white mb-6 uppercase tracking-wider"><div className="w-2 h-8 flex-shrink-0 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full"></div>6. Data Retention</h2>
                            <p className="mb-2">We retain data as long as needed to:</p>
                            <ul className="list-disc pl-6 space-y-2 mb-4">
                                <li>provide the Platform,</li>
                                <li>comply with legal obligations,</li>
                                <li>resolve disputes, enforce rules, and maintain security.</li>
                            </ul>
                            <p>We may retain limited data in backups for a reasonable period.</p>
                        </section>

                        <section className="mt-8">
                            <h2 className="flex items-center gap-3 text-xl md:text-2xl font-black text-white mb-6 uppercase tracking-wider"><div className="w-2 h-8 flex-shrink-0 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full"></div>7. Security</h2>
                            <p>
                                We use reasonable administrative, technical, and organizational safeguards. However, no system is perfectly secure. Use strong passwords and protect your device.
                            </p>
                        </section>

                        <section className="mt-8">
                            <h2 className="flex items-center gap-3 text-xl md:text-2xl font-black text-white mb-6 uppercase tracking-wider"><div className="w-2 h-8 flex-shrink-0 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full"></div>8. Your Rights & Choices</h2>
                            <p className="mb-2">Depending on your location, you may have rights to:</p>
                            <ul className="list-disc pl-6 space-y-2 mb-4">
                                <li>access and correct your data</li>
                                <li>delete your account/data (subject to legal requirements)</li>
                                <li>withdraw consent (where consent is the basis)</li>
                                <li>opt out of marketing messages</li>
                                <li>request portability (where applicable)</li>
                            </ul>
                            <p>
                                To exercise rights, contact: <a href="mailto:hello@showgrid.ai" className="text-cyan-400 hover:text-cyan-300 transition-colors">hello@showgrid.ai</a>
                            </p>
                        </section>

                        <section className="mt-8">
                            <h2 className="flex items-center gap-3 text-xl md:text-2xl font-black text-white mb-6 uppercase tracking-wider"><div className="w-2 h-8 flex-shrink-0 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full"></div>9. Cookies & Analytics</h2>
                            <p className="mb-2">We use cookies and similar technologies to:</p>
                            <ul className="list-disc pl-6 space-y-2 mb-4">
                                <li>keep you logged in,</li>
                                <li>remember preferences,</li>
                                <li>measure usage, and</li>
                                <li>improve performance.</li>
                            </ul>
                            <p>You can control cookies through your browser settings. Disabling cookies may affect functionality.</p>
                        </section>

                        <section className="mt-8">
                            <h2 className="flex items-center gap-3 text-xl md:text-2xl font-black text-white mb-6 uppercase tracking-wider"><div className="w-2 h-8 flex-shrink-0 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full"></div>10. Children's Privacy</h2>
                            <p>
                                The Platform is not intended for children under 13. If we learn we collected data from a child under 13, we will delete it as required.
                            </p>
                        </section>

                        <section className="mt-8">
                            <h2 className="flex items-center gap-3 text-xl md:text-2xl font-black text-white mb-6 uppercase tracking-wider"><div className="w-2 h-8 flex-shrink-0 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full"></div>11. International Data Transfers</h2>
                            <p>
                                Your data may be processed in countries outside your own. We take steps to ensure appropriate safeguards where required.
                            </p>
                        </section>

                        <section className="mt-8">
                            <h2 className="flex items-center gap-3 text-xl md:text-2xl font-black text-white mb-6 uppercase tracking-wider"><div className="w-2 h-8 flex-shrink-0 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full"></div>12. Changes to This Policy</h2>
                            <p>
                                We may update this Privacy Policy. Changes will be posted with an updated date.
                            </p>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}
