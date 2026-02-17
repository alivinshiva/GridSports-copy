import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";

const tribesData = [
    { rank: 1, name: "IRON TRIBE", points: "2,840,500", trend: "neutral", color: "from-[#434343] to-[#000000]" },
    { rank: 2, name: "ROYAL TRIBE", points: "2,712,420", trend: "up", color: "from-[#ffd700] to-[#b8860b]" },
    { rank: 3, name: "INDIGO TRIBE", points: "2,650,110", trend: "down", color: "from-[#4b0082] to-[#0000cd]" },
    { rank: 4, name: "EMERALD TRIBE", points: "2,104,000", trend: "up", color: "from-[#00ff40] to-[#008020]" },
    { rank: 5, name: "ORANGE TRIBE", points: "1,950,200", trend: "neutral", color: "from-[#ffa500] to-[#ff4500]" },
    { rank: 6, name: "SCARLET TRIBE", points: "1,720,000", trend: "down", color: "from-[#ff2400] to-[#800000]" },
    { rank: 7, name: "CRIMSON TRIBE", points: "1,650,400", trend: "up", color: "from-[#dc143c] to-[#8b0000]" },
    { rank: 8, name: "PLATINUM TRIBE", points: "1,540,100", trend: "neutral", color: "from-[#e5e4e2] to-[#a9a9a9]" },
    { rank: 9, name: "TITANIUM TRIBE", points: "1,420,800", trend: "down", color: "from-[#878681] to-[#505050]" },
    { rank: 10, name: "AZURE TRIBE", points: "1,310,500", trend: "up", color: "from-[#007fff] to-[#0000ff]" },
];

