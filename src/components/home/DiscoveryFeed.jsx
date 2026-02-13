export function DiscoveryFeed() {
    return (
        <section>
            <h2 className="text-2xl font-bold tracking-tight mb-6">Discovery Feed</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Entry Card 1 */}
                <div className="flex flex-col rounded-xl bg-white dark:bg-[#2d2218] border border-[#f4ede7] dark:border-[#3d2e21] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="relative aspect-video">
                        <div className="absolute inset-0 bg-cover bg-center" data-alt="POV racing game footage" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC3-pop5ZJisK45SkGJNHPFsgLgTzL_HCYDGZRsHM6-QOBOp6vBtTGHf6kO9LXwSQ9exvddkAbXeHM3wbevGVoXhLAr21yQVypuSr8kLbHc6QjQlcZC7-TyQpuCYhREUC6h3vNfmg3Mk-dPcQ09eqOX4DYnLjIcCNMcA4wbVZt80HOLyupRDwFYLCL0KswHTVn7KcPMua2D3RcY_BIL4Xn3aRg40XfZkR-HaQGLAkkR8or9k1u2xzL4e9An2apeBAFaI7Rfkw6c_8I')" }}></div>
                        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-bold border border-primary">
                            8.7 <span className="text-xs font-normal opacity-80">/ 10</span>
                        </div>
                    </div>
                    <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-full bg-gray-200 bg-cover bg-center" data-alt="User avatar thumbnail" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC0b5QuAMK7m1I4ttblJBQl9jkebhzs4ePryluapOvo7AyX5hSr3xaIzqRcr-k5YnMnVwJRPdmLAK0ndOCEPmQ4g5GKeq5vfHPho1TTWE98aW1RbfTOk85RbndP6yNt_jWniGOdEchZItJtb63eEroe4U-wWx8XgHesv8eJtZ0JhQjfw3C2o7jJocx611DQT782gAHeqOhYvrPc_UOJ2gMGl1dKoms2rn5sb_Ipg4QKuewlUCPCq8tGjNbVgSLz5R0SVivQVw9HiMU')" }}></div>
                            <div>
                                <p className="font-bold text-sm">@max_drift</p>
                                <p className="text-xs text-[#9c7349] dark:text-[#c4a68a]">Racing ID: R44</p>
                            </div>
                        </div>
                        <button className="text-primary"><span className="material-symbols-outlined">favorite</span></button>
                    </div>
                </div>
                {/* Entry Card 2 */}
                <div className="flex flex-col rounded-xl bg-white dark:bg-[#2d2218] border border-[#f4ede7] dark:border-[#3d2e21] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="relative aspect-video">
                        <div className="absolute inset-0 bg-cover bg-center" data-alt="Steering wheel setup for racing simulator" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDhDN9w3uiY2yYQNLJUK9v6EclQBi15CYpNmMBMR7nbi5KNvzx6-TMlmCLNeaaftu9Kty99EN5Ei4_BWjAmCOXBqtqIOmEaLgEidS7vCfdwxJJzVzTp7HoKncgjcrsc-gKwFlO_vnuapGKwm3wuP_ZIiYfFKvZVTQUXz0GXWAheu66DMke6Idlk4O5l9P19ulM_CTToDxyQ0TMbBYg8ffCvTvDJV1Xv66vo7x8jxBtIpOLTomoH_5qrNl_S1NKo7ifJ07RVw1k5ipY')" }}></div>
                        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-bold border border-primary">
                            9.2 <span className="text-xs font-normal opacity-80">/ 10</span>
                        </div>
                    </div>
                    <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-full bg-gray-200 bg-cover bg-center" data-alt="User avatar thumbnail" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDu95ggAUahZDhYRRU6i2wK2mDRqXJWTmH5lI8leLaHnu0ekJRcf9J8aH7XiCHOZfQDcNSi2HtPTt4aatwVfCWkc8Ofzm1M-1U0BvV1tZiTQ_iCFylXLbGsy0QH5UulgdWEUIZ831W0rZrIvAQlPQPIiybDASTsteUA_bXG3yk08rC9Ti7QnPcqa7yWgcasgXCF81MTwK-n6pW6U5ASwcNhtfkT3Db_XkLAgAxGNAjvmLBzNDj2PYC95_YTk84-poAjjiiQaFTulJQ')" }}></div>
                            <div>
                                <p className="font-bold text-sm">@speed_demon</p>
                                <p className="text-xs text-[#9c7349] dark:text-[#c4a68a]">Racing ID: R21</p>
                            </div>
                        </div>
                        <button className="text-primary"><span className="material-symbols-outlined">favorite</span></button>
                    </div>
                </div>
                {/* Entry Card 3 */}
                <div className="flex flex-col rounded-xl bg-white dark:bg-[#2d2218] border border-[#f4ede7] dark:border-[#3d2e21] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="relative aspect-video">
                        <div className="absolute inset-0 bg-cover bg-center" data-alt="Car dashboard with glowing speed display" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDpeH1k_Y6ohY97XCUjqCmNZLBlw4a1Mrk8dgwVrfzsiD9OFkPosGgHPDIPAa2AnNXC6ys7Wl_NSOUHRgcRQwSe476AiZ7YU7kefEUQbiW1A1Y2yfmxneJ7--9_juxnRxIzpk4nrwVh98i1MamOXzHjjQmDj8QKwaexvQLQ16DSX_5aHqVsFMluYQN9fW0Uso-swsOQAl7taaX1T-ABB0VTax6N0tYhw5Z-zKuCpwB_LAK1_v-rKghuDzivs2m3U93694cK5-IKFSg')" }}></div>
                        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-bold border border-primary">
                            7.9 <span className="text-xs font-normal opacity-80">/ 10</span>
                        </div>
                    </div>
                    <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-full bg-gray-200 bg-cover bg-center" data-alt="User avatar thumbnail" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDdTUmsVVvTLWE7GAdmdDMyNRpnZWHyNHcs9RL7cSikM3hWScWP2ttABEiyWh7UZXugDDUZnVvlPzTmpoBqPgOfq5c9RViwog1n7NOUHXHNFoz9ylh-I0sZSE0fS437qH19Hqnx-hWWvee_IzlQsLEyHriK6XerIi-En9K96Me0mSz-wUpPvEcsaINF3ZrHUiRMSrN03dC2IIo_oRYdFVMeJWXeDVnutuEAuQckuHxuQ8U8g2c-Qjj6otETem6kY3idmtw7MsYBKOU')" }}></div>
                            <div>
                                <p className="font-bold text-sm">@lap_king</p>
                                <p className="text-xs text-[#9c7349] dark:text-[#c4a68a]">Racing ID: R102</p>
                            </div>
                        </div>
                        <button className="text-primary"><span className="material-symbols-outlined">favorite</span></button>
                    </div>
                </div>
                {/* Entry Card 4 */}
                <div className="flex flex-col rounded-xl bg-white dark:bg-[#2d2218] border border-[#f4ede7] dark:border-[#3d2e21] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="relative aspect-video">
                        <div className="absolute inset-0 bg-cover bg-center" data-alt="Close up of racing tires on asphalt" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCmf2u9f3CuF53suIsy2GQydA_-vzvVYMFzfnR2UYMSzdH8_E5FwtcioB6qZD_iUKqqRG2t5rK3kCPwcWb6OcOf43xaUaM_mIfWkCUZ_XShj-srsGvFUL5conKPTD--Qh64KNMvLEfxA3gWD2PsQKXMl6LxtZw7cr9v6QYEDOHiUacMbNMH5xeISAQeWgQpDhfzrpuEcabjCYya2ZhyNWtjIZ1jSC3rjaCvmyBlFEH6BTzmtfCdunqgJw7oQ5FKPoeNL48GilOsDcg')" }}></div>
                        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-bold border border-primary">
                            8.5 <span className="text-xs font-normal opacity-80">/ 10</span>
                        </div>
                    </div>
                    <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-full bg-gray-200 bg-cover bg-center" data-alt="User avatar thumbnail" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCNaKYjcjEylf5jrWh_CX-ToNzU7zFi-GAzpiZZmGIMqPOQ6MjDYQG8w0GC9vwfS8DBO-gQgNf8nX26PoNxnQxdBDxBQOYtc3u2WkQs7dcrD5B_ptZqnO8Dv5SqnfhlYYFbbUR-MGM2W-XNomege9ijGq23bdHixHs-ENdNibeyEzIA6_ONP9LBDKcZmVOZSI36NyVOgeIakwOLiUxApXfY6ALvBiGyCLYEwVNTTlDaklLNJed2NTLEWkIwrUMfGJaadHXTBVYXcpI')" }}></div>
                            <div>
                                <p className="font-bold text-sm">@circuit_pro</p>
                                <p className="text-xs text-[#9c7349] dark:text-[#c4a68a]">Racing ID: R07</p>
                            </div>
                        </div>
                        <button className="text-primary"><span className="material-symbols-outlined">favorite</span></button>
                    </div>
                </div>
            </div>
        </section>
    );
}
