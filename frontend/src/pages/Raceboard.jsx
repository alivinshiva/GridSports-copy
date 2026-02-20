import { useState, useEffect } from "react";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import LeaderboardTable from "@/components/raceboard/LeaderboardTable";
import { getCreatorLeaderboard, getRankerLeaderboard, getTribeLeaderboard } from "@/services/leaderboardService";


// The actual mapping will happen via the API inside the component
const creatorsColumns = [
    {
        key: "rank", label: "Rank", render: (row) => (
            <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-slate-900 dark:text-white">#{row.rank}</span>
                {row.trend === 'up' && <ArrowUp size={16} className="text-green-500" />}
                {row.trend === 'down' && <ArrowDown size={16} className="text-red-500" />}
                {row.trend === 'neutral' && <Minus size={16} className="text-gray-400" />}
            </div>
        )
    },
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

const DefaultTribesColorMap = {
    "IRON TRIBE": "from-[#434343] to-[#000000]",
    "ROYAL TRIBE": "from-[#ffd700] to-[#b8860b]",
    "INDIGO TRIBE": "from-[#4b0082] to-[#0000cd]",
    "EMERALD TRIBE": "from-[#00ff40] to-[#008020]",
    "ORANGE TRIBE": "from-[#ffa500] to-[#ff4500]",
    "SCARLET TRIBE": "from-[#ff2400] to-[#800000]",
    "CRIMSON TRIBE": "from-[#dc143c] to-[#8b0000]",
    "PLATINUM TRIBE": "from-[#e5e4e2] to-[#a9a9a9]",
    "TITANIUM TRIBE": "from-[#878681] to-[#606266]",
    "AZURE TRIBE": "from-[#007fff] to-[#000080]",
    "SILVER TRIBE": "from-[#c0c0c0] to-[#71706e]"
};
const tribesColumns = [
    {
        key: "rank", label: "Rank", render: (row) => (
            <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-slate-900 dark:text-white">#{row.rank}</span>
                {row.trend === 'up' && <ArrowUp size={16} className="text-green-500" />}
                {row.trend === 'down' && <ArrowDown size={16} className="text-red-500" />}
                {row.trend === 'neutral' && <Minus size={16} className="text-gray-400" />}
            </div>
        )
    },
    {
        key: "name", label: "Tribe", render: (row) => (
            <div className="flex items-center gap-3">
                <div className={`size-8 rounded-lg bg-gradient-to-br ${row.color} shadow-sm border border-white/20`}></div>
                <span className="font-black uppercase tracking-wide text-slate-900 dark:text-white">{row.name}</span>
            </div>
        )
    },
    { key: "members", label: "Members", render: (row) => <span className="text-sm font-medium text-slate-500 dark:text-gray-400">{row.members} Members</span> },
    { key: "points", label: "Total Points", align: "right", render: (row) => <span className="font-black text-primary text-base">{row.points}</span> },
];

const rankersColumns = [
    {
        key: "rank", label: "Rank", render: (row) => (
            <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-slate-900 dark:text-white">#{row.rank}</span>
                {row.trend === 'up' && <ArrowUp size={16} className="text-green-500" />}
                {row.trend === 'down' && <ArrowDown size={16} className="text-red-500" />}
                {row.trend === 'neutral' && <Minus size={16} className="text-gray-400" />}
            </div>
        )
    },
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
    const [dataState, setDataState] = useState({
        creatorsTableData: [],
        rankersTableData: [],
        tribesTableData: []
    });

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [creatorsRes, rankersRes, tribesRes] = await Promise.all([
                    getCreatorLeaderboard(),
                    getRankerLeaderboard(),
                    getTribeLeaderboard()
                ]);

                // Make sure at least one of the top 3 shows a red down arrow so it's visible with few entries
                const getMockTrend = (idx) => {
                    if (idx === 0) return 'neutral';
                    if (idx === 1) return 'down';   // 2nd place moved down
                    if (idx === 2) return 'up';     // 3rd place moved up
                    return idx % 2 === 0 ? 'down' : 'up';
                };

                // Map results to UI format
                // Creators
                const creators = creatorsRes.data || [];
                const fmtCreators = creators.map((c, idx) => ({
                    rank: idx + 1,
                    trend: getMockTrend(idx),
                    name: c.name,
                    id: c._id.slice(-6).toUpperCase(),
                    points: `${c.points.toLocaleString()} PTS`,
                    avatar: c.avatar || "https://i.pravatar.cc/150",
                    subtitle: c.tribe || "No Tribe",
                    tribe: c.tribe || "No Tribe"
                }));

                // Rankers
                const rankers = rankersRes.data || [];
                const fmtRankers = rankers.map((r, idx) => ({
                    rank: idx + 1,
                    trend: getMockTrend(idx),
                    name: r.name,
                    points: `${r.points.toLocaleString()} REP`,
                    avatar: r.avatar || "https://i.pravatar.cc/150",
                    subtitle: r.tribe || "Reviewer",
                    reviews: Math.floor(r.points / 3) || 0, // Mock reviews
                    accuracy: "98%"
                }));

                // Tribes
                const tribes = tribesRes.data || [];
                const fmtTribes = tribes.map((t, idx) => ({
                    rank: idx + 1,
                    name: t.name,
                    trend: getMockTrend(idx),
                    points: `${t.totalPoints.toLocaleString()} PTS`,
                    avatar: DefaultTribesColorMap[t.name] || "from-[#434343] to-[#000000]",
                    subtitle: "Dominating Force", // Mock
                    color: DefaultTribesColorMap[t.name] || "from-[#434343] to-[#000000]",
                    members: "1,000+" // Mock
                }));

                setDataState({
                    creatorsTableData: fmtCreators,
                    rankersTableData: fmtRankers,
                    tribesTableData: fmtTribes
                });

            } catch (err) {
                console.error("Failed to fetch leaderboards", err);
            }
        };

        fetchAll();
    }, []);

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
                    <LeaderboardTable data={dataState.creatorsTableData} columns={creatorsColumns} />
                )}

                {activeTab === 'tribes' && (
                    <LeaderboardTable data={dataState.tribesTableData} columns={tribesColumns} />
                )}

                {activeTab === 'rankers' && (
                    <LeaderboardTable data={dataState.rankersTableData} columns={rankersColumns} />
                )}

            </div>
        </AuthenticatedLayout>
    );
}
