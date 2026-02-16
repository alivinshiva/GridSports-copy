import React from 'react';
import { Link } from 'react-router-dom';
import { BottomNav } from "@/components/home/BottomNav";

const ChallengeEntries = () => {
    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white min-h-screen font-display">
            <div className="layout-container flex flex-col min-h-screen">
                {/* Top Navigation Bar */}
                {/* Top Navigation Bar Removed */}

                <main className="flex-1 max-w-[1200px] mx-auto w-full px-4 lg:px-10 py-6">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center gap-2 mb-4 text-sm font-medium text-slate-500 dark:text-white/40">
                        {/* <Link to="#" className="hover:text-primary">Challenges</Link> */}
                        {/* <span className="material-symbols-outlined text-[16px]">chevron_right</span> */}
                        {/* <span className="text-slate-900 dark:text-white">Race Start Reaction</span> */}
                    </nav>

                    {/* Page Heading */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                        <div className="space-y-2">
                            <h1 className="text-4xl md:text-5xl font-black tracking-tight">Race Start Reaction</h1>
                            <div className="flex items-center gap-3">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/20 text-primary uppercase tracking-wider">All Participation</span>
                                {/* <p className="text-slate-500 dark:text-white/60 font-medium">1,240 fan submissions</p> */}
                            </div>
                        </div>
                        <Link to="/" className="flex items-center justify-center gap-2 px-6 h-12 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 font-bold transition-all text-sm md:text-base border border-slate-200 dark:border-white/10">
                            <span className="material-symbols-outlined">arrow_back</span>
                            <span>Back to Challenge</span>
                        </Link>
                    </div>

                    {/* Filters */}
                    <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2 no-scrollbar">
                        <button className="flex items-center gap-2 px-5 h-10 rounded-full bg-primary text-white font-bold text-sm whitespace-nowrap">
                            <span className="material-symbols-outlined text-[18px]">trending_up</span>
                            Top Rated
                        </button>
                        <button className="flex items-center gap-2 px-5 h-10 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 font-medium text-sm whitespace-nowrap">
                            <span className="material-symbols-outlined text-[18px]">schedule</span>
                            Recent
                        </button>
                        <button className="flex items-center gap-2 px-5 h-10 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 font-medium text-sm whitespace-nowrap">
                            <span className="material-symbols-outlined text-[18px]">verified</span>
                            Following
                        </button>
                        <div className="h-6 w-[1px] bg-slate-200 dark:bg-white/10 mx-2"></div>
                        <button className="flex items-center gap-2 px-3 h-10 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 font-medium text-sm">
                            <span className="material-symbols-outlined text-[18px]">filter_list</span>
                            Filter
                        </button>
                    </div>

                    {/* Entry Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {/* Entry Card 1 */}
                        <div className="group relative flex flex-col bg-white dark:bg-white/5 rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 hover:border-primary/50 transition-all cursor-pointer">
                            <div className="relative aspect-[9/16] overflow-hidden">
                                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" data-alt="Fan reaction video thumbnail" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDTW1u4Qb6b3cKAIEB4QjXL_cAqchGd8386OknZ0NMkVglzgafot0M-6-NSsMzvKKKSlgFzfX3JIu8rpiXc7ZbAZtBnW88isnyfE7a2_m6HZv7JCre2Z8q895jbRNn5rmMURH49V3dDUx5jMEayUiESwKqcVC9ylkJ-Xh9VnLggK6ORdQctQQxN0CkRhWhF2AXO-z7-jkrsaLgvBaK0-e0TLgN6tfBsmVwg7D7Ok8rt0WRLJ34Y9EtnG2MYLombmUdPVE-PKARHbPA")' }}></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center text-white shadow-xl scale-90 group-hover:scale-100 transition-transform">
                                        <span className="material-symbols-outlined text-4xl">play_arrow</span>
                                    </div>
                                </div>
                                <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-lg font-black text-lg shadow-lg">
                                    9.2
                                </div>
                            </div>
                            <div className="p-4 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-cover bg-center border-2 border-white/20" data-alt="MaxFan_99 profile photo" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDq8mlBrrhb9aAOEUv4RoCLibx-lNoXmmND83a5h_cGSCXfHkHdPyOhvCvT--cyU3yOms-hfI1hPvjjvk-g3Ri1gAwH04H7At_GtBE882ZW6ntGxf9hu94L1roKXmDDVpVZdO_6k8g8cBQMpvxLJYZkv4Dbl_MF9FCiha4mIMAvBeMbYl9-ntESwOphtU8s7tqIKnTh9nl48-ToMdXftyjS8_lInBtzPOtYBN_b2ocu4muZ6bG9xYCCd4S7hRNY8hpuMZkYxq7_UsA")' }}></div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-sm truncate">MaxFan_99</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black bg-slate-200 dark:bg-white/10 px-1.5 py-0.5 rounded text-slate-600 dark:text-white/60">B4</span>
                                        <span className="text-xs text-slate-500 dark:text-white/40">2h ago</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Entry Card 2 */}
                        <div className="group relative flex flex-col bg-white dark:bg-white/5 rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 hover:border-primary/50 transition-all cursor-pointer">
                            <div className="relative aspect-[9/16] overflow-hidden">
                                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" data-alt="Excited racing fan thumbnail" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDbIljCtITu41-3rfR3QtmNRtouGpTJMPs0KHZON1FWN0QCR7JyM7xwOs-zUpCxQVOl9AXoXkj6tZLSCUbdf0Ranz3my5BJqwBNB5jmB7zmWyHHlsrEeSP7OGLoXTG2llPEYqS1cFaDfqkVjlL4Az7HP4HBJ7DQcKQc53EW2xcZt7L3CYA2MFkHg_qMmqyLtFLzQ6z5nVJ5ANOPNRgADX9m40VY3Wlz5IhqKT3Y0h663Blf0YGTw8tr9D4RfqRqkUDoxJibR2tYBAQ")' }}></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center text-white shadow-xl">
                                        <span className="material-symbols-outlined text-4xl">play_arrow</span>
                                    </div>
                                </div>
                                <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-lg font-black text-lg shadow-lg">
                                    8.9
                                </div>
                            </div>
                            <div className="p-4 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-cover bg-center border-2 border-white/20" data-alt="TurboSpeed profile photo" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBezXNM7ccnjhrt6nx7bsjXhkn0gu5NQIie25NOey3W3lOkxF1i32NVRpYoCmAGUY9P3vVPtGR_0Cm2i6duMf45f_sS6mGUTKNN6UVR_ZzSiXi-jJfhcP2n0Z_EjJRqQnqO-UAnblOyek7PXVF5uQ0JMg0ifTDPsWmsl3viVEidx-johiTO-1A9lLY2YUpirKRoTmsx43ZE_iGwbAJD7sMCyp3Pl68kTk3SKsCmtMY0z3nEvOQYP3e5e2wFjEqhidFfKIzOSb4x948")' }}></div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-sm truncate">TurboSpeed</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black bg-slate-200 dark:bg-white/10 px-1.5 py-0.5 rounded text-slate-600 dark:text-white/60">A2</span>
                                        <span className="text-xs text-slate-500 dark:text-white/40">5h ago</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Entry Card 3 */}
                        <div className="group relative flex flex-col bg-white dark:bg-white/5 rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 hover:border-primary/50 transition-all cursor-pointer">
                            <div className="relative aspect-[9/16] overflow-hidden">
                                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" data-alt="Fan reaction video at track" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD_ndKXKUBawOmEQ3JxX81Lrnw6woz1zEv_hiixUAq49agGCKagsHLd32Y76KBeU7VtMdNrntznP56TADF4qrekqTKhgp4SHEvmPmE6UGBPAHmkaxt18HcZSITE4bcAIrfHUj7sMh6bKat29-6YwZHzwMoJvZyAjSEO_Inw9le7phgFknklKc_ureppAeHaqjdY3345rZcjIzRCRsOxtTX9wy_WACgtNF1B1_N1iR5lMs8Nv04zIZVDr3IeXb5n_sXWliYLYYF7gPg")' }}></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center text-white shadow-xl">
                                        <span className="material-symbols-outlined text-4xl">play_arrow</span>
                                    </div>
                                </div>
                                <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-lg font-black text-lg shadow-lg">
                                    8.7
                                </div>
                            </div>
                            <div className="p-4 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-cover bg-center border-2 border-white/20" data-alt="RacingPro_1 profile photo" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB_87GDEXyvP06myZk3EviBtzzRHV2hDwqJGnHnGRk94lS3MpztY_clglIXeny-BB9kihdylOELBLYcZN5j1y6PwRXc54DjdbCTQQpmdlANB9MMY8aKg1RvqTtzm2nBql99nxDzZd680WQnN14Qyh203Dazdg4rLVnP3AfoyTRpPYE_UHAVl7yihmYY91plWNN9VnNfXYNxQsdVpYYdbcjVDFGPys1rIShBNc1MdMHYkZC0DwZajN-PbGDjPKQTk-ij8CBzdwQgO9g")' }}></div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-sm truncate">RacingPro_1</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black bg-slate-200 dark:bg-white/10 px-1.5 py-0.5 rounded text-slate-600 dark:text-white/60">C7</span>
                                        <span className="text-xs text-slate-500 dark:text-white/40">1d ago</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Entry Card 4 */}
                        <div className="group relative flex flex-col bg-white dark:bg-white/5 rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 hover:border-primary/50 transition-all cursor-pointer">
                            <div className="relative aspect-[9/16] overflow-hidden">
                                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" data-alt="Fan cheering in red gear" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC84DcQuruQezhKgsqpZPLIFehiZ8tX8U5-sxHfjfeoYsG_3L8QmTzULzJ2Lxm6ZTrijBCZkyPSP8MgtMaS87U1FtNopPu5EoKBjLBmll25EO0371xdlKKDoK-s1oW81hCfGrKP5p1oNLN3tyTaI6p8gy_YEGN5kRvKiYXgbfmwswZFh2g1uhqLfCTKQ3Ad59Ws8Y2fnoTIqaCIDGGFruoXkvgETyTR-XcUfYZ-qneAIKM6BcgPcvadd1DC6V1AaSYFEbEyze63r5M")' }}></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center text-white shadow-xl">
                                        <span className="material-symbols-outlined text-4xl">play_arrow</span>
                                    </div>
                                </div>
                                <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-lg font-black text-lg shadow-lg">
                                    8.5
                                </div>
                            </div>
                            <div className="p-4 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-cover bg-center border-2 border-white/20" data-alt="SpeedDemon profile photo" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDQyX5NljJNCbAhmYAmCcLhHnEASDHB4gzIxM0waHfRzTYeTSP91yRxvgZytCuHv1_3XWNzT3VQO2hFuhZlT8iJocIu1xoW0c7Y75hZNX-4pqiN7lYkO1YDfCqqvuwIefwKTt8za6_OLJOd-a_tvhxDec4VavRRIoNZ7Tp7be3sKR5Dg3l9vUGWfmeYeirbLYz1PJUYhhwGeVd7QAUgZXjBbSo7ujjUmn0WcSyiWjACxXBf1Hz8Kt9bDkHny-B5SM8pvd3YwQSXX5M")' }}></div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-sm truncate">SpeedDemon</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black bg-slate-200 dark:bg-white/10 px-1.5 py-0.5 rounded text-slate-600 dark:text-white/60">B1</span>
                                        <span className="text-xs text-slate-500 dark:text-white/40">1d ago</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Entry Card 5 */}
                        <div className="group relative flex flex-col bg-white dark:bg-white/5 rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 hover:border-primary/50 transition-all cursor-pointer">
                            <div className="relative aspect-[9/16] overflow-hidden">
                                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" data-alt="Fan reacting with steering wheel" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDV0gy2axK34noGkQ3Ix05-rT1LjXIUHdMpCfiQL-ZryfUcHOzaQ9e5pNWdityzWIvej8u7gfhBHAL5Gv9eSgxVVuoacXIG3xVqKCkj4040fIvVWjJ1vUID0PAQO72DliFI-sNiAHDMWzloFHcE7hlsr45i7yQEuoQZ-2gX8ho1BHo8U8VnZqGAj5KSHuXxJ3msxlKNCvHfCChaBGwRiRAEvNvqNr-iX1XhRz09O2-7byUz502_M1S8F_bwUz5qCHweZCi0P17Bwxs")' }}></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                                <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-lg font-black text-lg shadow-lg">8.4</div>
                            </div>
                            <div className="p-4 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-cover bg-center border-2 border-white/20" data-alt="F1Lover profile photo" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuChyHW0nXMbi_pK7u7F_6Bo2PBNbvFVcyERb1zqm7l03wYR1pgfxBTcI1L9GoD7bqFB9hwI7LTNalinmzxKO7zdBIUdZQQBMBG8BKZxIuu-MxHJ92Et5TGhrpLNW2z9uXOl4f6xmUAXEAHIP-mjSS-jyR6mzVRsqmHG2BhPmLpk7nfS7xsScmmvUFaAiYMZMhPrqk5ce1UQzibhp-SXCLYezx1z7BQX5joLWMazrN_FJVoNwyDnolV7_NoTMRnJ74Fj5B8VDMB_B7Q")' }}></div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-sm truncate">F1Lover</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black bg-slate-200 dark:bg-white/10 px-1.5 py-0.5 rounded text-slate-600 dark:text-white/60">D4</span>
                                        <span className="text-xs text-slate-500 dark:text-white/40">2d ago</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Entry Card 6 */}
                        <div className="group relative flex flex-col bg-white dark:bg-white/5 rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 hover:border-primary/50 transition-all cursor-pointer">
                            <div className="relative aspect-[9/16] overflow-hidden">
                                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" data-alt="Fan cheering in crowd" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCHk1KM7ewFf9amgHSg0uo2ysCfiLSlb64F4WQsobYdbANfIXdB4VeY8XEy-yzIewhrOB5R47nWaCx2drXt30YmmPI0jFh577lJ_kmlOWBw3MmrJDSuhrNc19p4r0NOym6y_n0wRME-LUbnot5MVCiCDcvexkVxo-k1Uly-z4xZFfxzlRlGeT6Gx2DDfP-RgxrbB0wF915KNHtJj6vlVluuAJJawOZhCkGQgAahM_KjKtXG91izHOhtZajbWupv9RL7SQeSPXDWvgM")' }}></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                                <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-lg font-black text-lg shadow-lg">8.2</div>
                            </div>
                            <div className="p-4 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-cover bg-center border-2 border-white/20" data-alt="PitStopKing profile photo" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB-qDav8_45IHARGTcThb9L2mYHL4HibsBuvYAC-585BfipIsyiRpoPIa96B-0SZ0ox56lhYbLwQlR6nuxA0Pf8Th7QDIqKW3Jq0vOGoLrDAxNzd5s4kxgIiw-YeSn7SjPsmTraii9lMJgMIP1NrNSTrQHgZBCjf2r0XBNbzKI6UUMwSdz4uY0G3q4L2wrFkutrl2A4QidGF-HFRA8qfLHiMXIYsFJg0tZ7YG-tXmM3vcMkLgW5CDlOZLrJgqyy7E_bRBS-ZyIZK6U")' }}></div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-sm truncate">PitStopKing</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black bg-slate-200 dark:bg-white/10 px-1.5 py-0.5 rounded text-slate-600 dark:text-white/60">A5</span>
                                        <span className="text-xs text-slate-500 dark:text-white/40">2d ago</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Entry Card 7 */}
                        <div className="group relative flex flex-col bg-white dark:bg-white/5 rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 hover:border-primary/50 transition-all cursor-pointer">
                            <div className="relative aspect-[9/16] overflow-hidden">
                                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" data-alt="Fan with team flag" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD3-esZfy8wVeWGGEfN7K5c6XluzYyz8CTUddMOWWbZBe6Mw7ZPxw44DoxHxZRLBKkkbz-WH95g2_uaTH7AwmzsSdl2GhYi5_Sy4VLhZXqFNvwwFVRFJh52TAKLs8pGTjCcdbNp1hBz4vN98AP8I-CcYpFvekB-8UHl4LWVXV_X2Ey0C3R8Z6fNI0kdoZVdt4SZBuaVEGXBj9ZtOKwO0BQoPOqs8Sh1LO8LjPxbAkRhd4BvKKgDxrpLXvBEMPwiKDMN2U-tmFfZN9w")' }}></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                                <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-lg font-black text-lg shadow-lg">8.1</div>
                            </div>
                            <div className="p-4 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-cover bg-center border-2 border-white/20" data-alt="TrackMaster profile photo" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBHW2i3St_0TVo-SFIwC6gX-BqAckwM4EI3Pt1AAXxqHOJ4YFAPUgCv4xF3RgVwNErdbyghpzm6fDUM0L0ar1ZNsu6X38OpRvuh65qpF5XybPyIE8xFZX0mO159Z0L7xgJFZ4_pivXXJbvMiQwYivKld0XTC2byxP_i18CZU6k7RjfCcjsAWRos9OpjQqHahAbzjD0pTOjzOJJvpD6SKZ5cDBoicTban4kNqRME0BRgOjoPKgVW3H37fNaYRefhN02XP4CVfWA-lnU")' }}></div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-sm truncate">TrackMaster</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black bg-slate-200 dark:bg-white/10 px-1.5 py-0.5 rounded text-slate-600 dark:text-white/60">B9</span>
                                        <span className="text-xs text-slate-500 dark:text-white/40">3d ago</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Entry Card 8 */}
                        <div className="group relative flex flex-col bg-white dark:bg-white/5 rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 hover:border-primary/50 transition-all cursor-pointer">
                            <div className="relative aspect-[9/16] overflow-hidden">
                                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" data-alt="Fan reacting to overtakes" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAJ4ENK5K4E2nwODdTMsQOnM6uG2QRHK0ZlxLH7D8PzuMW3Cisfww4rZM6czRyKEhYeglW3uSqRo4avXGGgmMU0zfW82xC7jRlLYcg2uCxeQ6m4Sv1iB0NrvF69VrU9z1X1OON2CykTxPcJC-3L9Wnw3pYeARn0sRHHDRYvb0YWaNkaHd7K3erh2Ue_Q9re_BTa1Gbq4kaLkXZmGzl5SrCGnFOCtdRNtOhzkDiChZ_9ZOOH9FxHQ7YClofnn9773aJWOrH7IQDU17I")' }}></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                                <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-lg font-black text-lg shadow-lg">7.9</div>
                            </div>
                            <div className="p-4 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-cover bg-center border-2 border-white/20" data-alt="CheckeredFlag profile photo" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDE1S9F0FWg7KdLqhG9uHHE1vxaqnd1ybwM5Kha3M10SKROkp7o3jJsXAOMNjCHRmUqfdrBtjfhZ4BmN9N9Eof3pGvVaUJUviOVnkKUT90zDAl2q3XWyEZQeZI8wY45TT6qB4hO0vAY1jQXdDm3yREcgYSkN3aHzGxGW0B0dzUprgQus67E0elyl-qsfOe0xykfp3zeAOlqL7TxW2Iy4VpJBN7sOzftViMYh_Q0lSZoQityWlhU0okT8rp3Avu2KUC9UKkpOu9Dnvw")' }}></div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-sm truncate">CheckeredFlag</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black bg-slate-200 dark:bg-white/10 px-1.5 py-0.5 rounded text-slate-600 dark:text-white/60">C1</span>
                                        <span className="text-xs text-slate-500 dark:text-white/40">4d ago</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* Loading Indicator (Simulated for scroll) */}
                    <div className="flex flex-col items-center justify-center py-12 gap-4">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-sm font-medium text-slate-500 dark:text-white/40">Loading more amazing reactions...</p>
                    </div>
                </main>

                {/* Fixed Footer / CTA (Optional Mobile) */}
                <div className="md:hidden sticky bottom-6 left-1/2 -translate-x-1/2 z-40">
                    <button className="bg-primary text-white font-bold px-8 py-4 rounded-full shadow-2xl flex items-center gap-3 transform hover:scale-105 transition-transform">
                        <span className="material-symbols-outlined">add_circle</span>
                        Submit Reaction
                    </button>
                </div>
                <BottomNav />
            </div>
        </div>
    );
};

export { ChallengeEntries };
