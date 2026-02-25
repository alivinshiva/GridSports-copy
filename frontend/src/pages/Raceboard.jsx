import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import LeaderboardTable from "@/components/raceboard/LeaderboardTable";
import { getCreatorLeaderboard, getRankerLeaderboard, getTribeLeaderboard } from "@/services/leaderboardService";
import { User, Users, Star } from "lucide-react";

// Helper Columns
const creatorsColumns = [
    {
        key: "rank", label: "RANK", render: (row) => (
            <span className={`text-[13px] sm:text-[17px] pl-1 sm:pl-2 ${row.isHighlighted ? 'text-[#3b82f6] font-normal' : 'text-white font-normal'}`}>{row.rank}</span>
        )
    },
    {
        key: "name", label: "CREATOR", render: (row) => (
            <div className="flex items-center gap-2 sm:gap-4 w-full">
                {row.avatar ? (
                    <div className="size-6 sm:size-10 rounded-full bg-cover bg-center shrink-0" style={{ backgroundImage: `url('${row.avatar}')` }}></div>
                ) : (
                    <div className="size-6 sm:size-10 rounded-full bg-white flex shrink-0 items-center justify-center text-[10px] sm:text-sm font-bold text-slate-900 shadow-sm border border-black/10">
                        {row.name ? row.name.charAt(0).toUpperCase() : ''}
                    </div>
                )}
                <div className="flex flex-col justify-center min-w-0 pr-2">
                    <span className={`text-[12px] sm:text-[15px] leading-tight text-white font-medium truncate w-[100px] sm:w-auto`}>{row.name}</span>
                    {/* Mobile-only tribe indicator merged under name */}
                    <div className="flex sm:hidden items-center gap-1.5 mt-1">
                        <div className={`size-2 rounded-full bg-gradient-to-br ${row.color || "from-gray-500 to-gray-800"}`}></div>
                        <span className={`text-[9px] uppercase tracking-wider text-white/90 font-medium leading-tight truncate`}>{row.tribe}</span>
                    </div>
                </div>
            </div>
        )
    },
    {
        key: "tribe", label: "TRIBE", hideOnMobile: true, render: (row) => (
            <div className="flex items-center gap-2">
                <div className={`size-3 rounded-full bg-gradient-to-br ${row.color || "from-gray-500 to-gray-800"}`}></div>
                <span className={`text-[13px] uppercase tracking-wider text-white font-medium`}>{row.tribe}</span>
            </div>
        )
    },
    { key: "points", label: "SCORE", align: "center", render: (row) => <span className={`text-[14px] sm:text-[15px] ${row.isHighlighted ? 'text-white font-normal' : 'text-white font-normal'}`}>{row.points}</span> },
];

