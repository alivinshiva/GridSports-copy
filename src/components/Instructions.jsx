import { PlayCircle, Trophy, Zap } from "lucide-react";

export function Instructions() {
    return (
        <section className="bg-racing-black/5 dark:bg-white/5 rounded-3xl p-8 md:p-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">How to Play</h2>
            <div className="space-y-6">
                <div className="flex items-start space-x-5">
                    <div className="w-12 h-12 rounded-full bg-racing-orange/10 flex items-center justify-center flex-shrink-0 text-racing-orange">
                        <PlayCircle size={28} />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg md:text-xl">Select a Challenge</h3>
                        <p className="text-base md:text-lg text-muted-foreground mt-1 leading-relaxed">Choose from multiple race scenarios like Speed Trap or Pit Stop.</p>
                    </div>
                </div>
                <div className="flex items-start space-x-5">
                    <div className="w-12 h-12 rounded-full bg-racing-orange/10 flex items-center justify-center flex-shrink-0 text-racing-orange">
                        <Zap size={28} />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg md:text-xl">Test Your Reflexes</h3>
                        <p className="text-base md:text-lg text-muted-foreground mt-1 leading-relaxed">React instantly to lights out or perfectly time your braking.</p>
                    </div>
                </div>
                <div className="flex items-start space-x-5">
                    <div className="w-12 h-12 rounded-full bg-racing-orange/10 flex items-center justify-center flex-shrink-0 text-racing-orange">
                        <Trophy size={28} />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg md:text-xl">Climb the Leaderboard</h3>
                        <p className="text-base md:text-lg text-muted-foreground mt-1 leading-relaxed">Compete globally and earn your racing license rank.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
