import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ITEMS_PER_PAGE = 25;
const INITIAL_LIMIT = 24;

const LeaderboardTable = ({ data, columns, enablePagination = false }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [activeSubTab, setActiveSubTab] = useState('Global Creators');

    const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);

    let displayData = data;
    if (enablePagination) {
        if (!isExpanded) {
            displayData = data.slice(0, INITIAL_LIMIT);
        } else {
            const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
            const endIndex = startIndex + ITEMS_PER_PAGE;
            displayData = data.slice(startIndex, endIndex);
        }
    }

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage((prev) => prev - 1);
    };

    return (
        <div className="bg-[#101117] rounded-xl border border-white/5 overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b border-white/5 bg-[#101117]">
                            {columns.map((col, index) => (
                                <th
                                    key={index}
                                    className={`px-4 sm:px-6 py-5 text-xs font-semibold uppercase tracking-wider text-white/80 ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}`}
                                >
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {displayData.map((row, rowIndex) => {
                            // Calculate global rank index if pagination is active
                            const globalIndex = enablePagination && isExpanded
                                ? (currentPage - 1) * ITEMS_PER_PAGE + rowIndex
                                : rowIndex;

                            // Dynamic highlighting for the logged-in user's row
                            const isHighlighted = row.isHighlighted === true;
                            const rowBg = isHighlighted
                                ? "bg-[#101117]"
                                : "hover:bg-white/[0.02] transition-colors";

                            return (
                                <tr key={rowIndex} className={`${rowBg} group relative`}>
                                    {columns.map((col, colIndex) => (
                                        <td
                                            key={`${rowIndex}-${colIndex}`}
                                            className={`px-4 sm:px-6 py-4 whitespace-nowrap ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}`}
                                        >
                                            {col.render ? col.render({ ...row, isHighlighted }) : (
                                                <span className={`${isHighlighted ? 'text-black font-bold' : 'text-white/90 font-medium'}`}>{row[col.key]}</span>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {enablePagination && !isExpanded && data.length >= INITIAL_LIMIT && (
                <div className="py-6 flex justify-center border-t border-white/5 bg-[#101117]">
                    <button
                        onClick={() => setIsExpanded(true)}
                        className="w-48 h-10 rounded-full bg-white transition-opacity shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:opacity-90"
                    ></button>
                </div>
            )}

            {enablePagination && isExpanded && totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-white/5 bg-[#101117]">
                    <span className="text-sm font-medium text-white/50">
                        Page {currentPage} of {totalPages}
                    </span>
                    <div className="flex gap-2">
                        <button
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg border border-white/10 text-white/70 hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-lg border border-white/10 text-white/70 hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LeaderboardTable;