const tribesColumns = [
    {
        key: "rank", label: "RANK", render: (row) => (
            <span className={`text-[13px] sm:text-[17px] pl-1 sm:pl-2 ${row.isHighlighted ? 'text-[#3b82f6] font-normal' : 'text-white font-normal'}`}>{row.rank}</span>
        )
    },
    {
        key: "name", label: "TRIBE", render: (row) => (
            <div className="flex items-center gap-2 sm:gap-4 w-[140px] sm:w-auto">
                <div className={`size-5 sm:size-8 rounded-full bg-gradient-to-br ${row.avatar} shadow-sm border border-white/20 shrink-0`}></div>
                <span className={`uppercase tracking-wide text-[11px] sm:text-[15px] truncate ${row.isHighlighted ? 'text-white font-medium' : 'text-white font-medium'}`}>{row.name}</span>
            </div>
        )
    },
    { key: "points", label: "SCORE", align: "center", render: (row) => <span className={`text-[12px] sm:text-[15px] ${row.isHighlighted ? 'text-white font-normal' : 'text-white font-normal'}`}>{row.points}</span> },
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

    const [pagination, setPagination] = useState({
        creators: { page: 1, hasMore: true },
        raters: { page: 1, hasMore: true },
        tribes: { page: 1, hasMore: true },
    });

    const [loadingTab, setLoadingTab] = useState(null);

    const LIMIT = 15;

    const processData = (realData, offset = 0) => {
        return (realData || []).map((c, idx) => ({
            rank: offset + idx + 1,
            name: c.name || `User ${offset + idx + 1}`,
            points: c.points ? c.points.toLocaleString() : "0",
            avatar: c.avatar || null,
            tribe: c.tribe || "No Tribe",
            color: DefaultTribesColorMap[c.tribe] || "from-[#434343] to-[#000000]",
            isHighlighted: Boolean(user && (c.userId === user._id || c._id === user._id || c.name === user.name))
        }));
    };

    const processTribes = (realData, offset = 0) => {
        return (realData || []).map((t, idx) => ({
            rank: offset + idx + 1,
            name: t.name,
            points: t.totalPoints ? t.totalPoints.toLocaleString() : "0",
            avatar: DefaultTribesColorMap[t.name] || "from-[#434343] to-[#000000]",
            isHighlighted: Boolean(user && user.tribe && t.name === user.tribe)
        }));
    };

    const fetchInitialData = async () => {
        try {
            const [creatorsRes, rankersRes, tribesRes] = await Promise.all([
                getCreatorLeaderboard(1, LIMIT),
                getRankerLeaderboard(1, LIMIT),
                getTribeLeaderboard(1, LIMIT)
            ]);

            setDataState({
                creatorsTableData: processData(creatorsRes.data, 0),
                ratersTableData: processData(rankersRes.data, 0),
                tribesTableData: processTribes(tribesRes.data, 0)
            });

            setPagination({
                creators: { page: 1, hasMore: creatorsRes.data?.length === LIMIT },
                raters: { page: 1, hasMore: rankersRes.data?.length === LIMIT },
                tribes: { page: 1, hasMore: tribesRes.data?.length === LIMIT }
            });

        } catch (err) {
            console.error("Failed to fetch initial leaderboards", err);
        }
    };

    useEffect(() => {
        fetchInitialData();
    }, [user]);

    const handleLoadMore = async (tab) => {
        setLoadingTab(tab);
        try {
            const currentTabPagination = pagination[tab];
            const nextPage = currentTabPagination.page + 1;

            let res;
            let newData = [];

            if (tab === 'creators') {
                res = await getCreatorLeaderboard(nextPage, LIMIT);
                newData = processData(res.data, dataState.creatorsTableData.length);
                setDataState(prev => ({ ...prev, creatorsTableData: [...prev.creatorsTableData, ...newData] }));
            } else if (tab === 'raters') {
                res = await getRankerLeaderboard(nextPage, LIMIT);
                newData = processData(res.data, dataState.ratersTableData.length);
                setDataState(prev => ({ ...prev, ratersTableData: [...prev.ratersTableData, ...newData] }));
            } else if (tab === 'tribes') {
                res = await getTribeLeaderboard(nextPage, LIMIT);
                newData = processTribes(res.data, dataState.tribesTableData.length);
                setDataState(prev => ({ ...prev, tribesTableData: [...prev.tribesTableData, ...newData] }));
            }

            setPagination(prev => ({
                ...prev,
                [tab]: {
                    page: nextPage,
                    hasMore: res.data?.length === LIMIT
                }
            }));

        } catch (err) {
            console.error(`Failed to load more for ${tab}`, err);
        } finally {
            setLoadingTab(null);
        }
    };

    return (
        <AuthenticatedLayout>
            <div className="max-w-[1000px] mx-auto px-0 sm:px-4 py-10 pb-32 pt-20">
                {/* Header Card */}
                <div className="bg-[#181920] rounded-2xl mx-1 sm:mx-0 p-4 md:p-6 mb-6 flex flex-wrap items-center justify-between gap-4 md:gap-6 border border-white/5 shadow-2xl">
                    <h2 className="text-[20px] md:text-3xl font-medium tracking-wide text-[#3b82f6] px-2 leading-none">Season Leaderboard</h2>

                    {/* Segmented Control Pill */}
                    <div className="flex bg-[#32323a] p-1.5 rounded-full w-auto max-w-full overflow-x-auto h-[46px] items-center">
                        {[
                            { id: 'creators', label: 'creators', icon: User },
                            { id: 'tribes', label: 'tribes', icon: Users },
                            { id: 'raters', label: 'raters', icon: Star }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 md:px-6 h-full rounded-full flex items-center justify-center gap-2 transition-all min-w-[60px] md:min-w-[100px] ${activeTab === tab.id
                                    ? "bg-gradient-to-r from-[#70b1ff] to-[#59d5e0] shadow-[0_0_15px_rgba(112,177,255,0.3)] text-white"
                                    : "text-white/70 hover:text-white"
                                    }`}
                            >
                                <tab.icon size={16} className="shrink-0" />
                                <span className="text-[13px] md:text-sm font-semibold capitalize hidden sm:inline-block">
                                    {tab.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content switching based on tab */}
                {activeTab === 'creators' && (
                    <LeaderboardTable
                        data={dataState.creatorsTableData}
                        columns={creatorsColumns}
                        hasMore={pagination.creators.hasMore}
                        onLoadMore={() => handleLoadMore('creators')}
                        isLoading={loadingTab === 'creators'}
                    />
                )}

                {activeTab === 'tribes' && (
                    <LeaderboardTable
                        data={dataState.tribesTableData}
                        columns={tribesColumns}
                        hasMore={pagination.tribes.hasMore}
                        onLoadMore={() => handleLoadMore('tribes')}
                        isLoading={loadingTab === 'tribes'}
                    />
                )}

                {activeTab === 'raters' && (
                    <LeaderboardTable
                        data={dataState.ratersTableData}
                        columns={ratersColumns}
                        hasMore={pagination.raters.hasMore}
                        onLoadMore={() => handleLoadMore('raters')}
                        isLoading={loadingTab === 'raters'}
                    />
                )}

            </div>
        </AuthenticatedLayout>
    );
}
