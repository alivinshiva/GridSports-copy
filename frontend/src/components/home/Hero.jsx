import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllHeroes } from "../../services/heroService";

export function Hero() {
    const [heroData, setHeroData] = useState(null);

    useEffect(() => {
        const fetchHeroes = async () => {
            try {
                const response = await getAllHeroes();
                if (response.success && response.data.length > 0) {
                    setHeroData(response.data[0]);
                }
            } catch (error) {
                console.error("Failed to fetch heroes:", error);
            }
        };
        fetchHeroes();
    }, []);

    const currentHero = heroData || {
        name: "Grid Race",
        location: "Bahrain",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC9V8JczUYEIpqpoa6nJo1saMAaKDx0DMxf0-3IP97IIrbrjozybmJczzPtXASTUOKnI5cPOzMyaFyrTQodgYa_qO6nC4JD7XeYfxmE0cd4TY8h2sZP03STsOfqYvh3ZLMdKou9MAq-_wBkVJUokOJ8GWunivnvgieqX7B_-jC0znWm4Cl-J9zVoIN7EL8y-J2rGg-PQw_PbTbykap0DGMMuMaUNgXmTzIl72B5t82D1F9JnbdyBCiAcNqZkEL0QhSpFmoRjNA3gBU"
    };

    return (
        <section className="mb-10">
            <div className="group relative overflow-hidden rounded-xl bg-white dark:bg-[#2d2218] shadow-sm border border-[#f4ede7] dark:border-[#3d2e21] flex flex-col md:flex-row">
                {/* Changed h-64 to aspect-video for better mobile sizing as requested: "remove the image size of top... make it responsive" */}
                <div className="w-full md:w-2/3 aspect-video md:aspect-auto md:h-auto bg-cover bg-center" data-alt={currentHero.name} style={{ backgroundImage: `url('${currentHero.imageUrl}')` }}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:bg-gradient-to-r"></div>
                </div>
                <div className="relative w-full md:w-1/3 p-8 flex flex-col justify-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                        <p className="text-primary text-sm font-bold uppercase tracking-wider">Race Live</p>
                    </div>
                    <div>
                        <p className="text-[#9c7349] dark:text-[#c4a68a] text-sm font-medium">Current Round</p>
                        <h2 className="text-3xl font-extrabold leading-tight">{currentHero.name} - {currentHero.location}</h2>
                    </div>
                    <div className="flex flex-col gap-3 mt-4">
                        <Link to="/schedule" className="w-full py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center">
                            Enter Race
                        </Link>
                        <Link to="/raceboard" className="w-full py-3 bg-[#f4ede7] dark:bg-[#3d2e21] text-[#1c140d] dark:text-white font-bold rounded-xl transition-all hover:bg-[#ebe2d9] flex items-center justify-center">
                            See Raceboard
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
