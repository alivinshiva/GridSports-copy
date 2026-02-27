import React, { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

const LeaderboardTable = forwardRef(({ data, columns, hasMore, onLoadMore, isLoading, hideHeaders = false }, ref) => {
    return (
        <div ref={ref} className="bg-[#101117] rounded-xl mx-1 sm:mx-0 border border-white/5 shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden w-full">
            <style>{`
                @keyframes highlightPulse {
                    0% { background-color: rgba(59,130,246,0.3); }
                    50% { background-color: rgba(59,130,246,0.15); }
                    100% { background-color: rgba(59,130,246,0.3); }
                }
                .animate-highlight-pulse {
                    animation: highlightPulse 0.8s ease-in-out 3;
                }
            `}</style>
            <div className="max-h-[60vh] overflow-y-auto overflow-x-hidden relative [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full w-full">
                <table className="w-full border-collapse">
                    {!hideHeaders && (
                        <thead className="sticky top-0 z-10 bg-[#101117] shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                            <tr className="border-b border-white/5">
                                {columns.map((col, index) => (
                                    <th
                                        key={index}
                                        className={`px-2 sm:px-6 py-3 sm:py-5 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-white/80 ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'} ${col.hideOnMobile ? 'hidden sm:table-cell' : ''}`}
                                    >
                                        {col.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                    )}
                    <tbody className="divide-y divide-white/5">
                        {data.map((row, rowIndex) => {
                            const isHighlighted = row.isHighlighted === true;
                            const rowBg = isHighlighted
                                ? "bg-white/5 hover:bg-white/[0.02] transition-colors"
                                : "hover:bg-white/[0.02] transition-colors";

                            return (
                                <tr
                                    key={rowIndex}
                                    className={`${rowBg} group `}
                                    {...(isHighlighted ? { 'data-user-row': 'true' } : {})}
                                >
                                    {columns.map((col, colIndex) => (
                                        <td
                                            key={`${rowIndex}-${colIndex}`}
                                            className={`px-2 sm:px-6 py-3 sm:py-4 whitespace-nowrap ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'} ${col.hideOnMobile ? 'hidden sm:table-cell' : ''}`}
                                        >
                                            {col.render ? col.render({ ...row, isHighlighted }) : (
                                                <span className={`${isHighlighted ? 'text-white font-bold' : 'text-white font-medium'}`}>{row[col.key]}</span>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {data.length === 0 && !isLoading && (
                    <div className="py-8 text-center text-white/50 text-sm">
                        No data available
                    </div>
                )}
            </div>

            {hasMore && data.length > 0 && (
                <div className="py-4 flex justify-center border-t border-white/5 bg-[#101117]">
                    <button
                        onClick={onLoadMore}
                        disabled={isLoading}
                        className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white text-sm font-medium flex items-center justify-center min-w-[120px]"
                    >
                        {isLoading ? (
                            <Loader2 size={16} className="animate-spin text-white/70" />
                        ) : (
                            "Load More"
                        )}
                    </button>
                </div>
            )}
        </div>
    );
});

LeaderboardTable.displayName = 'LeaderboardTable';

export default LeaderboardTable;

