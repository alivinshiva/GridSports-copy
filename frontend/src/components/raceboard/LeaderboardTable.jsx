import React from 'react';

const LeaderboardTable = ({ data, columns }) => {
    return (
        <div className="bg-white dark:bg-[#1a130c] rounded-xl border border-[#e8dbce] dark:border-[#3d2d1e] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-background-light dark:bg-[#2d2116] border-b border-[#e8dbce] dark:border-[#3d2d1e]">
                            {columns.map((col, index) => (
                                <th
                                    key={index}
                                    className={`px-6 py-4 text-xs font-black uppercase tracking-widest opacity-60 text-slate-700 dark:text-[#c5a17e] ${col.align === 'right' ? 'text-right' : 'text-left'}`}
                                >
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e8dbce] dark:divide-[#3d2d1e]">
                        {data.map((row, rowIndex) => (
                            <tr key={rowIndex} className="hover:bg-primary/5 transition-colors group">
                                {columns.map((col, colIndex) => (
                                    <td
                                        key={`${rowIndex}-${colIndex}`}
                                        className={`px-6 py-5 ${col.align === 'right' ? 'text-right' : 'text-left'}`}
                                    >
                                        {col.render ? col.render(row) : (
                                            <span className="text-slate-900 dark:text-white font-medium">{row[col.key]}</span>
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button className="w-full py-4 text-sm font-bold text-[#9c7349] dark:text-[#c5a17e] hover:bg-background-light dark:hover:bg-[#2d2116] transition-colors border-t border-[#e8dbce] dark:border-[#3d2d1e] uppercase tracking-wider">
                View Full Leaderboard
            </button>
        </div>
    );
};

export default LeaderboardTable;
