import { Heart } from "lucide-react";
import { useTribe } from "@/hooks/useTribe";

const discoveries = [
    {
        id: 1,
        user: "@max_drift",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
        image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2670&auto=format&fit=crop", // Sports car rear on track
        rating: 8.7,
        raceId: "R44"
    },
    {
        id: 2,
        user: "@speed_demon",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
        image: "https://images.unsplash.com/photo-1611016186353-652a19d4d8f6?q=80&w=2670&auto=format&fit=crop", // Racing steering wheel
        rating: 9.2,
        raceId: "R21"
    },
    {
        id: 3,
        user: "@lap_king",
        avatar: "https://i.pravatar.cc/150?u=a04258114e29026302d",
        image: "https://images.unsplash.com/photo-1617886903355-9354d78e2112?q=80&w=2670&auto=format&fit=crop", // Digital car dashboard speedometer
        rating: 7.9,
        raceId: "R102"
    },
    {
        id: 4,
        user: "@circuit_pro",
        avatar: "https://i.pravatar.cc/150?u=a04258114e29026311d",
        image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=2670&auto=format&fit=crop", // Racing car tires
        rating: 8.5,
        raceId: "R07"
    }
];

export function DiscoveryFeed() {
    const { tribe } = useTribe();

    return (
        <section className="pb-8">
            <div className="flex items-center justify-between mb-4 px-1">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">Discovery Feed</h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {discoveries.map((item) => (
                    <div key={item.id} className="bg-white rounded-3xl p-3 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
                        <div className="relative aspect-video rounded-2xl overflow-hidden mb-3">
                            <img
                                src={item.image}
                                alt={`Discovery by ${item.user}`}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-lg border border-white/10 flex items-center">
                                <span className="">{item.rating}</span>
                                <span className="text-[10px] opacity-70 ml-1">/ 10</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between px-1.5 pb-1">
                            <div className="flex items-center space-x-3">
                                <div className="p-0.5 rounded-full" style={{ backgroundColor: `${tribe.color}20` }}>
                                    <img src={item.avatar} alt={item.user} className="w-10 h-10 rounded-full object-cover" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm text-gray-900 leading-none mb-0.5">{item.user}</h4>
                                    <p className="text-[10px] text-gray-500 font-medium">Racing ID: {item.raceId}</p>
                                </div>
                            </div>

                            <button className="text-gray-300 hover:scale-110 transition-transform">
                                <Heart size={20} fill="#EA580C" className="text-transparent" style={{ fill: tribe.color }} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
