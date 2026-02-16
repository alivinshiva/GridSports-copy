import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";

export default function WeekendPage() {
    const { weekendId } = useParams();
    const [weekend, setWeekend] = useState(null);
    const [races, setRaces] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchweekend = async () => {
            try {
                const response = await fetch(`http://localhost:7000/api/v1/public/weekend/${weekendId}`);
                const data = await response.json();
                if (data.success) {
                    setWeekend(data.data.weekend);
                    setRaces(data.data.races);
                }
            } catch (error) {
                console.error("Error fetching weekend details", error);
            } finally {
                setLoading(false);
            }
        };
        fetchweekend();
    }, [weekendId]);

    if (loading) return <AuthenticatedLayout><div className="p-10 text-center">Loading...</div></AuthenticatedLayout>;
    if (!weekend) return <AuthenticatedLayout><div className="p-10 text-center">Weekend not found</div></AuthenticatedLayout>;

    return (
        <AuthenticatedLayout>
            <div className="flex flex-col items-center py-8 px-4">
                {/* Hero Section */}
                <div className="w-full max-w-4xl rounded-2xl overflow-hidden relative h-64 md:h-80 mb-8">
                    <img
                        src={weekend.image}
                        alt={weekend.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                    <div className="absolute bottom-6 left-6 text-white">
                        <h1 className="text-3xl md:text-5xl font-black">{weekend.name}</h1>
                        <p className="text-lg md:text-xl font-medium text-gray-300">{weekend.round} • {new Date(weekend.startDate).toLocaleDateString()} - {new Date(weekend.endDate).toLocaleDateString()}</p>
                    </div>
                </div>

                {/* Races List */}
                <div className="w-full max-w-4xl">
                    <h2 className="text-2xl font-bold mb-6 text-[#1c140d] dark:text-white">Races / Sessions</h2>
                    <div className="grid gap-4">
                        {races.map((race) => (
                            <Link key={race._id} to={`/race/${race._id}`} className="block">
                                <div className="bg-[#f4ede7] dark:bg-[#1e1e1e] rounded-xl p-6 flex flex-col md:flex-row items-center justify-between hover:bg-[#e8dbce] dark:hover:bg-[#2a2a2a] transition-colors border border-transparent dark:border-gray-800">
                                    <div className="flex items-center gap-4 mb-4 md:mb-0">
                                        <div className="h-16 w-16 bg-gray-300 rounded-lg overflow-hidden shrink-0">
                                            <img src={race.image} alt={race.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-[#1c140d] dark:text-white">{race.name}</h3>
                                            <p className="text-sm text-[#9c7349] dark:text-gray-400">{race.round}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 text-right">
                                        <div className="text-sm text-[#1c140d] dark:text-gray-300">
                                            <span className="font-bold">Race:</span> {new Date(race.dates.race).toLocaleString()}
                                        </div>
                                        {/* You can add practice/qualifying dates here if needed */}
                                        <div className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg text-center mt-2 md:mt-0">
                                            Enter Race
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                        {races.length === 0 && (
                            <p className="text-gray-500 text-center py-10">No races scheduled for this weekend yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
