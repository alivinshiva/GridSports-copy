import { Upload, Eye, Users, Star } from "lucide-react";

export function ChallengeCard({ challenge }) {
    const isLive = challenge.status === "live";
    const statusColor = isLive ? "bg-green-100 text-green-700" : "bg-[#f4ede7] dark:bg-[#3d2e21] text-[#9c7349]";

    return (
        <div className="flex flex-col bg-white dark:bg-[#2d2218] rounded-xl overflow-hidden shadow-sm border border-[#e8dbce] dark:border-[#3d2e21] group hover:border-primary transition-colors">
            <div className="w-full bg-center bg-no-repeat aspect-video bg-cover" data-alt={challenge.imageAlt} style={{ backgroundImage: `url('${challenge.imageUrl}')` }}></div>
            <div className="p-5 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-[#1c140d] dark:text-[#fcfaf8] text-xl font-bold font-display">{challenge.title}</h3>
                        <p className="text-[#9c7349] dark:text-[#b08d6a] text-sm mt-1">{challenge.description}</p>
                    </div>
                    <span className={`${statusColor} text-xs font-bold px-2 py-1 rounded uppercase`}>{challenge.status}</span>
                </div>

                <div className="bg-background-light dark:bg-background-dark/50 p-3 rounded-lg border-l-4 border-primary">
                    <p className="text-xs font-bold text-primary uppercase tracking-wider">What raters judge</p>
                    <p className="text-sm text-[#1c140d] dark:text-[#fcfaf8] mt-1">{challenge.criteria}</p>
                </div>

                <div className="flex items-center gap-4 py-2 border-y border-[#e8dbce]/50 dark:border-[#3d2e21]/50">
                    <div className="flex items-center gap-1.5">
                        <Users className="text-primary size-5" />
                        <span className="text-sm font-semibold">{challenge.entries} entries</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Star className="text-primary size-5" />
                        <span className="text-sm font-semibold">{challenge.avgScore} Avg Score</span>
                    </div>
                </div>

                <div className="flex gap-3 mt-2">
                    <button
                        onClick={() => window.location.href = `/upload/${challenge.id || 'default'}`}
                        className="flex-1 bg-primary text-white font-bold py-2.5 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                    >
                        <Upload size={20} />
                        Upload
                    </button>
                    <button className="flex-1 bg-[#f4ede7] dark:bg-[#3d2e21] text-[#1c140d] dark:text-[#fcfaf8] font-bold py-2.5 rounded-xl hover:bg-primary/10 transition-colors flex items-center justify-center gap-2">
                        <Eye size={20} />
                        View entries
                    </button>
                </div>
            </div>
        </div>
    );
}