export default function Tribes() {
    return (
        <AuthenticatedLayout>
            <div className="max-w-[1200px] mx-auto px-4 lg:px-8 py-6">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-[#1c140d] dark:text-white text-3xl lg:text-4xl font-black leading-tight tracking-tight">Season Leaderboard</h1>
                        <p className="text-[#9c7349] dark:text-[#cbad90] text-sm lg:text-base font-normal">Global power rankings for all color-based tribes.</p>
                    </div>
                </div>

                <div className="mb-6">
                    <div className="flex border-b border-[#e8dbce] dark:border-[#684d31] gap-6">
                        <button className="flex flex-col items-center justify-center border-b-4 border-primary text-[#1c140d] dark:text-white pb-2 pt-3 px-2">
                            <p className="text-sm lg:text-base font-bold leading-normal">Tribes</p>
                        </button>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#2a1f14] rounded-2xl border border-[#e8dbce] dark:border-[#684d31] overflow-hidden mb-8 shadow-2xl relative">
                    {/* <div className="absolute top-2 right-4 bg-primary text-white dark:text-background-dark text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter z-10"></div> */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[600px]">
                            <thead>
                                <tr className="bg-[#f8f7f5] dark:bg-[#342618]">
                                    <th className="px-4 py-3 md:px-6 md:py-4 text-[#9c7349] dark:text-[#cbad90] uppercase text-[10px] md:text-xs font-black tracking-widest w-16 md:w-28 text-center">Rank</th>
                                    <th className="px-4 py-3 md:px-6 md:py-4 text-[#9c7349] dark:text-[#cbad90] uppercase text-[10px] md:text-xs font-black tracking-widest">Tribe & Identity</th>
                                    <th className="px-4 py-3 md:px-6 md:py-4 text-[#9c7349] dark:text-[#cbad90] uppercase text-[10px] md:text-xs font-black tracking-widest text-right">Points</th>
                                    <th className="px-4 py-3 md:px-6 md:py-4 text-[#9c7349] dark:text-[#cbad90] uppercase text-[10px] md:text-xs font-black tracking-widest w-48 md:w-64">Top Creator Spotlight</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#e8dbce] dark:divide-[#493622]">
                                {tribesData.map((tribe, index) => (
                                    <tr key={index} className="hover:bg-primary/5 dark:hover:bg-white/5 transition-colors group">
                                        <td className="px-4 py-4 md:px-6 md:py-5">
                                            <div className="flex items-center justify-center gap-2">
                                                <span className={`${index < 3 ? 'text-primary' : 'text-[#9c7349] dark:text-[#cbad90]'} text-xl md:text-2xl font-black italic`}>#{tribe.rank}</span>
                                                <div className="flex items-center" title={tribe.trend === "up" ? "Moved Up" : tribe.trend === "down" ? "Dropped" : "Unchanged"}>
                                                    <span className={`material-symbols-outlined text-lg ${tribe.trend === "up" ? "text-green-500" : tribe.trend === "down" ? "text-red-500" : "text-gray-500"}`}>
                                                        {tribe.trend === "up" ? "arrow_drop_up" : tribe.trend === "down" ? "arrow_drop_down" : "horizontal_rule"}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 md:px-6 md:py-5">
                                            <div className="flex items-center gap-3 md:gap-5">
                                                <div className={`w-12 h-12 md:w-16 md:h-16 rounded-xl shadow-lg flex-shrink-0 bg-gradient-to-br ${tribe.color} border-2 border-white/20`}></div>
                                                <div className="flex flex-col">
                                                    <span className="text-[#1c140d] dark:text-white text-lg md:text-xl font-bold group-hover:text-primary transition-colors">{tribe.name}</span>
                                                    <span className="text-[#9c7349] dark:text-[#cbad90] text-xs md:text-sm">Consistent Powerhouse</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 md:px-6 md:py-5 text-right font-mono">
                                            <span className="text-[#1c140d] dark:text-white text-lg md:text-xl font-bold">{tribe.points}</span>
                                        </td>
                                        <td className="px-4 py-4 md:px-6 md:py-5">
                                            <div className="flex items-center gap-2 md:gap-3 bg-[#f4ede7] dark:bg-[#493622] rounded-full pl-2 pr-4 py-1 md:py-1.5 w-fit">
                                                <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuALnMl9EjIn4dCAPHKR-C9fyDv5W_dYN1-iQRDaw7-wfYs5_JEwdjdKxUzpv4lzC-CtVkIinRUxS27ccpcg0kuNVcfSgWTSOHIL0AaJkmoROCGbOcMvARnwYcwXspWilTCKCGC_gcCgqUFVxdha53-Z94qUh8r0xyflHkjr7zo32O0DSMmoXz0FQ9PCDt1ATZEdXQFICEQsOcnYJ5ZTj-O-vuTKZyzXEy4xrlLLVDr-nsFmVC7YWlg-ewBCEq9TVmk2OwjRP3nJUnM')" }}></div>
                                                <span className="text-[#1c140d] dark:text-white text-xs md:text-sm font-bold">@top_creator</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <section className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="material-symbols-outlined text-primary text-xl">stars</span>
                        <h2 className="text-xl md:text-2xl font-black uppercase tracking-widest text-[#1c140d] dark:text-white">Best of Season</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div className="bg-white dark:bg-[#2a1f14] rounded-2xl border border-[#e8dbce] dark:border-[#684d31] p-4 md:p-6 hover:border-primary/50 transition-all group">
                            <div className="flex justify-between items-start mb-3 md:mb-4">
                                <span className="bg-primary/20 text-primary text-[10px] font-black px-2 md:px-3 py-1 rounded-full uppercase">Top Meme</span>
                                <div className="flex items-center gap-1 text-primary">
                                    <span className="material-symbols-outlined text-xs md:text-sm">favorite</span>
                                    <span class="text-[10px] md:text-xs font-bold">12.4k</span>
                                </div>
                            </div>
                            <div className="aspect-video rounded-xl bg-[#493622] mb-3 md:mb-4 overflow-hidden relative border border-[#e8dbce] dark:border-[#493622]">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-3 md:p-4">
                                    <p className="text-white font-bold leading-tight text-sm md:text-base">When the Teal Grid actually stays organized for 5 minutes...</p>
                                </div>
                                <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDvmpGYgPGL9rxwkdR2YV32AChqvk3LiS7w_v31Wgp4KvqlrhS44yFx4j3p2oMk20ecM3hzKYSRAir-NycxI4fjzPP6nqVhSLoVbuQMSS15U2dj_2sk2DHd3VqFvRMXLpQx4j6_lJXtRXhhTU9I9SOFlN5g3GPT_tOj5TqfMEYXPRY3q-Dn4ckWDKlADgI6nPv0IvXyRHLs3OMI3wRhcYjFApZW_I7wEEbM6zsChJiwG9KjvkVP4ubuU2io6wTEe7MYDipzigyGBO0')" }}></div>
                            </div>
                            <div className="flex items-center gap-2 md:gap-3">
                                <div className="size-6 md:size-8 rounded-full bg-cover" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDtWExEPn_ZjKM-boN0tgZzLXN8YalaskyMZeopItG89xYYi-cD1VLmtC5ghqUqHEqdjmfDu-Rb4aBLWWa30Ng--1mxoKFJxXNqRm1Y6_HZn0g1W8zaswVm-Bn7-nTNwxbyVg43FEeQLyysKM20xv9GvEDK8vTB2ebXs6yvcnNbCZ_T0xZQygqTGKlNQVffako5mZrBhE6bzw9wMlsIaxzThco3Iq5_TC_nKPVo2AofwuYqvN3FeKVWPFkUiUTe9CpAISgMi-sZubs')" }}></div>
                                <div className="flex flex-col">
                                    <span className="text-[#1c140d] dark:text-white text-xs md:text-sm font-bold">@meme_lord_99</span>
                                    <span className="text-[#9c7349] dark:text-[#cbad90] text-[10px] font-medium">from Amber Pulse</span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-[#2a1f14] rounded-2xl border border-[#e8dbce] dark:border-[#684d31] p-4 md:p-6 hover:border-primary/50 transition-all group">
                            <div className="flex justify-between items-start mb-3 md:mb-4">
                                <span className="bg-primary/20 text-primary text-[10px] font-black px-2 md:px-3 py-1 rounded-full uppercase">Top Reaction</span>
                                <div className="flex items-center gap-1 text-primary">
                                    <span className="material-symbols-outlined text-xs md:text-sm">visibility</span>
                                    <span class="text-[10px] md:text-xs font-bold">8.9k</span>
                                </div>
                            </div>
                            <div className="aspect-video rounded-xl bg-[#493622] mb-3 md:mb-4 overflow-hidden relative border border-[#e8dbce] dark:border-[#493622]">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-3 md:p-4">
                                    <p className="text-white font-bold leading-tight text-sm md:text-base">POV: Crimson Void climbing to #2 overnight</p>
                                </div>
                                <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDbgvBYtinn6s6WheqdWAC_ClfNqRkvC37rFhcJE6NSIpQsOxzl3vBMFZZm9oBoFvvKf70qq9CVxa0389JyHbshZncScBhRA21eJIp-fdNkaetdSxJwbyFRR6OoS4a4Dr8Pn-syxneLBgazM3NDw11vuiqfdNT-ACK0WnUsxhjbaTG5Gl_GjOXaiexYfaNo-xp0HkTX2W0bpe3_TNaKtF9VhZirYnWKMnunFWc3iZvjxxgzoZ6cAOAmO_t5VMisoTnzta2Fl7O2UAo')" }}></div>
                            </div>
                            <div className="flex items-center gap-2 md:gap-3">
                                <div className="size-6 md:size-8 rounded-full bg-cover" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDzICtn8w0AeUffadvfueH-2YHisn5ac_MTgvmuCzC-vEF7EPeW4zinPb87GGhdAwcGxrz5LSQ6FUOYzTrqe8TvCXXO5tGgI_7VxKdeUtxRpY4VOakPOOi-sQu7EIJuIFfrKCcQRfuN2IkGkiNVfZdm-gpJ0Y9xH3s9ygOW8ja0AG4MrLasUwVxre8EHpPNCu2NiU22tkqTW7Qj3xf-t_LpvyzR6CG3FJZNlIFT1e2Du5D2X5v5YzjGDKf7R4Msxfiy-HKpyGzMQpE')" }}></div>
                                <div className="flex flex-col">
                                    <span className="text-[#1c140d] dark:text-white text-xs md:text-sm font-bold">@crimson_king</span>
                                    <span className="text-[#9c7349] dark:text-[#cbad90] text-[10px] font-medium">from Crimson Void</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </AuthenticatedLayout>
    );
}
