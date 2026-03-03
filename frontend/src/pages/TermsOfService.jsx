import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { HomeHeader } from '../components/home/HomeHeader';
import logo from '../assets/logo1.svg';

export default function TermsOfService() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-neutral-950 min-h-screen font-sans text-white flex flex-col selection:bg-cyan-500/30">
            <Helmet>
                <title>Terms of Service | SHOWGRID</title>
                <meta name="description" content="Terms of Service for SHOWGRID / GRIDSPORTS Platform" />
            </Helmet>

            <HomeHeader />

            <main className="max-w-[800px] w-full mx-auto px-4 md:px-6 py-24 md:py-32 flex-1 relative">
                {/* Ambient Background Glow */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-2xl h-64 bg-purple-500/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>

                <div className="bg-neutral-900/40 border border-white/10 hover:border-white/20 transition-all duration-300 rounded-3xl p-6 md:p-12 shadow-2xl backdrop-blur-md relative overflow-hidden group">
                    {/* Top gradient accent */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500 opacity-80 group-hover:opacity-100 transition-opacity"></div>

                    <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 mb-8">
                        <div className="p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20 rounded-2xl w-fit shrink-0">
                            <FileText className="w-10 h-10 text-purple-400" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 tracking-widest uppercase mb-2">Terms of Service</h1>
                            <p className="text-white/60 text-sm md:text-base font-medium flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
                                Effective Date: <span className="text-white/80">03 03 2026</span>
                            </p>
                        </div>
                    </div>

                    <div className="w-full h-px bg-white/5 mb-10"></div>

                    <div className="prose prose-invert max-w-none text-white/80 leading-relaxed text-sm md:text-base space-y-6">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-lg md:text-xl text-white/90 font-medium leading-relaxed shadow-inner space-y-4">
                            <p>
                                These Terms of Service ("Terms") govern your access to and use of the Showgrid / GRIDSPORTS website, mobile web app (PWA), and related services (collectively, the "Platform") operated by <span className="text-purple-400">[Company Legal Name]</span> ("Company", "we", "us", "our").
                            </p>
                            <p>
                                By accessing or using the Platform, you agree to these Terms. If you do not agree, do not use the Platform.
                            </p>
                        </div>

                        <section className="mt-8">
                            <h2 className="flex items-center gap-3 text-xl md:text-2xl font-black text-white mb-6 uppercase tracking-wider"><div className="w-2 h-8 flex-shrink-0 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>1. Definitions</h2>
                            <ul className="list-disc pl-6 space-y-2 mb-4">
                                <li><strong>"User":</strong> anyone who accesses or uses the Platform.</li>
                                <li><strong>"Account":</strong> your registered profile on the Platform.</li>
                                <li><strong>"Tribe":</strong> a color-based community group you can follow to participate in matches and leaderboards.</li>
                                <li><strong>"Match":</strong> a time-bound event around a race weekend during which uploads/ratings may count for points.</li>
                                <li><strong>"Content":</strong> text, images, videos, audio, comments, ratings, and other materials submitted or displayed on the Platform.</li>
                                <li><strong>"User Content":</strong> Content you upload, post, or submit.</li>
                                <li><strong>"Points / Scores":</strong> gamified values assigned by the Platform based on activity, quality signals, or rules.</li>
                            </ul>
                        </section>

                        <section className="mt-8">
                            <h2 className="flex items-center gap-3 text-xl md:text-2xl font-black text-white mb-6 uppercase tracking-wider"><div className="w-2 h-8 flex-shrink-0 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>2. Eligibility</h2>
                            <p className="mb-2">You must:</p>
                            <ol className="list-decimal pl-6 space-y-2 mb-4">
                                <li>be at least 13 years old to use the Platform, and</li>
                                <li>be at least 18 years old to be eligible for cash rewards/prizes (if applicable), unless local law permits otherwise.</li>
                            </ol>
                            <p>
                                If you are using the Platform on behalf of a company or organization, you represent that you are authorized to bind that entity.
                            </p>
                        </section>

                        <section className="mt-8">
                            <h2 className="flex items-center gap-3 text-xl md:text-2xl font-black text-white mb-6 uppercase tracking-wider"><div className="w-2 h-8 flex-shrink-0 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>3. Account Registration & Security</h2>
                            <ul className="list-disc pl-6 space-y-2 mb-4">
                                <li>You may be required to provide accurate information (e.g., email/phone, handle, date of birth).</li>
                                <li>You are responsible for safeguarding your login credentials and all activity under your Account.</li>
                                <li>You must notify us promptly of unauthorized access or security breaches.</li>
                            </ul>
                            <p>We may suspend or terminate Accounts for suspected fraud, abuse, or policy violations.</p>
                        </section>

                        <section className="mt-8">
                            <h2 className="flex items-center gap-3 text-xl md:text-2xl font-black text-white mb-6 uppercase tracking-wider"><div className="w-2 h-8 flex-shrink-0 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>4. Tribes: Following & Switching</h2>
                            <ul className="list-disc pl-6 space-y-2 mb-4">
                                <li>You may follow only one Tribe at a time, and your participation (points, uploads, ratings) is counted only under the Tribe you follow.</li>
                                <li>You may follow one Tribe per season/year. Switching may be restricted during an active Match window to protect fairness.</li>
                                <li>Tribe selection may affect leaderboard placement and reward eligibility.</li>
                            </ul>
                        </section>

                        <section className="mt-8">
                            <h2 className="flex items-center gap-3 text-xl md:text-2xl font-black text-white mb-6 uppercase tracking-wider"><div className="w-2 h-8 flex-shrink-0 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>5. Matches & Timing</h2>
                            <p className="mb-2">Unless otherwise stated for a specific event:</p>
                            <ul className="list-disc pl-6 space-y-2 mb-4">
                                <li>A Match opens 2 hours before the official race start time and closes 7 hours after the start time ("Match Window").</li>
                                <li>Only eligible actions (uploads/ratings) within the Match Window may count toward Match scoring.</li>
                            </ul>
                            <p>We may modify timing for operational, fairness, or technical reasons and will update the Match page accordingly.</p>
                        </section>

                        <section className="mt-8">
                            <h2 className="flex items-center gap-3 text-xl md:text-2xl font-black text-white mb-6 uppercase tracking-wider"><div className="w-2 h-8 flex-shrink-0 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>6. Upload • Rate • Win (How Participation Works)</h2>
                            <p className="mb-2">You can participate by:</p>
                            <ul className="list-disc pl-6 space-y-2 mb-4">
                                <li>Uploading User Content aligned to the active challenge(s); and/or</li>
                                <li>Rating other Users' content fairly and consistently.</li>
                            </ul>
                            <p className="mb-2">Points, ranking, and reward eligibility may depend on:</p>
                            <ul className="list-disc pl-6 space-y-2 mb-4">
                                <li>adherence to rules,</li>
                                <li>originality and quality signals,</li>
                                <li>community feedback, and</li>
                                <li>automated or manual integrity checks.</li>
                            </ul>
                            <p>We do not guarantee any specific points, ranking, visibility, or rewards.</p>
                        </section>

                        <section className="mt-8">
                            <h2 className="flex items-center gap-3 text-xl md:text-2xl font-black text-white mb-6 uppercase tracking-wider"><div className="w-2 h-8 flex-shrink-0 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>7. Content Ownership & License to Us</h2>
                            <p className="mb-4">
                                You retain ownership of your User Content. However, by posting User Content, you grant us a worldwide, non-exclusive, royalty-free, sublicensable license to host, store, reproduce, modify (for formatting/technical display), distribute, publicly display, and perform your User Content for the purpose of operating, promoting, and improving the Platform.
                            </p>
                            <p className="mb-2">You represent and warrant that:</p>
                            <ul className="list-disc pl-6 space-y-2 mb-4">
                                <li>you own your User Content or have all necessary rights/permissions to post it, and</li>
                                <li>your User Content does not violate any law or third-party rights.</li>
                            </ul>
                        </section>

                        <section className="mt-8">
                            <h2 className="flex items-center gap-3 text-xl md:text-2xl font-black text-white mb-6 uppercase tracking-wider"><div className="w-2 h-8 flex-shrink-0 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>8. Prohibited Content & Conduct</h2>
                            <p className="mb-2">You agree not to upload, post, or engage in:</p>
                            <ul className="list-disc pl-6 space-y-2 mb-4">
                                <li>hate speech, harassment, threats, doxxing, or bullying</li>
                                <li>nudity/sexual content involving minors, exploitation, or non-consensual content</li>
                                <li>graphic violence or instructions for wrongdoing</li>
                                <li>impersonation, misleading identity, or false claims</li>
                                <li>spam, scams, deceptive engagement tactics</li>
                                <li>bots, automated rating manipulation, coordinated brigading</li>
                                <li>uploading copyrighted broadcasts/paid stream clips or content you do not own</li>
                                <li>infringing trademarks/logos/sponsor marks without permission</li>
                                <li>any activity that disrupts Platform integrity or other Users' experience</li>
                            </ul>
                            <p>We may remove content or restrict accounts at our discretion to protect the community.</p>
                        </section>

                        <section className="mt-8">
                            <h2 className="flex items-center gap-3 text-xl md:text-2xl font-black text-white mb-6 uppercase tracking-wider"><div className="w-2 h-8 flex-shrink-0 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>9. Integrity, Anti-Fraud & Score Adjustments</h2>
                            <p className="mb-2">To keep competition fair, we may use automated and manual methods to detect:</p>
                            <ul className="list-disc pl-6 space-y-2 mb-4">
                                <li>duplicate uploads, stolen content, bot-like activity, coordinated manipulation, suspicious rating patterns, or policy violations.</li>
                            </ul>
                            <p className="mb-2">We may:</p>
                            <ul className="list-disc pl-6 space-y-2 mb-4">
                                <li>adjust, freeze, or reset Points/Scores,</li>
                                <li>disqualify entries,</li>
                                <li>restrict participation, or</li>
                                <li>suspend/terminate accounts.</li>
                            </ul>
                            <p>Our integrity actions may be taken without advance notice where needed for safety/fairness.</p>
                        </section>

                        <section className="mt-8">
                            <h2 className="flex items-center gap-3 text-xl md:text-2xl font-black text-white mb-6 uppercase tracking-wider"><div className="w-2 h-8 flex-shrink-0 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>10. Rewards / Prizes (If Offered)</h2>
                            <p className="mb-2">If the Platform offers rewards (cash, vouchers, perks, merchandise, etc.), then:</p>
                            <ul className="list-disc pl-6 space-y-2 mb-4">
                                <li>eligibility criteria may apply (age, location, verification, rule compliance).</li>
                                <li>you may be required to complete identity verification and tax documentation as required by law.</li>
                                <li>rewards may be void where prohibited by law.</li>
                                <li>we may substitute rewards of equal or similar value if necessary.</li>
                                <li>we may withhold rewards in cases of suspected fraud, policy violation, or incomplete verification.</li>
                            </ul>
                            <p className="font-bold">Important: The Platform is a skill/participation challenge environment and is not a betting or gambling service.</p>
                        </section>

                        <section className="mt-8">
                            <h2 className="flex items-center gap-3 text-xl md:text-2xl font-black text-white mb-6 uppercase tracking-wider"><div className="w-2 h-8 flex-shrink-0 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>11. Reporting, Takedown & Complaints</h2>
                            <p className="mb-2">If you believe content violates your rights or our policies, you can report it via:</p>
                            <p className="font-semibold text-white/90">Email: <a href="mailto:hello@showgrid.ai" className="text-cyan-400 hover:text-cyan-300 font-normal">hello@showgrid.ai</a></p>
                            <p>Provide enough detail (links/screenshots) for us to investigate.</p>
                        </section>

                        <section className="mt-8">
                            <h2 className="flex items-center gap-3 text-xl md:text-2xl font-black text-white mb-6 uppercase tracking-wider"><div className="w-2 h-8 flex-shrink-0 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>12. Intellectual Property (Our Platform)</h2>
                            <p>
                                The Platform (including UI, branding, design, code, and product features) is owned by us or licensed to us and is protected by intellectual property laws. You may not copy, reverse engineer, or exploit Platform materials without permission.
                            </p>
                        </section>

                        <section className="mt-8">
                            <h2 className="flex items-center gap-3 text-xl md:text-2xl font-black text-white mb-6 uppercase tracking-wider"><div className="w-2 h-8 flex-shrink-0 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>13. Third-Party Links & Services</h2>
                            <p>
                                The Platform may link to third-party sites or use third-party services (analytics, hosting, payments). We are not responsible for third-party terms, content, or practices.
                            </p>
                        </section>

                        <section className="mt-8">
                            <h2 className="flex items-center gap-3 text-xl md:text-2xl font-black text-white mb-6 uppercase tracking-wider"><div className="w-2 h-8 flex-shrink-0 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>14. Disclaimers (No Warranty)</h2>
                            <p>
                                The Platform is provided "AS IS" and "AS AVAILABLE". We do not warrant uninterrupted access, error-free operation, or that any content, rankings, or outcomes will meet your expectations.
                            </p>
                        </section>

                        <section className="mt-8">
                            <h2 className="flex items-center gap-3 text-xl md:text-2xl font-black text-white mb-6 uppercase tracking-wider"><div className="w-2 h-8 flex-shrink-0 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>15. Limitation of Liability</h2>
                            <p className="mb-2">To the maximum extent permitted by law:</p>
                            <ul className="list-disc pl-6 space-y-2 mb-4">
                                <li>we are not liable for indirect, incidental, consequential, special, or punitive damages, or loss of profits/data/goodwill.</li>
                                <li>our total liability for any claim is limited to the greater of (a) the amount you paid to us in the prior 3 months (if any) or (b) INR [amount]/USD [amount].</li>
                            </ul>
                            <p>Some jurisdictions do not allow certain limitations; in that case, limits apply to the extent permitted.</p>
                        </section>

                        <section className="mt-8">
                            <h2 className="flex items-center gap-3 text-xl md:text-2xl font-black text-white mb-6 uppercase tracking-wider"><div className="w-2 h-8 flex-shrink-0 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>16. Indemnity</h2>
                            <p>
                                You agree to indemnify and hold harmless the Company and its affiliates, officers, employees, and partners from any claims arising from your User Content, your use of the Platform, or your violation of these Terms.
                            </p>
                        </section>

                        <section className="mt-8">
                            <h2 className="flex items-center gap-3 text-xl md:text-2xl font-black text-white mb-6 uppercase tracking-wider"><div className="w-2 h-8 flex-shrink-0 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>17. Termination</h2>
                            <p className="mb-2">
                                You may stop using the Platform at any time. We may suspend or terminate access at our discretion for violations or risks to safety/fairness.
                            </p>
                            <p>Sections that should survive termination (e.g., IP, disclaimers, limitation of liability) will survive.</p>
                        </section>

                        <section className="mt-8">
                            <h2 className="flex items-center gap-3 text-xl md:text-2xl font-black text-white mb-6 uppercase tracking-wider"><div className="w-2 h-8 flex-shrink-0 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>18. Changes to Terms</h2>
                            <p>
                                We may update these Terms. The updated version will be posted with a revised "Last Updated" date. Continued use means you accept the updated Terms.
                            </p>
                        </section>

                        <section className="mt-8">
                            <h2 className="flex items-center gap-3 text-xl md:text-2xl font-black text-white mb-6 uppercase tracking-wider"><div className="w-2 h-8 flex-shrink-0 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>19. Governing Law & Disputes</h2>
                            <p>
                                These Terms are governed by the laws of [Bengaluru, India]. Courts located in [Karnataka] will have exclusive jurisdiction, unless mandatory consumer laws apply.
                            </p>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}
