import { Link } from "react-router-dom";

export function WeekendChallenges() {
    return (
        <section className="mb-10">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold tracking-tight">This Weekend</h2>
                <Link to="/schedule" className="text-primary font-bold text-sm hover:underline">View All</Link>
            </div>
            <div className="flex overflow-x-auto gap-4 no-scrollbar pb-4 -mx-2 px-2">
                {/* Challenge Item 1 */}
                <Link to="/schedule" className="flex-shrink-0 w-48 group cursor-pointer">
                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-3">
                        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" data-alt="F1 start lights showing red" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCRP_JgkIkd25zqf55EJc_STNvVCRpJ7cNffMPisSlyt4X3_ZRXYnbIt5Y0ZyfHU_0oho_YYhysdTQdK-ahKLcktfYy-oYOg-D2Wti_7L3zen7gL--SIv02M07zZrNmz2L6rfgqJt5BxaL24sjjcbObt12MYwZrjRQiVSmBNpcPIMMFpDhzwADDudMsyNGsUn8s95RpPCHcaBpo3I-g3pExy_quG9rEZjBslB3QZj0D4UhkudFzdhtklNyyFBXcv7YbRI96d4ajQR4')" }}></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                        <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white text-xs font-bold bg-primary px-2 py-1 rounded-md">
                            <span className="material-symbols-outlined text-sm">bolt</span>
                            FAST
                        </div>
                    </div>
                    <h3 className="font-bold text-base leading-tight">Race Start Reaction</h3>
                    <p className="text-[#9c7349] dark:text-[#c4a68a] text-sm">Challenge</p>
                </Link>
                {/* Challenge Item 2 */}
                <Link to="/schedule" className="flex-shrink-0 w-48 group cursor-pointer">
                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-3">
                        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" data-alt="Race car speedometer high speed" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAA6zzbgNPPeJqdIDXtemao6L7tj7oWxON_3SzpR8GTF1JyOBabn3eoRHWNyF3J-cHv6p6796LAOF1nzdkvGoCPblTNleKW7citVPj1ypUTBs_6LC6wZfB5KeJn9n5XOvaYLF6bzrjIC3m_YiZWcvNifMkGmUDSFOY3DrATPwVLUpRYLTvLi_iv9gpyzujWlUxjws65IdnEFn7Z81Wsp9y7GSWqycmWEghSa_Dj9iq6KTAlasKm3EQR9qWThKOozJ2fJa0UCNWmby8')" }}></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    </div>
                    <h3 className="font-bold text-base leading-tight">Speed Trap</h3>
                    <p className="text-[#9c7349] dark:text-[#c4a68a] text-sm">Challenge</p>
                </Link>
                {/* Challenge Item 3 */}
                <Link to="/schedule" className="flex-shrink-0 w-48 group cursor-pointer">
                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-3">
                        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" data-alt="Pit crew changing a tire" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBiji8XtXzF1xea1xxA6CuEKdMiyGhyJd6LnqhhTGUbyFlAnY0Yzf9DursbofOKLKJAC1LL9BhwUwJWZeDS-lKRI8EK1u2-V8seyz2_MOADhodKCvYg08f3Z6REfuUFcmePltC9kb8TXsY6IxtarMnpK2gR5_rJnk5H-AAtrUzduGPYfaLn4kU1cOndZp1X-3oU31bgU8W3TCTO8SoqrvrSCVnR6L-gpaAnitFi-hhD0mawOnCeYTa2Cj6pXB8DwCpQoFh3VyIvGjw')" }}></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    </div>
                    <h3 className="font-bold text-base leading-tight">Pit Stop</h3>
                    <p className="text-[#9c7349] dark:text-[#c4a68a] text-sm">Challenge</p>
                </Link>
                {/* Challenge Item 4 */}
                <Link to="/schedule" className="flex-shrink-0 w-48 group cursor-pointer">
                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-3">
                        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" data-alt="Car hitting the apex of a turn" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDE2tVsVJx1IShjrR30icGjIejcebFE45vAOkFvP8b121hPduAMkNZygFBHmzmEIHoFGuapmbx53nlSxQv_zrz92kl2VClLVtPZxFgbWyhE_H5JvLeEvOSdMf5BkzAVbZ4AtbZ8vDZWWBsnYYHq1rYdNrL0qjarIv3lRNjO8K9BY-lYbei-ktQ_0narS205Eymp203kPDmCz3yzo3wft0mfd1M7FDdOO97O90uP03xarsVjr7c63hhwxqEupRQhywDm5jyLZXTjKw4')" }}></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    </div>
                    <h3 className="font-bold text-base leading-tight">Cornering</h3>
                    <p className="text-[#9c7349] dark:text-[#c4a68a] text-sm">Challenge</p>
                </Link>
                {/* Challenge Item 5 */}
                <Link to="/schedule" className="flex-shrink-0 w-48 group cursor-pointer">
                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-3">
                        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" data-alt="Finish line checkered flag" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA0wr3nrNK0FvBjx8KLvlZSoNJpJS9akby0Tf7PDWKRfPwYJkEEyGuKCMtgmHrtlRMaXXjwTWhTcZfD_PS-KCw9xAs7c7zMAZiUIqKsErusWOi_Ls7nvyaQIgAioe-_SFyfYgCOGETUrv_JGHRp1qZFQjrUYdiLv982lVd4EfdvFZm7qRRakh01QlE4c91Ip8JLZlATq_wYkFYzvn_VYQzJShp0lgoO2MRxGQFVeEkBXBQdkqxUrZqcVwmU8Duz1rDw0QA39zYDR9k')" }}></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    </div>
                    <h3 className="font-bold text-base leading-tight">Victory Lap</h3>
                    <p className="text-[#9c7349] dark:text-[#c4a68a] text-sm">Challenge</p>
                </Link>
            </div>
        </section>
    );
}
