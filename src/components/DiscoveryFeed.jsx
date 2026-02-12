import { Heart } from "lucide-react";

const discoveries = [
    {
        id: 1,
        user: "@max_drift",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
        image: "https://images.unsplash.com/photo-1542226683-0599a0715309?q=80&w=2670&auto=format&fit=crop",
        rating: 8.7,
        raceId: "R44"
    },
    {
        id: 2,
        user: "@speed_demon",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
        image: "https://images.unsplash.com/photo-1594956799589-98246f259728?q=80&w=2670&auto=format&fit=crop",
        rating: 9.2,
        raceId: "R21"
    },
    {
        id: 3,
        user: "@lap_king",
        avatar: "https://i.pravatar.cc/150?u=a04258114e29026302d",
        image: "https://images.unsplash.com/photo-1622185123910-c020121edc7b?q=80&w=2670&auto=format&fit=crop",
        rating: 7.9,
        raceId: "R102"
    },
];

const heartColors = ["text-red-500", "text-green-500", "text-blue-500"];

export function DiscoveryFeed() {
    return (
        <section>
            <div className="flex items-center justify-between mb-4 px-1">
                <h2 className="text-xl font-bold">Discovery Feed</h2>
                <div className="hidden md:flex space-x-2">
                    <button className="px-3 py-1 rounded-full bg-racing-orange text-white text-xs font-bold">Trending</button>
                    <button className="px-3 py-1 rounded-full bg-gray-100 dark:bg-white/5 text-xs font-bold hover:bg-gray-200 transition-colors">New</button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {discoveries.map((item, index) => (
                    <div key={item.id} className="bg-white dark:bg-racing-gray/30 rounded-3xl p-3 shadow-sm border border-gray-100 dark:border-white/5 hover:border-racing-orange/30 transition-colors group">
                        <div className="relative aspect-video rounded-2xl overflow-hidden mb-3">
                            <img
                                src={item.image}
                                alt={`Discovery by ${item.user}`}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-lg border border-white/10">
                                <span className="text-lg">{item.rating}</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between px-1">
                            <div className="flex items-center space-x-3">
                                <img src={item.avatar} alt={item.user} className="w-10 h-10 rounded-full border-2 border-racing-orange/20" />
                                <div>
                                    <h4 className="font-bold text-sm leading-none group-hover:text-racing-orange transition-colors">{item.user}</h4>
                                </div>
                            </div>

                            <button className={`bg-gray-50 dark:bg-white/5 p-2 rounded-full hover:bg-white dark:hover:bg-white/10 transition-colors`}>
                                <Heart size={18} className={`${heartColors[index % 3]} fill-current`} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
