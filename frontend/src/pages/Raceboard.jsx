import { useState, useEffect, useRef, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import LeaderboardTable from "@/components/raceboard/LeaderboardTable";
import { getCreatorLeaderboard, getRankerLeaderboard, getTribeLeaderboard, getCurrentUserRank } from "@/services/leaderboardService";
import { User, Users, Star, ChevronUp, ChevronDown } from "lucide-react";
import { Helmet } from "react-helmet-async";

// Helper function to render rank with arrow
const renderRankWithChange = (row) => {
    const getRankChangeIcon = () => {
        if (row.rankChange === 'up') {
            return <ChevronUp size={16} className="text-green-400" />;
        } else if (row.rankChange === 'down') {
            return <ChevronDown size={16} className="text-red-400" />;
        }
        return null;
    };

    return (
        <div className="flex items-center gap-1 sm:gap-2 pl-1 sm:pl-2">
            <span className={`text-[13px] sm:text-[17px] text-white font-normal`}>{row.rank}</span>
            {getRankChangeIcon()}
        </div>
    );
};

// Helper Columns
const creatorsColumns = [
    {
        key: "rank", label: "RANK", render: (row) => renderRankWithChange(row)
    },
    {
        key: "name", label: "CREATOR", render: (row) => (
            <div className="flex items-center gap-2 sm:gap-4 w-full">
                {row.avatar ? (
                    <div className="hidden sm:block size-10 rounded-full bg-cover bg-center shrink-0" style={{ backgroundImage: `url('${row.avatar}')` }}></div>
                ) : (
                    <div className={`hidden sm:flex size-10 rounded-full bg-gradient-to-br ${row.color || "from-gray-500 to-gray-800"} shrink-0 items-center justify-center text-sm font-bold text-white shadow-sm border border-white/20`}>
                        {row.name ? row.name.charAt(0).toUpperCase() : ''}
                    </div>
                )}
                <div className="flex flex-col justify-center min-w-0 pr-2">
                    <span className={`text-[12px] sm:text-[15px] leading-tight text-white font-medium break-words sm:truncate sm:w-auto`}>{row.name}</span>
                    {/* Mobile-only tribe indicator merged under name */}
                    <div className="flex sm:hidden items-center gap-1.5 mt-1">
                        <div className={`size-2 rounded-full bg-gradient-to-br ${row.color || "from-gray-500 to-gray-800"}`}></div>
                        <span className={`text-[9px] uppercase tracking-wider text-white font-medium leading-tight truncate`}>{row.tribe}</span>
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
        key: "rank", label: "RANK", render: (row) => renderRankWithChange(row)
    },
    {
        key: "name", label: "TRIBE", render: (row) => (
            <div className="flex items-center gap-2 sm:gap-4 w-[140px] sm:w-auto">
                <div className={`size-5 sm:size-8 rounded-full bg-gradient-to-br ${row.avatar} shadow-sm border border-white/20 shrink-0`}></div>
                <span className={`uppercase tracking-wide text-[11px] sm:text-[15px] truncate ${row.isHighlighted ? 'text-white font-medium' : 'text-white font-medium'}`}>{row.name}</span>
            </div>
        )
    },
    { key: "points", label: "POINTS", align: "center", render: (row) => <span className={`text-[12px] sm:text-[15px] ${row.isHighlighted ? 'text-white font-normal' : 'text-white font-normal'}`}>{row.points}</span> },
];

const ratersColumns = [
    {
        key: "rank", label: "RANK", render: (row) => renderRankWithChange(row)
    },
    {
        key: "name", label: "RATER", render: (row) => (
            <div className="flex items-center gap-2 sm:gap-4 w-full">
                {row.avatar ? (
                    <div className="hidden sm:block size-10 rounded-full bg-cover bg-center shrink-0" style={{ backgroundImage: `url('${row.avatar}')` }}></div>
                ) : (
                    <div className={`hidden sm:flex size-10 rounded-full bg-gradient-to-br ${row.color || "from-gray-500 to-gray-800"} shrink-0 items-center justify-center text-sm font-bold text-white shadow-sm border border-white/20`}>
                        {row.name ? row.name.charAt(0).toUpperCase() : ''}
                    </div>
                )}
                <div className="flex flex-col justify-center min-w-0 pr-2">
                    <span className={`text-[12px] sm:text-[15px] leading-tight text-white font-medium break-words sm:truncate sm:w-auto`}>{row.name}</span>
                    {/* Mobile-only tribe indicator merged under name */}
                    <div className="flex sm:hidden items-center gap-1.5 mt-1">
                        <div className={`size-2 rounded-full bg-gradient-to-br ${row.color || "from-gray-500 to-gray-800"}`}></div>
                        <span className={`text-[9px] uppercase tracking-wider text-white font-medium leading-tight truncate`}>{row.tribe}</span>
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

const DefaultTribesColorMap = {
    "ORANGE TRIBE": "from-[#E78230] to-[#0B0B0F]",
    "SCARLET TRIBE": "from-[#E43D32] to-[#8B0000]",
    "AZURE TRIBE": "from-[#48349c] to-[#171030]",
    "SILVER TRIBE": "from-[#C7CBD1] to-[#6b7280]",
    "GREEN TRIBE": "from-[#23554C] to-[#0f2e28]",
    "BLUE TRIBE": "from-[#0A1F62] to-[#061240]",
    "PINK TRIBE": "from-[#FF4FD8] to-[#6d1b8e]",
    "WHITE TRIBE": "from-[#e8e8e8] to-[#b0b0b0]",
    "CARBON TRIBE": "from-[#2a2a2a] to-[#111111]",
    "GRAPHITE TRIBE": "from-[#ff3b30] to-[#801d18]",
    "ONYX TRIBE": "from-[#1a1a1f] to-[#0B0B0F]"
};

export default function Raceboard() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('creators');
    const [currentUserRankData, setCurrentUserRankData] = useState(null);
    const [previousRanks, setPreviousRanks] = useState({
        creators: {},
        raters: {},
        tribes: {}
    });
    const [previousRankChanges, setPreviousRankChanges] = useState({
        creators: {},
        raters: {},
        tribes: {}
    });

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

    // Refs for each LeaderboardTable so we can scroll to the user row
    const creatorsTableRef = useRef(null);
    const ratersTableRef = useRef(null);
    const tribesTableRef = useRef(null);

    // Random target rank (1, 2, or 3) — stable per page load
    const targetTopRank = useMemo(() => Math.floor(Math.random() * 3) + 1, []);

    const LIMIT = 15;

    const processData = (realData, offset = 0, previousRankMap = {}, previousChangeMap = {}) => {
        return (realData || []).map((c, idx) => {
            const currentRank = offset + idx + 1;
            const userId = c.userId || c._id;
            const prevRank = previousRankMap[userId];
            const prevChange = previousChangeMap[userId];

            let rankChange = null;
            if (prevRank !== undefined) {
                if (currentRank < prevRank) {
                    rankChange = 'up';
                } else if (currentRank > prevRank) {
                    rankChange = 'down';
                } else {
                    // Rank is same, keep previous arrow direction
                    rankChange = prevChange || null;
                }
            }

            return {
                rank: currentRank,
                userId: userId,
                name: c.name || `User ${currentRank}`,
                points: c.points ? Math.round(c.points).toLocaleString() : "0",
                avatar: c.avatar || null,
                tribe: c.tribe || "No Tribe",
                color: DefaultTribesColorMap[c.tribe] || "from-[#434343] to-[#000000]",
                isHighlighted: Boolean(user && (c.userId === user._id || c._id === user._id || c.name === user.name)),
                rankChange: rankChange
            };
        });
    };

    const processTribes = (realData, offset = 0, previousRankMap = {}, previousChangeMap = {}) => {
        return (realData || []).map((t, idx) => {
            const currentRank = offset + idx + 1;
            const tribeName = t.name;
            const prevRank = previousRankMap[tribeName];
            const prevChange = previousChangeMap[tribeName];

            let rankChange = null;
            if (prevRank !== undefined) {
                if (currentRank < prevRank) {
                    rankChange = 'up';
                } else if (currentRank > prevRank) {
                    rankChange = 'down';
                } else {
                    // Rank is same, keep previous arrow direction
                    rankChange = prevChange || null;
                }
            }

            return {
                rank: currentRank,
                name: tribeName,
                points: t.totalPoints ? Math.round(t.totalPoints).toString() : "0",
                avatar: DefaultTribesColorMap[tribeName] || "from-[#434343] to-[#000000]",
                isHighlighted: Boolean(user && user.tribe && tribeName === user.tribe),
                rankChange: rankChange
            };
        });
    };

    const fetchInitialData = async () => {
        try {
            // Load previous ranks from localStorage
            const storedRanks = localStorage.getItem('leaderboardRanks');
            const prevRanks = storedRanks ? JSON.parse(storedRanks) : { creators: {}, raters: {}, tribes: {} };
            setPreviousRanks(prevRanks);

            // Load previous rank changes from localStorage
            const storedChanges = localStorage.getItem('leaderboardRankChanges');
            const prevChanges = storedChanges ? JSON.parse(storedChanges) : { creators: {}, raters: {}, tribes: {} };
            setPreviousRankChanges(prevChanges);

            const [creatorsRes, rankersRes, tribesRes, currentUserRes] = await Promise.all([
                getCreatorLeaderboard(1, LIMIT),
                getRankerLeaderboard(1, LIMIT),
                getTribeLeaderboard(1, LIMIT),
                user ? getCurrentUserRank().catch(() => null) : Promise.resolve(null)
            ]);

            // Process data with rank change information
            const creatorsData = processData(creatorsRes.data, 0, prevRanks.creators, prevChanges.creators);
            const ratersData = processData(rankersRes.data, 0, prevRanks.raters, prevChanges.raters);
            const tribesData = processTribes(tribesRes.data, 0, prevRanks.tribes, prevChanges.tribes);

            setDataState({
                creatorsTableData: creatorsData,
                ratersTableData: ratersData,
                tribesTableData: tribesData
            });

            // Store current ranks and rank changes for next comparison
            const newRanks = {
                creators: {},
                raters: {},
                tribes: {}
            };

            const newRankChanges = {
                creators: {},
                raters: {},
                tribes: {}
            };

            creatorsData.forEach(item => {
                if (item.userId) {
                    newRanks.creators[item.userId] = item.rank;
                    if (item.rankChange) newRankChanges.creators[item.userId] = item.rankChange;
                }
            });
            ratersData.forEach(item => {
                if (item.userId) {
                    newRanks.raters[item.userId] = item.rank;
                    if (item.rankChange) newRankChanges.raters[item.userId] = item.rankChange;
                }
            });
            tribesData.forEach(item => {
                if (item.name) {
                    newRanks.tribes[item.name] = item.rank;
                    if (item.rankChange) newRankChanges.tribes[item.name] = item.rankChange;
                }
            });

            localStorage.setItem('leaderboardRanks', JSON.stringify(newRanks));
            localStorage.setItem('leaderboardRankChanges', JSON.stringify(newRankChanges));

            if (currentUserRes && currentUserRes.success) {
                setCurrentUserRankData(currentUserRes.data);
            }

            setPagination({
                creators: { page: 1, hasMore: creatorsRes.data?.length === LIMIT },
                raters: { page: 1, hasMore: rankersRes.data?.length === LIMIT },
                tribes: { page: 1, hasMore: tribesRes.data?.length === LIMIT }
            });

        } catch (err) {
            // Silently handle error
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
                newData = processData(res.data, dataState.creatorsTableData.length, previousRanks.creators, previousRankChanges.creators);
                setDataState(prev => ({ ...prev, creatorsTableData: [...prev.creatorsTableData, ...newData] }));

                // Update stored ranks and rank changes for newly loaded data
                const updatedRanks = { ...previousRanks };
                const updatedChanges = { ...previousRankChanges };
                newData.forEach(item => {
                    if (item.userId) {
                        updatedRanks.creators[item.userId] = item.rank;
                        if (item.rankChange) updatedChanges.creators[item.userId] = item.rankChange;
                    }
                });
                localStorage.setItem('leaderboardRanks', JSON.stringify(updatedRanks));
                localStorage.setItem('leaderboardRankChanges', JSON.stringify(updatedChanges));
            } else if (tab === 'raters') {
                res = await getRankerLeaderboard(nextPage, LIMIT);
                newData = processData(res.data, dataState.ratersTableData.length, previousRanks.raters, previousRankChanges.raters);
                setDataState(prev => ({ ...prev, ratersTableData: [...prev.ratersTableData, ...newData] }));

                // Update stored ranks and rank changes for newly loaded data
                const updatedRanks = { ...previousRanks };
                const updatedChanges = { ...previousRankChanges };
                newData.forEach(item => {
                    if (item.userId) {
                        updatedRanks.raters[item.userId] = item.rank;
                        if (item.rankChange) updatedChanges.raters[item.userId] = item.rankChange;
                    }
                });
                localStorage.setItem('leaderboardRanks', JSON.stringify(updatedRanks));
                localStorage.setItem('leaderboardRankChanges', JSON.stringify(updatedChanges));
            } else if (tab === 'tribes') {
                res = await getTribeLeaderboard(nextPage, LIMIT);
                newData = processTribes(res.data, dataState.tribesTableData.length, previousRanks.tribes, previousRankChanges.tribes);
                setDataState(prev => ({ ...prev, tribesTableData: [...prev.tribesTableData, ...newData] }));

                // Update stored ranks and rank changes for newly loaded data
                const updatedRanks = { ...previousRanks };
                const updatedChanges = { ...previousRankChanges };
                newData.forEach(item => {
                    if (item.name) {
                        updatedRanks.tribes[item.name] = item.rank;
                        if (item.rankChange) updatedChanges.tribes[item.name] = item.rankChange;
                    }
                });
                localStorage.setItem('leaderboardRanks', JSON.stringify(updatedRanks));
                localStorage.setItem('leaderboardRankChanges', JSON.stringify(updatedChanges));
            }

            setPagination(prev => ({
                ...prev,
                [tab]: {
                    page: nextPage,
                    hasMore: res.data?.length === LIMIT
                }
            }));

        } catch (err) {
            // Silently handle error
        } finally {
            setLoadingTab(null);
        }
    };



    // Compute the card data for the currently active tab
    const getCardInfo = () => {
        if (!user || !currentUserRankData) return null;

        let rank = null;
        let userPoints = 0;
        let total = 0;
        let top3Points = [];
        let avatar = currentUserRankData.avatar;

        if (activeTab === 'creators') {
            if (!currentUserRankData.creatorPoints) return null;
            rank = currentUserRankData.creatorRank;
            userPoints = currentUserRankData.creatorPoints;
            total = currentUserRankData.totalCreators || 0;
            top3Points = currentUserRankData.top3CreatorPoints || [];
        } else if (activeTab === 'raters') {
            if (!currentUserRankData.rankerPoints) return null;
            rank = currentUserRankData.rankerRank;
            userPoints = currentUserRankData.rankerPoints;
            total = currentUserRankData.totalRankers || 0;
            top3Points = currentUserRankData.top3RankerPoints || [];
        } else if (activeTab === 'tribes') {
            if (!currentUserRankData.tribe) return null;
            rank = currentUserRankData.tribeRank;
            userPoints = currentUserRankData.tribePoints;
            total = currentUserRankData.totalTribes || 0;
            top3Points = currentUserRankData.top3TribePoints || [];
        }

        if (rank === null) return null;

        // Percentile
        const percentile = total > 0 ? Math.max(1, Math.ceil((rank / total) * 100)) : 100;

        // Points to reach target rank (random 1–3)
        const targetIdx = targetTopRank - 1; // 0-based
        const targetPoints = top3Points[targetIdx] || 0;
        const pointsNeeded = Math.max(0, targetPoints - userPoints);
        const isInTop3 = rank <= 3;

        return { rank, percentile, pointsNeeded, targetRank: targetTopRank, isInTop3, avatar };
    };

    const renderCurrentUserCard = () => {
        const info = getCardInfo();
        if (!info) return null;

        const initial = user?.name ? user.name.charAt(0).toUpperCase() : '?';

        return (
            <div className="mb-6 mx-1 sm:mx-0">
                <div className="bg-[#181920] rounded-2xl p-4 md:p-5 flex items-center gap-4 border border-white/5 shadow-2xl">
                    {/* Avatar / Initial badge */}
                    <div className="shrink-0">
                        {info.avatar ? (
                            <div
                                className="size-12 sm:size-14 rounded-lg bg-cover bg-center border-2 border-white/10"
                                style={{ backgroundImage: `url('${info.avatar}')` }}
                            />
                        ) : (
                            <div className="size-12 sm:size-14 rounded-xl bg-[#23242d] border-2 border-white/10 flex items-center justify-center text-lg sm:text-xl font-bold text-white">
                                {initial}
                            </div>
                        )}
                    </div>

                    {/* Text content */}
                    <div className="flex-1 min-w-0">
                        <div className="text-white font-semibold text-[15px] sm:text-[17px] leading-tight">
                            #{info.rank} in this round
                        </div>
                        <div className="text-white/60 text-[12px] sm:text-[13px] mt-1 leading-snug">
                            {info.isInTop3 ? (
                                <>You are in the <span className="text-blue-400 font-medium">top {info.percentile}%</span>. You're in the top 3! 🎉</>
                            ) : (
                                <>You are in the <span className="text-blue-400 font-medium">top {info.percentile}%</span>. only {info.pointsNeeded.toLocaleString()} points to reach <span className="text-white font-medium">#{info.targetRank}</span>!</>
                            )}
                        </div>
                    </div>


                </div>
            </div>
        );
    };

    return (
        <AuthenticatedLayout>
            <Helmet>
                <title>Raceboard | SHOWGRID</title>
                <meta name="description" content="View the SHOWGRID leaderboard for creators, raters, and tribes." />
            </Helmet>
            <div className="max-w-[1000px] mx-auto px-0 sm:px-4 py-10 pb-32 pt-20">
                {/* Header Card */}
                <div className="bg-[#181920] rounded-2xl mx-1 sm:mx-0 p-4 md:p-6 mb-6 flex flex-wrap items-center justify-between gap-4 border border-white/5 shadow-2xl">
                    <h2 className="text-[20px] md:text-3xl font-medium tracking-wide text-[#3b82f6] px-2 leading-none hidden sm:block">Leaderboard</h2>

                    {/* Segmented Control Pill */}
                    <div className="flex bg-[#32323a] p-1.5 rounded-full w-full sm:w-auto overflow-x-auto h-[46px] items-center justify-between sm:justify-start">
                        {[
                            { id: 'creators', label: 'creators', icon: User },
                            { id: 'tribes', label: 'tribes', icon: Users },
                            { id: 'raters', label: 'raters', icon: Star }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 sm:flex-none px-4 md:px-6 h-full rounded-full flex items-center justify-center gap-2 transition-all min-w-[80px] md:min-w-[100px] ${activeTab === tab.id
                                    ? "bg-gradient-to-r from-[#70b1ff] to-[#59d5e0] shadow-[0_0_15px_rgba(112,177,255,0.3)] text-white"
                                    : "text-white/70 hover:text-white"
                                    }`}
                            >
                                <tab.icon size={16} className="shrink-0 hidden sm:block" />
                                <span className="text-[13px] md:text-sm font-semibold capitalize">
                                    {tab.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {renderCurrentUserCard()}

                {/* Content switching based on tab */}
                {activeTab === 'creators' && (
                    <LeaderboardTable
                        ref={creatorsTableRef}
                        data={dataState.creatorsTableData}
                        columns={creatorsColumns}
                        hasMore={pagination.creators.hasMore}
                        onLoadMore={() => handleLoadMore('creators')}
                        isLoading={loadingTab === 'creators'}
                    />
                )}

                {activeTab === 'tribes' && (
                    <LeaderboardTable
                        ref={tribesTableRef}
                        data={dataState.tribesTableData}
                        columns={tribesColumns}
                        hasMore={pagination.tribes.hasMore}
                        onLoadMore={() => handleLoadMore('tribes')}
                        isLoading={loadingTab === 'tribes'}
                    />
                )}

                {activeTab === 'raters' && (
                    <LeaderboardTable
                        ref={ratersTableRef}
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

