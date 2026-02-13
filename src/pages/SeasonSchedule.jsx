import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { RaceCard } from "@/components/schedule/RaceCard";
import { ScheduleFilters } from "@/components/schedule/ScheduleFilters";
import { ChevronDown } from "lucide-react";

// Mock data matching the design
const races = [
    {
        id: "italy-monza",
        status: "live",
        round: "Round 12",
        country: "Italy",
        countryCode: "ITA",
        title: "Grid Race – Italy",
        date: "October 12-14",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCes11sJmg6uRo-GZ7WnYWkHS6itIrhZ5T2GoxcwMX0qFt5UFRJcK_liF8gnkZIAEFtHgc-KhK5s9HtBgqWJDd_B7mFn8MxVZs8jUyLzNgI3QMTrnTrhOwVgNS9I5UDTLuIM8KaIvtkN4WhJGHbRwrlI61iAh8cHbf6g7Nm6MKUMaeWsTMg6TXWiqyBsxFdlU5DtkOiee2Ja-1NiBbR39TOFBMKmi2OPf8A7t11Ep_Kl9iNSPZxI1dlyEZmG4Lky-EG8BrBwVhCNwg",
    },
    {
        id: "japan-suzuka",
        status: "upcoming",
        round: "Round 13",
        country: "Japan",
        countryCode: "JPN",
        title: "Grid Race – Japan",
        date: "October 26-28",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAUklikzMSZsRPNVOTm0c5dn1x4zWiO6B7tMx6okL3monCFW5fP_nWB6U1q_DSTbFz547ZmeqSXc0RUOcK7bsUhQicPb597UoU_W9iaFjAtvff5veRbO4I9lUK_s5FeK4M0Z6GRU4CcthF2PiYeUYCJHhIDPMR2J_JcEAmjI4rLBypQtbIQFCF9OoB1xRyBpnlowH5kQxkUGsKA-KReqWtPx_FoQGCsnjlhSUBN87Blv0uv4f_7N_EUn8ON9x8GskJCT897HF25G_4",
    },
    {
        id: "monaco",
        status: "finished",
        round: "Round 11",
        country: "Monaco",
        countryCode: "MCO",
        title: "Grid Race – Monaco",
        date: "September 21-23",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC4OynbEwSHq8_GwSnk5I0KTDisqOdij8GrNcByq_SUG5wcXcH67_MM3SO-VFb6upkDEgoFEXtGS_AkCwut6aIXrFtIbKx0O-WNuGgLyHTlp6OoiB1gXkKTGxi_P6z6zJI-JeuF5MFYUpty2ziedCn6H1YOdsUb7Ngo0-3v_D0GwohKIDFqaGUPuINmKxS0oAoAVId8BX7ygbySYH5EMJpk54DkCiHg0H3SzfzZ6_cPnhcW08puJS7Z9fIO7xPLh0KbtXcDsLmYxns",
        winner: "Leo Hamilton"
    }
];

export default function SeasonSchedule() {
    const navigate = useNavigate();
    const [filter, setFilter] = useState("all");

    const filteredRaces = races.filter(race => filter === "all" || race.status === filter);

    return (
        <AuthenticatedLayout>
            <div className="flex flex-1 justify-center py-8 bg-background-light dark:bg-background-dark">
                <div className="flex flex-col max-w-[960px] flex-1 px-4 w-full">
                    {/* Page Heading */}
                    <div className="flex flex-wrap justify-between gap-3 p-4">
                        <div className="flex min-w-72 flex-col gap-3">
                            <h1 className="text-4xl font-black leading-tight tracking-[-0.033em] text-gray-900 dark:text-white">Season 1</h1>
                            <p className="text-[#9c7349] dark:text-[#cbb094] text-base font-normal leading-normal">Complete race overview and league schedule</p>
                        </div>
                    </div>

                    {/* Filter Chips */}
                    <ScheduleFilters filter={filter} setFilter={setFilter} />

                    {/* Race List Container */}
                    <div className="flex flex-col gap-6 p-4">
                        {filteredRaces.map((race) => (
                            <RaceCard
                                key={race.id}
                                race={race}
                                onClick={() => {
                                    if (race.status === "live") {
                                        navigate(`/race/${race.id}`);
                                    }
                                }}
                            />
                        ))}
                    </div>

                    {/* Load More / Pagination */}
                    <div className="flex justify-center p-8">
                        <button className="flex items-center gap-2 px-8 py-3 bg-white dark:bg-[#2d2116] border border-[#f4ede7] dark:border-[#3d2e1f] rounded-xl text-sm font-bold hover:bg-background-light dark:hover:bg-background-dark transition-all text-gray-900 dark:text-white">
                            <span>View All Season Rounds</span>
                            <ChevronDown size={20} />
                        </button>
                    </div>

                    {/* Footer */}
                    <footer className="border-t border-[#f4ede7] dark:border-[#3d2e1f] py-10 px-4 mt-8">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-6 max-w-[960px] mx-auto text-[#9c7349] opacity-80">
                            <div className="flex items-center gap-2">
                                <span className="text-lg font-bold">© 2024 World Race Fan League</span>
                            </div>
                            <div className="flex gap-8">
                                <a className="text-xs font-medium hover:text-primary transition-colors" href="#">Privacy Policy</a>
                                <a className="text-xs font-medium hover:text-primary transition-colors" href="#">Terms of Service</a>
                                <a className="text-xs font-medium hover:text-primary transition-colors" href="#">Sponsors</a>
                                <a className="text-xs font-medium hover:text-primary transition-colors" href="#">Contact</a>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
