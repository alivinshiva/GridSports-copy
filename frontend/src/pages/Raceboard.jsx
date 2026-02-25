import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import LeaderboardTable from "@/components/raceboard/LeaderboardTable";
import { getCreatorLeaderboard, getRankerLeaderboard, getTribeLeaderboard } from "@/services/leaderboardService";

// Helper Columns
const creatorsColumns = [
    {
        key: "rank", label: "RANK", render: (row) => (
            <span className={`text-[17px] pl-2 ${row.isHighlighted ? 'text-[#3b82f6] font-normal' : 'text-white font-normal'}`}>{row.rank}</span>
        )
    },
    {
        key: "name", label: "CREATOR", render: (row) => (
            <div className="flex items-center gap-4">
                {row.avatar ? (
                    <div className="size-10 rounded-full bg-cover bg-center" style={{ backgroundImage: `url('${row.avatar}')` }}></div>
                ) : (
                    <div className="size-10 rounded-full bg-white flex items-center justify-center text-sm font-bold text-slate-900 shadow-sm border border-black/10">
                        {row.name ? row.name.charAt(0).toUpperCase() : ''}
                    </div>
                )}
                <div className="flex flex-col">
                    <span className={`text-[15px] leading-tight text-white font-medium`}>{row.name}</span>
                    <span className={`text-[11px] mt-0.5 text-white/70 font-normal`}>{row.subtitle || "Active bbb"}</span>
                </div>
            </div>
        )
    },
    {
        key: "tribe", label: "TRIBE", render: (row) => (
            <div className="flex items-center gap-2">
                <div className={`size-3 rounded-full ${row.color || "bg-[#dc2626]"}`}></div>
                <span className={`text-[13px] uppercase tracking-wider text-white font-medium`}>{row.tribe}</span>
            </div>
        )
    },
    { key: "points", label: "SCORE", align: "center", render: (row) => <span className={`text-[15px] ${row.isHighlighted ? 'text-white font-normal' : 'text-white font-normal'}`}>{row.points}</span> },
];

const tribesColumns = [
    {
        key: "rank", label: "RANK", render: (row) => (
            <span className={`text-[17px] pl-2 ${row.isHighlighted ? 'text-[#3b82f6] font-normal' : 'text-white font-normal'}`}>{row.rank}</span>
        )
    },
    {
        key: "name", label: "TRIBE", render: (row) => (
            <div className="flex items-center gap-4">
                <div className={`size-8 rounded-full bg-gradient-to-br ${row.avatar} shadow-sm border border-white/20`}></div>
                <span className={`uppercase tracking-wide text-[15px] ${row.isHighlighted ? 'text-white font-medium' : 'text-white font-medium'}`}>{row.name}</span>
            </div>
        )
    },
    { key: "points", label: "SCORE", align: "center", render: (row) => <span className={`text-[15px] ${row.isHighlighted ? 'text-white font-normal' : 'text-white font-normal'}`}>{row.points}</span> },
];

const ratersColumns = creatorsColumns; // reuse UI style

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

export default function Raceboard() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('creators');
    const [dataState, setDataState] = useState({
        creatorsTableData: [],
        ratersTableData: [],
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

                const processData = (realData) => {
                    return (realData || []).map((c, idx) => ({
                        rank: idx + 1,
                        name: c.name || `User ${idx + 1}`,
                        points: c.points ? c.points.toLocaleString() : "0",
                        avatar: c.avatar || null,
                        subtitle: c.tribe ? "Active" : "Active",
                        tribe: c.tribe || "No Tribe",
                        color: "bg-[#dc2626]",
                        isHighlighted: Boolean(user && (c.userId === user._id || c._id === user._id || c.name === user.name))
                    }));
                };

                const processTribes = (realData) => {
                    return (realData || []).map((t, idx) => ({
                        rank: idx + 1,
                        name: t.name,
                        points: t.totalPoints ? t.totalPoints.toLocaleString() : "0",
                        avatar: DefaultTribesColorMap[t.name] || "from-[#434343] to-[#000000]",
                        isHighlighted: Boolean(user && user.tribe && t.name === user.tribe)
                    }));
                };

                setDataState({
                    creatorsTableData: processData(creatorsRes.data),
                    ratersTableData: processData(rankersRes.data),
                    tribesTableData: processTribes(tribesRes.data)
                });

            } catch (err) {
                console.error("Failed to fetch leaderboards", err);
            }
        };
        fetchAll();
    }, [user]);

    return (
        <AuthenticatedLayout>
            <div className="max-w-[1000px] mx-auto px-4 py-10 pb-32 pt-20">
                {/* Header Card */}
                <div className="bg-[#181920] rounded-2xl p-4 md:p-6 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-6 border border-white/5 shadow-2xl">
                    <h2 className="text-[28px] md:text-3xl font-medium tracking-wide text-[#3b82f6] px-2">Season Leaderboard</h2>

                    {/* Segmented Control Pill */}
                    <div className="flex bg-[#32323a] p-1.5 rounded-full w-full md:w-auto h-[46px] items-center">
                        {['creators', 'tribes', 'raters'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 md:px-6 h-full rounded-full text-[13px] md:text-sm font-semibold flex items-center justify-center transition-all min-w-[80px] md:min-w-[100px] capitalize ${activeTab === tab
                                    ? "bg-gradient-to-r from-[#70b1ff] to-[#59d5e0] shadow-[0_0_15px_rgba(112,177,255,0.3)] text-white"
                                    : "text-white/70 hover:text-white"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content switching based on tab */}
                {activeTab === 'creators' && (
                    <LeaderboardTable data={dataState.creatorsTableData} columns={creatorsColumns} enablePagination={true} />
                )}

                {activeTab === 'tribes' && (
                    <LeaderboardTable data={dataState.tribesTableData} columns={tribesColumns} enablePagination={false} />
                )}

                {activeTab === 'raters' && (
                    <LeaderboardTable data={dataState.ratersTableData} columns={ratersColumns} enablePagination={true} />
                )}

            </div>
        </AuthenticatedLayout>
    );
}
