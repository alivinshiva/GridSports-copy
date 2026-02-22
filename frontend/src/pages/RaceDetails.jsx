import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { ChallengeCard } from "@/components/race/ChallengeCard";
import { Clock, Lock } from "lucide-react";

export default function RaceDetails() {
    const { raceId } = useParams();
    const [race, setRace] = useState(null);
    const [challenges, setChallenges] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRaceDetails = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_MAIN_API_URL}/api/v1/public/race/${raceId}`);
                const data = await response.json();
                if (data.success) {
                    setRace(data.data.race);
                    setChallenges(data.data.challenges);
                }
            } catch (error) {
                console.error("Error fetching race details", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRaceDetails();
    }, [raceId]);

    if (loading) return <AuthenticatedLayout><div className="p-10 text-center">Loading...</div></AuthenticatedLayout>;
    if (!race) return <AuthenticatedLayout><div className="p-10 text-center">Race not found</div></AuthenticatedLayout>;

    return (
        <AuthenticatedLayout>
            <div className="flex flex-1 justify-center py-5">
                <div className="layout-content-container flex flex-col max-w-[1024px] flex-1 px-4 md:px-10">

                    {/* PageHeading Component */}
                    <div className="flex flex-wrap justify-between items-end gap-3 py-6">
                        <div className="flex min-w-72 flex-col gap-2">
                            <h1 className="text-[#1c140d] dark:text-[#fcfaf8] text-4xl font-black leading-tight tracking-[-0.033em] font-display">{race.name}</h1>
                            <div className="flex items-center gap-2 text-primary font-bold">
                                <Clock size={20} />
                                <p className="text-base font-medium leading-normal">Race Date: {new Date(race.dates.race).toLocaleString()}</p>
                            </div>
                        </div>
                        {/* <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-5 bg-[#f4ede7] dark:bg-[#3d2e21] text-[#1c140d] dark:text-[#fcfaf8] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/10 transition-colors">
                            <span className="truncate">View Rules</span>
                        </button> */}
                    </div>

                    {/* Tabs Component */}
                    <div className="pb-3">
                        <div className="flex border-b border-[#e8dbce] dark:border-[#3d2e21] px-0 gap-8">
                            <a className="flex flex-col items-center justify-center border-b-[3px] border-b-primary text-[#1c140d] dark:text-[#fcfaf8] pb-[13px] pt-4" href="#">
                                <p className="text-sm font-bold leading-normal tracking-[0.015em]">Challenges</p>
                            </a>
                        </div>
                    </div>

                    {/* Challenge Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
                        {challenges.map((challenge) => (
                            <ChallengeCard key={challenge._id} challenge={challenge} />
                        ))}

                        {challenges.length === 0 && (
                            <p className="text-gray-500 text-center col-span-2">No challenges available for this race yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
