import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { ChallengeCard } from "@/components/race/ChallengeCard";
import { Clock, Lock } from "lucide-react";

// Mock data based on provided HTML
const challenges = [
    {
        id: 1,
        title: "Race Start Reaction",
        description: "Record your reaction to the five lights going out.",
        status: "live",
        criteria: "Timing accuracy, energy levels, and overall camera setup quality.",
        entries: "1.2k",
        avgScore: "8.4",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAgEa_ktwfycgxIQ07j-8dLOEzXD6GLnATTBWYUrYwDu78iR8i_k05vgCxT0oGUAkvybuXiJXradw3oPNh4StxUAAQ5chLZD99ze9FWAoyuKJx68NF62HpU2Db89v0sDo1aMpeG2lrxguwjcKXNX0pk6pSX5U0v-h5EeKg7ulXZucWrOFIJ1_NpFHmrLIqdL2c_SDqk7fUjH1475Ybwhadv1rv_5wFH0GoIOwUvbm-W7EJyBsWGg0JwAO-SMNlqUj5ZRKqCbnnaJ38",
        imageAlt: "Race cars lined up at the starting grid of a grand prix"
    },
    {
        id: 2,
        title: "Pit Stop Prediction",
        description: "Predict the fastest pit stop time of the race.",
        status: "Pre-Race",
        criteria: "Accuracy of the prediction and logical reasoning provided.",
        entries: "850",
        avgScore: "7.2",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDUHtE_WHjnUQZukhyPBGHTQx9LDpHyck8X4zENvwVnTnTbEVFPX5Dux7yGvFSCxz2gLtawSNsRIEurVp3BXt7pGBltuoQvutT3FZv_rIPPNtiIlCM0zvppa4Ie39ZpWGwdgW8ylLS02vqcg93XGDKP3FYaNPqxVSrSvhnMI_ePW_iVlp7Qbx2AMB_gT8FolWKHAkHDzFhsL2S5zE22TAmmARzshgMMYhtia0eq8_S4tbGFk8irqF6so8tIK3j9H-d-RDNPJmlL4YI",
        imageAlt: "F1 pit crew performing a lightning fast tire change"
    },
    {
        id: 3,
        title: "Podium Guess",
        description: "Who takes the top 3 spots? Guess correctly!",
        status: "Pre-Race",
        criteria: "Deep knowledge of driver form and circuit characteristics.",
        entries: "2.4k",
        avgScore: "9.1",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDeZ9Dk8YTCIYkg-peGYuFVki9MJjMuEMg-Nxsxv69ukOwfuhqimtgGQObcJ17FNkD-J2tZyh1KVpjnVnTGPg_3irCPJPepqgn7iJ9Y73BTz-reRfoRjzzWa1cQ1SHpYf-obBpf8uRyoZ5V7ksabVGp2fITnhIxokb68Ho3iRIBuOO3HU7yqP2I7CzEteod7bthF9TpUduyNQBFw6dbX6jnTGcAf4f1jrl_15by1URK7qgfgRW6sDyr3bceqxsS_wdvDqQ3UtygW8Q",
        imageAlt: "Trophy and champagne on an F1 podium"
    }
];

export default function RaceDetails() {
    return (
        <AuthenticatedLayout>
            <div className="flex flex-1 justify-center py-5">
                <div className="layout-content-container flex flex-col max-w-[1024px] flex-1 px-4 md:px-10">

                    {/* PageHeading Component */}
                    <div className="flex flex-wrap justify-between items-end gap-3 py-6">
                        <div className="flex min-w-72 flex-col gap-2">
                            <h1 className="text-[#1c140d] dark:text-[#fcfaf8] text-4xl font-black leading-tight tracking-[-0.033em] font-display">Grid Race - Bahrain</h1>
                            <div className="flex items-center gap-2 text-primary font-bold">
                                <Clock size={20} />
                                <p className="text-base font-medium leading-normal">Raceboard locks in 12h:45m</p>
                            </div>
                        </div>
                        <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-5 bg-[#f4ede7] dark:bg-[#3d2e21] text-[#1c140d] dark:text-[#fcfaf8] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/10 transition-colors">
                            <span className="truncate">View Rules</span>
                        </button>
                    </div>

                    {/* Tabs Component */}
                    <div className="pb-3">
                        <div className="flex border-b border-[#e8dbce] dark:border-[#3d2e21] px-0 gap-8">
                            <a className="flex flex-col items-center justify-center border-b-[3px] border-b-primary text-[#1c140d] dark:text-[#fcfaf8] pb-[13px] pt-4" href="#">
                                <p className="text-sm font-bold leading-normal tracking-[0.015em]">Challenges</p>
                            </a>
                            <a className="flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-[#9c7349] dark:text-[#b08d6a] pb-[13px] pt-4 hover:text-primary transition-colors" href="#">
                                <p className="text-sm font-bold leading-normal tracking-[0.015em]">Raceboard</p>
                            </a>
                            <a className="flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-[#9c7349] dark:text-[#b08d6a] pb-[13px] pt-4 hover:text-primary transition-colors" href="#">
                                <p className="text-sm font-bold leading-normal tracking-[0.015em]">Tribes</p>
                            </a>
                        </div>
                    </div>

                    {/* Chips / Filter Component */}
                    <div className="flex gap-3 py-6 flex-wrap">
                        <div className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-primary text-white px-5 cursor-pointer">
                            <p className="text-sm font-semibold leading-normal">All</p>
                        </div>
                        <div className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-[#f4ede7] dark:bg-[#3d2e21] px-5 text-[#1c140d] dark:text-[#fcfaf8] cursor-pointer hover:bg-primary/20 transition-colors">
                            <p className="text-sm font-medium leading-normal">Pre-Race</p>
                        </div>
                        <div className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-[#f4ede7] dark:bg-[#3d2e21] px-5 text-[#1c140d] dark:text-[#fcfaf8] cursor-pointer hover:bg-primary/20 transition-colors">
                            <p className="text-sm font-medium leading-normal">Live</p>
                        </div>
                    </div>

                    {/* Challenge Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
                        {challenges.map((challenge) => (
                            <ChallengeCard key={challenge.id} challenge={challenge} />
                        ))}

                        {/* Empty State / Upcoming Challenge */}
                        <div className="flex flex-col justify-center items-center p-8 border-2 border-dashed border-[#e8dbce] dark:border-[#3d2e21] rounded-xl text-center gap-4 opacity-75">
                            <Lock size={48} className="text-[#9c7349]" />
                            <div>
                                <h3 className="text-lg font-bold">More challenges unlocking soon</h3>
                                <p className="text-sm text-[#9c7349]">New challenges will be available during the Qualifying session.</p>
                            </div>
                            <button className="text-primary text-sm font-bold hover:underline">Get notified</button>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
