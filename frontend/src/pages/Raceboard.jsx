import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";

import { Link } from "react-router-dom";

export default function Raceboard() {
    return (
        <AuthenticatedLayout>
            <div className="max-w-[1000px] mx-auto px-4 py-10 pb-32">
                {/* Page Heading */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-4xl font-black tracking-tight">Season Leaderboard</h2>
                        <p className="text-[#9c7349] dark:text-[#c5a17e]">The global elite ranking for Season 08: Velocity.</p>
                    </div>
                    {/* Segmented Control */}
                    <div className="flex bg-[#f4ede7] dark:bg-[#2d2116] p-1 rounded-xl w-full md:w-64 h-12">
                        <button className="flex-1 rounded-lg bg-white dark:bg-primary shadow-sm text-sm font-bold flex items-center justify-center">
                            Creators
                        </button>
                        <Link to="/tribes" className="flex-1 rounded-lg text-sm font-bold text-[#9c7349] dark:text-[#c5a17e] hover:text-[#1c140d] dark:hover:text-white flex items-center justify-center transition-colors">
                            Tribes
                        </Link>
                    </div>
                </div>

                {/* Hall of Fame Podium */}
                <div className="grid grid-cols-1 md:flex items-end justify-center gap-6 mb-16 px-4">
                    {/* 2nd Place */}
                    <div className="order-2 md:order-1 flex flex-col items-center gap-4 w-full md:w-64 group">
                        <div className="relative">
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#C0C0C0] text-white size-8 rounded-full flex items-center justify-center border-4 border-background-light dark:border-background-dark shadow-lg">
                                <span className="material-symbols-outlined text-lg">emoji_events</span>
                            </div>
                            <div className="size-28 rounded-full border-4 border-[#C0C0C0] p-1 overflow-hidden transition-transform group-hover:scale-105">
                                <div className="w-full h-full rounded-full bg-cover bg-center" data-alt="Runner-up creator avatar" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDwQRtMnT_V1ztdvLthzCvoehyke92q1JYcmfiArchBm7MtCMA6rjjURJjluvB5jRTh_3qFrQMnmGOUn41oedWxB9LzI0XAMVpMF34w50jOsdB5q_0lR4tQcxsrvM4W6p8tZhnLk11LwMxr30mxCwMizHHlkV3APFIrpkeXGtI9kmcZ7Pg2WbhptgJ6e3ZdtvrbASYpVxHl2E1JNMN4UVPrMK52QBHwpUIT9oQHLaJTTC31I0T6OXKRMiD08XXRjqmajtdnpQpR0xs')" }}></div>
                            </div>
                        </div>
                        <div className="text-center">
                            <p className="text-lg font-black italic">#2 RunnerUp_Alpha</p>
                            <p className="text-primary font-bold">142,500 PTS</p>
                        </div>
                    </div>

                    {/* 1st Place */}
                    <div className="order-1 md:order-2 flex flex-col items-center gap-6 w-full md:w-72 group transform scale-110 md:scale-100 z-10">
                        <div className="relative">
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#FFD700] text-white size-10 rounded-full flex items-center justify-center border-4 border-background-light dark:border-background-dark shadow-xl">
                                <span className="material-symbols-outlined text-xl">workspace_premium</span>
                            </div>
                            <div className="size-36 rounded-full border-4 border-[#FFD700] p-1.5 overflow-hidden transition-transform group-hover:scale-110 shadow-2xl shadow-primary/20">
                                <div className="w-full h-full rounded-full bg-cover bg-center" data-alt="Championship winner avatar" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCglMgtO1lIeVxFJnkLVG4mfNLj3HmskSEXN_bdPnrAiXLJe02IZwdyBQ1fZVrPV8EfHnQxfjcQXX9p8zQLhKlHzo9OLHCPy3yHQgfPvoF8RMnRC9OVi_uZXUbqtukkBQbnFjCjgGVXe5uJQ8xOLaTbT9-Su2oujObgFv_jQvd9SHcyaiNzc0ypeJ4DuEDhH90P-tcHG5lvuQNzXWItDaVl2PNBq7OI_slB21jI9iJQaHGduDA4iHjl2S8ftIsamw0eteGWZXoPAXg')" }}></div>
                            </div>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-black italic uppercase tracking-wider">#1 Champ_Speedy</p>
                            <p className="text-primary text-lg font-black">156,900 PTS</p>
                        </div>
                    </div>

                    {/* 3rd Place */}
                    <div className="order-3 flex flex-col items-center gap-4 w-full md:w-64 group">
                        <div className="relative">
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#CD7F32] text-white size-8 rounded-full flex items-center justify-center border-4 border-background-light dark:border-background-dark shadow-lg">
                                <span className="material-symbols-outlined text-lg">military_tech</span>
                            </div>
                            <div className="size-28 rounded-full border-4 border-[#CD7F32] p-1 overflow-hidden transition-transform group-hover:scale-105">
                                <div className="w-full h-full rounded-full bg-cover bg-center" data-alt="Third place creator avatar" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBEWRgQFSowxHuLOdJD8VGtxOc4McYc1mIr7_lb5EKxmjFv01TTzlittrJQbChjVeeWuKsNfqavFT0LL6LxG_c4Y5xTBU5RYtvhQdwDTz9_VMDfvlUG7ln-V8DTWV5nkUCD6osscld_qHlnDSoRtyWrI0RK02f0sWY-znZEyl7v8akt9RO2GvoPY9KCjAh8lRGyP84TMVMRqexwjBWk1O8pj6OEVKkeJYgFVM2rOVQsKEgy2UL4_7Cfwdfb4STRBqegK2EsWaZQ4Mg')" }}></div>
                            </div>
                        </div>
                        <div className="text-center">
                            <p className="text-lg font-black italic">#3 Drift_King</p>
                            <p className="text-primary font-bold">138,200 PTS</p>
                        </div>
                    </div>
                </div>

                {/* Leaderboard Table */}
                <div className="bg-white dark:bg-[#1a130c] rounded-xl border border-[#e8dbce] dark:border-[#3d2d1e] overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-background-light dark:bg-[#2d2116] border-b border-[#e8dbce] dark:border-[#3d2d1e]">
                                    <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest opacity-60">Rank</th>
                                    <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest opacity-60">Creator</th>
                                    <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest opacity-60">Racing ID</th>
                                    <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest opacity-60">Tribe</th>
                                    <th className="px-6 py-4 text-right text-xs font-black uppercase tracking-widest opacity-60">Season Points</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#e8dbce] dark:divide-[#3d2d1e]">
                                {/* Row 4 */}
                                <tr className="hover:bg-primary/5 transition-colors">
                                    <td className="px-6 py-5 text-sm font-bold">4</td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="size-8 rounded-full bg-cover bg-center" data-alt="Velocity Vibe creator avatar" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAKJiWh5BzdNyLjRTOz5dfMT1OhBFLFeX7Bne0UAY9HuERXnsRf0ShqrV3iAZqZzxGSkuVvPzG6gPI2vTrkgKn1dNGIcvXFqPDfIVhNZXTOq0h9bpZgdqkFqoYBC-Tt5jS_5QEb79xYKRH4D103fI3gxuTsGqsfyAEkMHnWllBHFL_C3WTNmO17sw9z-TVOTF42YQO8yDgkNu5obX-CumsjzunBelp7yBKhjXK10uALOpCCR1wGKjONmfaFEKpNpf3MlA9iHUNRwEY')" }}></div>
                                            <span className="font-bold">Velocity_Vibe</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-sm font-mono text-[#9c7349]">R88</td>
                                    <td className="px-6 py-5">
                                        <span className="px-3 py-1 bg-[#f4ede7] dark:bg-[#3d2d1e] rounded-full text-xs font-bold uppercase tracking-tighter">Apex Racing</span>
                                    </td>
                                    <td className="px-6 py-5 text-right font-black text-primary">72,300</td>
                                </tr>
                                {/* Row 5 */}
                                <tr className="hover:bg-primary/5 transition-colors">
                                    <td className="px-6 py-5 text-sm font-bold">5</td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="size-8 rounded-full bg-cover bg-center" data-alt="Nitro Nate creator avatar" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBfh2QNySNvhyLU87OUUkaTFghcmxtdg9rz2CjM8fAn0eAVxI4ANmLcf23dLSuop3XKlpXNOdWwAqhOGmPmfQnEGFZxuYzkko_8195zWEGUrGebab3KmXY-ZdB2Squ103xjkMbej8OC8vI6mp6N9rKSIg6wD0TN4KE_iRwFuCmIfcEK9im_abqrB35X5rCnNY2_HhDV-F2UKE7EUBaJdF8K4_i8JMZMRu7l1odvtYsa5P_cnG7IaoZ3jbKSQ4PGkzbHr8fAbW8Ntk8')" }}></div>
                                            <span className="font-bold">Nitro_Nate</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-sm font-mono text-[#9c7349]">R22</td>
                                    <td className="px-6 py-5">
                                        <span className="px-3 py-1 bg-[#f4ede7] dark:bg-[#3d2d1e] rounded-full text-xs font-bold uppercase tracking-tighter">Shadow Drifters</span>
                                    </td>
                                    <td className="px-6 py-5 text-right font-black text-primary">68,900</td>
                                </tr>
                                {/* Row 6 */}
                                <tr className="hover:bg-primary/5 transition-colors">
                                    <td className="px-6 py-5 text-sm font-bold">6</td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="size-8 rounded-full bg-cover bg-center" data-alt="Turbo Tara creator avatar" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDiyXNNLhsAQAQfL-reFvPMCVYw0pM2PhgY4JtPgSNcL_OF7nIZD99K9JDkRpt3lj4eR05DgBmDlbKWPw5qLSsy3CJoHysaikNdKc0KZgj8QHF-ajkMOnQwXarmF3IpGae5u_QcM-MI3JtzQ8l44B0129E7W6SXGExFhnuARmxDI3PMZzxeRkKFpgrAqQcyQSWrXzaIwKs1BafUMHSmS05Acfoaesun77vea8mmFuXCcKCphtyvGepfdBELYhZDoGxX_y24F_m-tzA')" }}></div>
                                            <span className="font-bold">Turbo_Tara</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-sm font-mono text-[#9c7349]">R44</td>
                                    <td className="px-6 py-5">
                                        <span className="px-3 py-1 bg-[#f4ede7] dark:bg-[#3d2d1e] rounded-full text-xs font-bold uppercase tracking-tighter">Apex Racing</span>
                                    </td>
                                    <td className="px-6 py-5 text-right font-black text-primary">65,400</td>
                                </tr>
                                {/* Row 7 */}
                                <tr className="hover:bg-primary/5 transition-colors">
                                    <td className="px-6 py-5 text-sm font-bold">7</td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="size-8 rounded-full bg-cover bg-center" data-alt="Burnout Ben creator avatar" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA8wpJ1K9kgE6cnzEEhCURSHEFVDqG-DrB71RxGySheKlquYWNv1_BxrdNVz3U8vmhtk2NbLPqpMQuvApqZNT_v5LRNseEk9UMGyimQKkqGkV-CHbKhVYlMj45GhVCLVBUgGCXwqEBRx7dzGJGarivFMbRmTLoHklm1T6i8fzLehaO2rvuvro4AjYPofDYvmpGBkHf4RdtjvJj0gkbyJHshLZDbMP2ck0eX0hKHRWLKXG0draB9XRGz9W00UB77zDc1LIprw0dHeSs')" }}></div>
                                            <span className="font-bold">Burnout_Ben</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-sm font-mono text-[#9c7349]">R12</td>
                                    <td className="px-6 py-5">
                                        <span className="px-3 py-1 bg-[#f4ede7] dark:bg-[#3d2d1e] rounded-full text-xs font-bold uppercase tracking-tighter">Wild Wheels</span>
                                    </td>
                                    <td className="px-6 py-5 text-right font-black text-primary">61,200</td>
                                </tr>
                                {/* Row 8 */}
                                <tr className="hover:bg-primary/5 transition-colors">
                                    <td className="px-6 py-5 text-sm font-bold">8</td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="size-8 rounded-full bg-cover bg-center" data-alt="Shift Sarah creator avatar" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBVKFpR5-Nwrttdkx3KRtemB52FzBrY8vDzmo3O-Dyl4n8sif53gimk3BYJkxzaTwCBiFiXTKWuyJgtcm4LQ0mbxSO4JjE03TPQ8W61Eu_Nn86RDEcqN_RuIujQIQtobSOd8SyIt4EvPOsQ0DafLl1p6g1LplIxKpRKmDVTz_nneJmLnSPkxcCqWHsV4B7EYV7Xtc8Kox2PCv81HxNmfZoHryNRUyPQkpVfuWIfGUYV5xDD2IVMtKQMR2HiMpztPLYCkO4dFkNN_TM')" }}></div>
                                            <span className="font-bold">Shift_Sarah</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-sm font-mono text-[#9c7349]">R56</td>
                                    <td className="px-6 py-5">
                                        <span className="px-3 py-1 bg-[#f4ede7] dark:bg-[#3d2d1e] rounded-full text-xs font-bold uppercase tracking-tighter">Shadow Drifters</span>
                                    </td>
                                    <td className="px-6 py-5 text-right font-black text-primary">58,900</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <button className="w-full py-4 text-sm font-bold text-[#9c7349] dark:text-[#c5a17e] hover:bg-background-light dark:hover:bg-[#2d2116] transition-colors border-t border-[#e8dbce] dark:border-[#3d2d1e]">
                        VIEW MORE COMPETITORS
                    </button>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
