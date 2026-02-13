import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const f1Category = {
    id: 3,
    name: "Formula 1",
    type: "Grand Prix",
    image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=2670&auto=format&fit=crop"
};

export function CategoryRail() {
    return (
        <section>
            <div className="flex items-center justify-between mb-4 px-1">
                <h2 className="text-xl font-bold">This Weekend</h2>
                <button className="text-racing-orange text-sm font-semibold hover:text-amber-400 transition-colors flex items-center">
                    View All <ChevronRight size={16} />
                </button>
            </div>

            <div className="w-full">
                <Link to="/schedule">
                    <motion.div
                        whileTap={{ scale: 0.98 }}
                        className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden group shadow-md hover:shadow-xl transition-all cursor-pointer"
                    >
                        <img
                            src={f1Category.image}
                            alt={f1Category.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-90" />

                        <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6">
                            <div className="bg-racing-orange text-white text-xs font-bold px-3 py-1.5 rounded mb-2 max-w-fit uppercase flex items-center shadow-lg">
                                <span className="mr-1">⚡</span> Fast
                            </div>
                            <h3 className="font-bold text-2xl md:text-3xl text-white leading-tight">{f1Category.name}</h3>
                            <p className="text-gray-300 text-sm md:text-base">{f1Category.type}</p>
                        </div>
                        <div className="absolute top-4 right-4 md:top-6 md:right-6">
                            {/* F1 Logo or similar could go here */}
                        </div>
                    </motion.div>
                </Link>
            </div>
        </section>
    );
}
