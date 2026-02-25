import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import f1CarBg from "../../assets/f1_car.png";

export function Hero({ weekends }) {
    const [timeLeft, setTimeLeft] = useState({
        days: "00", hours: "00", minutes: "00", seconds: "00"
    });

    const activeWeekend = weekends?.[0] || null;

    useEffect(() => {
        if (!activeWeekend?.endDate) return;

        const timer = setInterval(() => {
            const target = new Date(activeWeekend.endDate).getTime();
            const now = new Date().getTime();
            const difference = target - now;

            if (difference <= 0) {
                clearInterval(timer);
                return;
            }

            const d = Math.floor(difference / (1000 * 60 * 60 * 24));
            const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((difference % (1000 * 60)) / 1000);

            setTimeLeft({
                days: d < 10 ? `0${d}` : `${d}`,
                hours: h < 10 ? `0${h}` : `${h}`,
                minutes: m < 10 ? `0${m}` : `${m}`,
                seconds: s < 10 ? `0${s}` : `${s}`,
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [activeWeekend]);

    return (
        <section className="relative w-full h-[600px] md:h-[700px] xl:h-[800px] bg-[#0a0f16] overflow-hidden flex flex-col justify-center">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-90 mixing-blend-screen"
                style={{ backgroundImage: `url('${activeWeekend?.imageUrl || f1CarBg}')` }}
            >
                {/* Gradient Masks to blend into the dark theme bottom */}
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0a0f16] to-transparent"></div>
                <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-[#0a0f16]/80 to-transparent"></div>
            </div>

            {/* Content Container */}
            <div className="relative z-10 max-w-[1200px] mx-auto px-4 md:px-6 w-full pt-16">
                <div className="max-w-xl">

                    {/* Race Live Badge */}
                    {/* <div className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full mb-6 shadow-lg bg-gradient-to-b from-[#8c6A00] via-[#FACC15] to-[#F5D76E]">
                        <span className="text-blac text-[10px] md:text-xs font-bold uppercase tracking-widest leading-none">
                            Race Live
                        </span>
                    </div> */}

                    {/* Title */}
                    <div className="flex flex-col gap-1 mb-6">
                        <h1 className="text-4xl md:text-6xl xl:text-7xl font-feguropic font-black text-white italic tracking-widest uppercase leading-none" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.1)' }}>
                            {activeWeekend?.title || "GRID RACE"}
                        </h1>
                        <h2 className="text-4xl md:text-6xl xl:text-7xl font-feguropic font-black text-white italic tracking-widest uppercase leading-none">
                            {activeWeekend?.location || "BAHRAIN"}
                        </h2>
                    </div>

                    {/* Countdown Timer */}
                    <div className="flex items-center gap-1 md:gap-2 text-2xl md:text-4xl xl:text-5xl font-bold text-white tracking-widest mb-10">
                        <span>{timeLeft.days}</span>
                        <span className="text-white/60 pb-1">:</span>
                        <span>{timeLeft.hours}</span>
                        <span className="text-white/60 pb-1">:</span>
                        <span>{timeLeft.minutes}</span>
                        <span className="text-white/60 pb-1">:</span>
                        <span>{timeLeft.seconds}</span>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-row items-center gap-3 sm:gap-4 w-full max-w-md">
                        <Link
                            to={activeWeekend ? `/weekend/${activeWeekend._id}` : "#"}
                            className="flex-1 sm:flex-none px-2 sm:px-8 py-3 bg-gradient-to-r from-[#3B82F6] to-[#2ED1B8] shadow-[0_0_25px_rgba(46,209,184,0.7)] hover:shadow-[0_0_15px_rgba(46,209,184,0.9)] text-white font-bold uppercase tracking-widest text-[11px] sm:text-sm rounded-full transition-all active:scale-95 text-center flex items-center justify-center leading-none whitespace-nowrap"
                        >
                            Race Live
                        </Link>

                        <Link
                            to="#"
                            className="flex-1 sm:flex-none px-2 sm:px-8 py-3 bg-white/10 backdrop-blur-md text-white border border-white/20 font-bold uppercase tracking-widest text-[11px] sm:text-sm rounded-full transition-colors hover:bg-white/20 text-center flex items-center justify-center leading-none whitespace-nowrap"
                        >
                            See Race Track
                        </Link>
                    </div>

                </div>
            </div>
        </section>
    );
}
