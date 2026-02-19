import { useState } from "react";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import Podium from "@/components/raceboard/Podium";
import LeaderboardTable from "@/components/raceboard/LeaderboardTable";

// --- Mock Data ---

// Creators Data
const creatorsPodium = [
    { rank: 1, name: "Champ_Speedy", points: "156,900 PTS", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCglMgtO1lIeVxFJnkLVG4mfNLj3HmskSEXN_bdPnrAiXLJe02IZwdyBQ1fZVrPV8EfHnQxfjcQXX9p8zQLhKlHzo9OLHCPy3yHQgfPvoF8RMnRC9OVi_uZXUbqtukkBQbnFjCjgGVXe5uJQ8xOLaTbT9-Su2oujObgFv_jQvd9SHcyaiNzc0ypeJ4DuEDhH90P-tcHG5lvuQNzXWItDaVl2PNBq7OI_slB21jI9iJQaHGduDA4iHjl2S8ftIsamw0eteGWZXoPAXg", subtitle: "Apex Racing" },
    { rank: 2, name: "RunnerUp_Alpha", points: "142,500 PTS", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDwQRtMnT_V1ztdvLthzCvoehyke92q1JYcmfiArchBm7MtCMA6rjjURJjluvB5jRTh_3qFrQMnmGOUn41oedWxB9LzI0XAMVpMF34w50jOsdB5q_0lR4tQcxsrvM4W6p8tZhnLk11LwMxr30mxCwMizHHlkV3APFIrpkeXGtI9kmcZ7Pg2WbhptgJ6e3ZdtvrbASYpVxHl2E1JNMN4UVPrMK52QBHwpUIT9oQHLaJTTC31I0T6OXKRMiD08XXRjqmajtdnpQpR0xs", subtitle: "Shadow Drifters" },
    { rank: 3, name: "Drift_King", points: "138,200 PTS", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBEWRgQFSowxHuLOdJD8VGtxOc4McYc1mIr7_lb5EKxmjFv01TTzlittrJQbChjVeeWuKsNfqavFT0LL6LxG_c4Y5xTBU5RYtvhQdwDTz9_VMDfvlUG7ln-V8DTWV5nkUCD6osscld_qHlnDSoRtyWrI0RK02f0sWY-znZEyl7v8akt9RO2GvoPY9KCjAh8lRGyP84TMVMRqexwjBWk1O8pj6OEVKkeJYgFVM2rOVQsKEgy2UL4_7Cfwdfb4STRBqegK2EsWaZQ4Mg", subtitle: "Wild Wheels" },
];

const creatorsTableData = [
    { rank: 4, name: "Velocity_Vibe", id: "R88", tribe: "Apex Racing", points: "72,300", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAKJiWh5BzdNyLjRTOz5dfMT1OhBFLFeX7Bne0UAY9HuERXnsRf0ShqrV3iAZqZzxGSkuVvPzG6gPI2vTrkgKn1dNGIcvXFqPDfIVhNZXTOq0h9bpZgdqkFqoYBC-Tt5jS_5QEb79xYKRH4D103fI3gxuTsGqsfyAEkMHnWllBHFL_C3WTNmO17sw9z-TVOTF42YQO8yDgkNu5obX-CumsjzunBelp7yBKhjXK10uALOpCCR1wGKjONmfaFEKpNpf3MlA9iHUNRwEY" },
    { rank: 5, name: "Nitro_Nate", id: "R22", tribe: "Shadow Drifters", points: "68,900", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBfh2QNySNvhyLU87OUUkaTFghcmxtdg9rz2CjM8fAn0eAVxI4ANmLcf23dLSuop3XKlpXNOdWwAqhOGmPmfQnEGFZxuYzkko_8195zWEGUrGebab3KmXY-ZdB2Squ103xjkMbej8OC8vI6mp6N9rKSIg6wD0TN4KE_iRwFuCmIfcEK9im_abqrB35X5rCnNY2_HhDV-F2UKE7EUBaJdF8K4_i8JMZMRu7l1odvtYsa5P_cnG7IaoZ3jbKSQ4PGkzbHr8fAbW8Ntk8" },
    { rank: 6, name: "Turbo_Tara", id: "R44", tribe: "Apex Racing", points: "65,400", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDiyXNNLhsAQAQfL-reFvPMCVYw0pM2PhgY4JtPgSNcL_OF7nIZD99K9JDkRpt3lj4eR05DgBmDlbKWPw5qLSsy3CJoHysaikNdKc0KZgj8QHF-ajkMOnQwXarmF3IpGae5u_QcM-MI3JtzQ8l44B0129E7W6SXGExFhnuARmxDI3PMZzxeRkKFpgrAqQcyQSWrXzaIwKs1BafUMHSmS05Acfoaesun77vea8mmFuXCcKCphtyvGepfdBELYhZDoGxX_y24F_m-tzA" },
    { rank: 7, name: "Burnout_Ben", id: "R12", tribe: "Wild Wheels", points: "61,200", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuA8wpJ1K9kgE6cnzEEhCURSHEFVDqG-DrB71RxGySheKlquYWNv1_BxrdNVz3U8vmhtk2NbLPqpMQuvApqZNT_v5LRNseEk9UMGyimQKkqGkV-CHbKhVYlMj45GhVCLVBUgGCXwqEBRx7dzGJGarivFMbRmTLoHklm1T6i8fzLehaO2rvuvro4AjYPofDYvmpGBkHf4RdtjvJj0gkbyJHshLZDbMP2ck0eX0hKHRWLKXG0draB9XRGz9W00UB77zDc1LIprw0dHeSs" },
    { rank: 8, name: "Shift_Sarah", id: "R56", tribe: "Shadow Drifters", points: "58,900", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBVKFpR5-Nwrttdkx3KRtemB52FzBrY8vDzmo3O-Dyl4n8sif53gimk3BYJkxzaTwCBiFiXTKWuyJgtcm4LQ0mbxSO4JjE03TPQ8W61Eu_Nn86RDEcqN_RuIujQIQtobSOd8SyIt4EvPOsQ0DafLl1p6g1LplIxKpRKmDVTz_nneJmLnSPkxcCqWHsV4B7EYV7Xtc8Kox2PCv81HxNmfZoHryNRUyPQkpVfuWIfGUYV5xDD2IVMtKQMR2HiMpztPLYCkO4dFkNN_TM" },
];

const creatorsColumns = [
    { key: "rank", label: "Rank", render: (row) => <span className="text-sm font-bold">{row.rank}</span> },
    {
        key: "name", label: "Creator", render: (row) => (
            <div className="flex items-center gap-3">
                <div className="size-8 rounded-full bg-cover bg-center" style={{ backgroundImage: `url('${row.avatar}')` }}></div>
                <span className="font-bold">{row.name}</span>
            </div>
        )
    },
    { key: "id", label: "Racing ID", render: (row) => <span className="text-sm font-mono text-[#9c7349] dark:text-[#c5a17e]">{row.id}</span> },
    { key: "tribe", label: "Tribe", render: (row) => <span className="px-3 py-1 bg-[#f4ede7] dark:bg-[#3d2d1e] text-slate-700 dark:text-[#c5a17e] rounded-full text-xs font-bold uppercase tracking-tighter">{row.tribe}</span> },
    { key: "points", label: "Season Points", align: "right", render: (row) => <span className="font-black text-primary">{row.points}</span> },
];

// Tribes Data
const tribesPodium = [
    { rank: 1, name: "IRON TRIBE", points: "2,840,500 PTS", avatar: "from-[#434343] to-[#000000]", subtitle: "Dominating Force" },
    { rank: 2, name: "ROYAL TRIBE", points: "2,712,420 PTS", avatar: "from-[#ffd700] to-[#b8860b]", subtitle: "Rising Power" },
    { rank: 3, name: "INDIGO TRIBE", points: "2,650,110 PTS", avatar: "from-[#4b0082] to-[#0000cd]", subtitle: "Strategic Masterminds" },
];

const tribesTableData = [
    { rank: 4, name: "EMERALD TRIBE", points: "2,104,000", color: "from-[#00ff40] to-[#008020]", trend: "up", members: "1,240" },
    { rank: 5, name: "ORANGE TRIBE", points: "1,950,200", color: "from-[#ffa500] to-[#ff4500]", trend: "neutral", members: "980" },
    { rank: 6, name: "SCARLET TRIBE", points: "1,720,000", color: "from-[#ff2400] to-[#800000]", trend: "down", members: "850" },
    { rank: 7, name: "CRIMSON TRIBE", points: "1,650,400", color: "from-[#dc143c] to-[#8b0000]", trend: "up", members: "820" },
    { rank: 8, name: "PLATINUM TRIBE", points: "1,540,100", color: "from-[#e5e4e2] to-[#a9a9a9]", trend: "neutral", members: "760" },
];

const tribesColumns = [
    { key: "rank", label: "Rank", render: (row) => <span className="text-sm font-bold text-slate-900 dark:text-white">#{row.rank}</span> },
    {
        key: "name", label: "Tribe", render: (row) => (
            <div className="flex items-center gap-3">
                <div className={`size-8 rounded-lg bg-gradient-to-br ${row.color} shadow-sm border border-white/20`}></div>
                <span className="font-black uppercase tracking-wide text-slate-900 dark:text-white">{row.name}</span>
            </div>
        )
    },
    {
        key: "trend", label: "Trend", render: (row) => (
            <span className={`material-symbols-outlined text-lg ${row.trend === "up" ? "text-green-500" : row.trend === "down" ? "text-red-500" : "text-gray-400"}`}>
                {row.trend === "up" ? "arrow_drop_up" : row.trend === "down" ? "arrow_drop_down" : "horizontal_rule"}
            </span>
        )
    },
    { key: "members", label: "Members", render: (row) => <span className="text-sm font-medium text-slate-500 dark:text-gray-400">{row.members} Members</span> },
    { key: "points", label: "Total Points", align: "right", render: (row) => <span className="font-black text-primary text-base">{row.points}</span> },
];

// Rankers Data
const rankersPodium = [
    { rank: 1, name: "Judge_Dredd", points: "15,400 REP", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDvmpGYgPGL9rxwkdR2YV32AChqvk3LiS7w_v31Wgp4KvqlrhS44yFx4j3p2oMk20ecM3hzKYSRAir-NycxI4fjzPP6nqVhSLoVbuQMSS15U2dj_2sk2DHd3VqFvRMXLpQx4j6_lJXtRXhhTU9I9SOFlN5g3GPT_tOj5TqfMEYXPRY3q-Dn4ckWDKlADgI6nPv0IvXyRHLs3OMI3wRhcYjFApZW_I7wEEbM6zsChJiwG9KjvkVP4ubuU2io6wTEe7MYDipzigyGBO0", subtitle: "Grandmaster Critic" },
    { rank: 2, name: "Fair_Play_Faye", points: "14,250 REP", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDbgvBYtinn6s6WheqdWAC_ClfNqRkvC37rFhcJE6NSIpQsOxzl3vBMFZZm9oBoFvvKf70qq9CVxa0389JyHbshZncScBhRA21eJIp-fdNkaetdSxJwbyFRR6OoS4a4Dr8Pn-syxneLBgazM3NDw11vuiqfdNT-ACK0WnUsxhjbaTG5Gl_GjOXaiexYfaNo-xp0HkTX2W0bpe3_TNaKtF9VhZirYnWKMnunFWc3iZvjxxgzoZ6cAOAmO_t5VMisoTnzta2Fl7O2UAo", subtitle: "Top Scout" },
    { rank: 3, name: "Critic_Chris", points: "13,800 REP", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDzICtn8w0AeUffadvfueH-2YHisn5ac_MTgvmuCzC-vEF7EPeW4zinPb87GGhdAwcGxrz5LSQ6FUOYzTrqe8TvCXXO5tGgI_7VxKdeUtxRpY4VOakPOOi-sQu7EIJuIFfrKCcQRfuN2IkGkiNVfZdm-gpJ0Y9xH3s9ygOW8ja0AG4MrLasUwVxre8EHpPNCu2NiU22tkqTW7Qj3xf-t_LpvyzR6CG3FJZNlIFT1e2Du5D2X5v5YzjGDKf7R4Msxfiy-HKpyGzMQpE", subtitle: "Sharp Eye" },
];

const rankersTableData = [
    { rank: 4, name: "Review_Rex", reviews: "1,120", accuracy: "98%", points: "12,500" },
    { rank: 5, name: "Scout_Sam", reviews: "980", accuracy: "96%", points: "11,200" },
    { rank: 6, name: "Vote_Vicky", reviews: "850", accuracy: "97%", points: "10,800" },
    { rank: 7, name: "Rate_Master", reviews: "810", accuracy: "95%", points: "9,900" },
    { rank: 8, name: "Elite_Eyes", reviews: "760", accuracy: "94%", points: "9,500" },
];

const rankersColumns = [
    { key: "rank", label: "Rank", render: (row) => <span className="text-sm font-bold text-slate-900 dark:text-white">#{row.rank}</span> },
    {
        key: "name", label: "Ranker", render: (row) => (
            <div className="flex items-center gap-3">
                <div className="size-8 rounded-full bg-slate-200 dark:bg-white/10 flex items-center justify-center text-xs font-bold text-slate-500">
                    {row.name[0]}
                </div>
                <span className="font-bold text-slate-900 dark:text-white">{row.name}</span>
            </div>
        )
    },
    { key: "reviews", label: "Reviews", render: (row) => <span className="text-sm font-mono text-[#9c7349] dark:text-[#c5a17e]">{row.reviews}</span> },
    { key: "accuracy", label: "Accuracy", render: (row) => <span className="px-2 py-1 bg-green-500/10 text-green-600 rounded text-xs font-bold">{row.accuracy}</span> },
    { key: "points", label: "Reputation Points", align: "right", render: (row) => <span className="font-black text-primary">{row.points}</span> },
];

export default function Raceboard() {
    const [activeTab, setActiveTab] = useState('creators');

    return (
        <AuthenticatedLayout>
            <div className="max-w-[1000px] mx-auto px-4 py-10 pb-32">
                {/* Page Heading */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Season Leaderboard</h2>
                        <p className="text-[#9c7349] dark:text-[#c5a17e]">The global elite ranking for Season 08: Velocity.</p>
                    </div>
                    {/* Segmented Control */}
                    <div className="flex bg-[#f4ede7] dark:bg-[#2d2116] p-1 rounded-xl w-full md:w-auto h-12">
                        {['creators', 'tribes', 'rankers'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 rounded-lg text-sm font-bold flex items-center justify-center transition-all capitalize ${activeTab === tab
                                        ? "bg-white dark:bg-primary shadow-sm text-slate-900 dark:text-white"
                                        : "text-[#9c7349] dark:text-[#c5a17e] hover:text-[#1c140d] dark:hover:text-white"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content switching based on tab */}
                {activeTab === 'creators' && (
                    <>
                        <Podium winners={creatorsPodium} type="creator" />
                        <LeaderboardTable data={creatorsTableData} columns={creatorsColumns} />
                    </>
                )}

                {activeTab === 'tribes' && (
                    <>
                        <Podium winners={tribesPodium} type="tribe" />
                        <LeaderboardTable data={tribesTableData} columns={tribesColumns} />
                    </>
                )}

                {activeTab === 'rankers' && (
                    <>
                        <Podium winners={rankersPodium} type="creator" />
                        <LeaderboardTable data={rankersTableData} columns={rankersColumns} />
                    </>
                )}

            </div>
        </AuthenticatedLayout>
    );
}
