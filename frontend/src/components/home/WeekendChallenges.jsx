import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export function WeekendChallenges() {
    const [weekend, setWeekend] = useState(null);
    const [challenges, setChallenges] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActiveWeekend = async () => {
            try {
                const response = await fetch("http://localhost:7000/api/v1/public/active-weekend");
                const data = await response.json();
                if (data.success && data.data) {
                    setWeekend(data.data.weekend);
                    setChallenges(data.data.challenges);
                }
            } catch (error) {
                console.error("Error fetching active weekend", error);
            } finally {
                setLoading(false);
            }
        };
        fetchActiveWeekend();
    }, []);

    // Placeholder images for dynamic challenges
    const placeholders = [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCRP_JgkIkd25zqf55EJc_STNvVCRpJ7cNffMPisSlyt4X3_ZRXYnbIt5Y0ZyfHU_0oho_YYhysdTQdK-ahKLcktfYy-oYOg-D2Wti_7L3zen7gL--SIv02M07zZrNmz2L6rfgqJt5BxaL24sjjcbObt12MYwZrjRQiVSmBNpcPIMMFpDhzwADDudMsyNGsUn8s95RpPCHcaBpo3I-g3pExy_quG9rEZjBslB3QZj0D4UhkudFzdhtklNyyFBXcv7YbRI96d4ajQR4",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAA6zzbgNPPeJqdIDXtemao6L7tj7oWxON_3SzpR8GTF1JyOBabn3eoRHWNyF3J-cHv6p6796LAOF1nzdkvGoCPblTNleKW7citVPj1ypUTBs_6LC6wZfB5KeJn9n5XOvaYLF6bzrjIC3m_YiZWcvNifMkGmUDSFOY3DrATPwVLUpRYLTvLi_iv9gpyzujWlUxjws65IdnEFn7Z81Wsp9y7GSWqycmWEghSa_Dj9iq6KTAlasKm3EQR9qWThKOozJ2fJa0UCNWmby8",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBiji8XtXzF1xea1xxA6CuEKdMiyGhyJd6LnqhhTGUbyFlAnY0Yzf9DursbofOKLKJAC1LL9BhwUwJWZeDS-lKRI8EK1u2-V8seyz2_MOADhodKCvYg08f3Z6REfuUFcmePltC9kb8TXsY6IxtarMnpK2gR5_rJnk5H-AAtrUzduGPYfaLn4kU1cOndZp1X-3oU31bgU8W3TCTO8SoqrvrSCVnR6L-gpaAnitFi-hhD0mawOnCeYTa2Cj6pXB8DwCpQoFh3VyIvGjw",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDE2tVsVJx1IShjrR30icGjIejcebFE45vAOkFvP8b121hPduAMkNZygFBHmzmEIHoFGuapmbx53nlSxQv_zrz92kl2VClLVtPZxFgbWyhE_H5JvLeEvOSdMf5BkzAVbZ4AtbZ8vDZWWBsnYYHq1rYdNrL0qjarIv3lRNjO8K9BY-lYbei-ktQ_0narS205Eymp203kPDmCz3yzo3wft0mfd1M7FDdOO97O90uP03xarsVjr7c63hhwxqEupRQhywDm5jyLZXTjKw4",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuA0wr3nrNK0FvBjx8KLvlZSoNJpJS9akby0Tf7PDWKRfPwYJkEEyGuKCMtgmHrtlRMaXXjwTWhTcZfD_PS-KCw9xAs7c7zMAZiUIqKsErusWOi_Ls7nvyaQIgAioe-_SFyfYgCOGETUrv_JGHRp1qZFQjrUYdiLv982lVd4EfdvFZm7qRRakh01QlE4c91Ip8JLZlATq_wYkFYzvn_VYQzJShp0lgoO2MRxGQFVeEkBXBQdkqxUrZqcVwmU8Duz1rDw0QA39zYDR9k"
    ];

    if (loading) return <div>Loading challenges...</div>;
    // Show nothing if no weekend data, or show fallback? 
    // Ideally we should have a fallback state or empty state.
    if (!weekend && challenges.length === 0) return null;

    const displayWeekend = weekend || { name: "Upcoming Weekend", round: "Coming Soon" };

    return (
        <section className="mb-10">
            <div className="relative rounded-2xl overflow-hidden mb-6 h-48 sm:h-64">
                <img
                    src={weekend?.image || placeholders[0]}
                    alt={displayWeekend.name}
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6">
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-1">{displayWeekend.name}</h2>
                    <p className="text-sm sm:text-base text-gray-300 font-medium mb-3">{displayWeekend.round}</p>
                    {weekend && (
                        <Link to={`/weekend/${weekend._id}`} className="inline-block px-4 py-2 bg-red-600 text-white font-bold rounded-lg text-sm hover:bg-red-700 transition-colors">
                            Enter Weekend
                        </Link>
                    )}
                </div>
            </div>

            <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="text-xl font-bold">Latest Challenges</h3>
                {weekend && (
                    <Link to={`/weekend/${weekend._id}`} className="text-primary font-bold text-sm hover:underline">
                        View Full Schedule
                    </Link>
                )}
            </div>

            <div className="flex overflow-x-auto gap-4 no-scrollbar pb-4 -mx-2 px-2">
                {challenges.map((challenge, index) => (
                    <Link key={challenge._id} to={`/upload/${challenge.challengeId}`} className="flex-shrink-0 w-48 group cursor-pointer">
                        <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-3 bg-gray-800">
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                                style={{ backgroundImage: `url('${challenge.image || placeholders[index % placeholders.length]}')` }}
                            ></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                            {index === 0 && (
                                <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white text-xs font-bold bg-primary px-2 py-1 rounded-md">
                                    <span className="material-symbols-outlined text-sm">bolt</span>
                                    LIVE
                                </div>
                            )}
                        </div>
                        <h3 className="font-bold text-base leading-tight truncate">{challenge.title}</h3>
                        <p className="text-[#9c7349] dark:text-[#c4a68a] text-sm">{challenge.type}</p>
                    </Link>
                ))}
                {challenges.length === 0 && (
                    <div className="text-gray-500 italic px-2">No challenges active yet.</div>
                )}
            </div>
        </section>
    );
}
