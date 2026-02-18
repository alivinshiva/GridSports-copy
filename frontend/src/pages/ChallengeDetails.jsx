import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { getChallengeById } from "@/services/challengeService";

export default function ChallengeDetails() {
    const { challengeId } = useParams();
    const [challenge, setChallenge] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchChallenge = async () => {
            try {
                const response = await getChallengeById(challengeId);
                if (response.success) {
                    setChallenge(response.data);
                }
            } catch (error) {
                console.error("Error fetching challenge details", error);
            } finally {
                setLoading(false);
            }
        };
        fetchChallenge();
    }, [challengeId]);

    if (loading) return <AuthenticatedLayout><div className="p-10 text-center">Loading...</div></AuthenticatedLayout>;
    if (!challenge) return <AuthenticatedLayout><div className="p-10 text-center">Challenge not found</div></AuthenticatedLayout>;

    return (
        <AuthenticatedLayout>
            <div className="flex flex-1 justify-center py-5">
                <div className="layout-content-container flex flex-col max-w-[1024px] flex-1 px-4 md:px-10">

                    {/* Header / Hero */}
                    <div className="flex flex-wrap justify-between items-end gap-3 py-6">
                        <div className="flex min-w-72 flex-col gap-2">
                            <h1 className="text-[#1c140d] dark:text-[#fcfaf8] text-4xl font-black leading-tight tracking-[-0.033em] font-display">
                                {challenge.name}
                            </h1>
                            <div className="flex items-center gap-2 text-red-600 font-bold">
                                <span className="material-symbols-outlined text-sm">schedule</span>
                                <p className="text-base font-medium leading-normal">
                                    Ends: {new Date(challenge.endAt).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Full Challenge Card with Actions */}
                    <div className="flex flex-col bg-white dark:bg-[#2d2218] rounded-xl overflow-hidden shadow-md border border-[#e8dbce] dark:border-[#3d2e21] max-w-3xl mx-auto w-full">
                        <div
                            className="w-full bg-center bg-no-repeat aspect-video bg-cover"
                            style={{ backgroundImage: `url(${challenge.imageUrl})` }}
                        ></div>
                        <div className="p-6 flex flex-col gap-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-[#1c140d] dark:text-[#fcfaf8] text-2xl font-bold font-display">{challenge.name}</h3>
                                    <p className="text-[#9c7349] dark:text-[#b08d6a] text-base mt-2">{challenge.description}</p>
                                </div>
                                <span className={`text-sm font-bold px-3 py-1.5 rounded uppercase ${challenge.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-[#f4ede7] dark:bg-[#3d2e21] text-[#9c7349]'
                                    }`}>
                                    {challenge.status || 'UPCOMING'}
                                </span>
                            </div>

                            {/* Rules / Instructions */}
                            <div className="bg-[#f8f7f5] dark:bg-[#221910]/50 p-4 rounded-lg border-l-4 border-red-600">
                                <p className="text-sm font-bold text-red-600 uppercase tracking-wider mb-2">Instructions</p>
                                <div className="text-sm text-[#1c140d] dark:text-[#fcfaf8] space-y-1">
                                    {challenge.rules && challenge.rules.length > 0 ? (
                                        challenge.rules.map((rule, index) => (
                                            <p key={index}>• {rule}</p>
                                        ))
                                    ) : (
                                        <p>Follow the challenge guidelines to participate.</p>
                                    )}
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="flex items-center gap-6 py-4 border-y border-[#e8dbce]/50 dark:border-[#3d2e21]/50">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-red-600 text-xl">groups</span>
                                    <span className="text-base font-semibold">1.2k entries</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-red-600 text-xl">star</span>
                                    <span className="text-base font-semibold">8.4 Avg Score</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 mt-2">
                                <Link to={`/upload/${challenge._id}`} className="flex-1 bg-red-600 text-white font-bold py-3.5 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-red-600/20">
                                    <span className="material-symbols-outlined text-2xl">upload</span>
                                    Upload Entry
                                </Link>
                                <Link to={`/challenge/entries`} className="flex-1 bg-[#f4ede7] dark:bg-[#3d2e21] text-[#1c140d] dark:text-[#fcfaf8] font-bold py-3.5 rounded-xl hover:bg-red-600/10 transition-colors flex items-center justify-center gap-2 border border-transparent hover:border-red-600/20">
                                    <span className="material-symbols-outlined text-2xl">visibility</span>
                                    View entries
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}

