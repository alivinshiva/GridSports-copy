import { Bell, User, Home, Flag, BarChart3, Plus, Search } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useTribe } from "@/hooks/useTribe";

const NavItem = ({ icon: Icon, label, path, isActive, color }) => (
    <Link
        to={path}
        className={cn(
            "flex flex-col items-center justify-center space-y-1 w-full h-full md:flex-row md:space-y-0 md:space-x-2 md:w-auto md:h-auto md:px-4 md:py-2 md:rounded-full md:hover:bg-gray-100 transition-all",
            isActive ? "text-gray-900" : "text-gray-400 hover:text-gray-600"
        )}
        style={{ color: isActive ? color : undefined }}
    >
        <Icon size={24} strokeWidth={isActive ? 2.5 : 2} className="md:w-5 md:h-5" />
        <span className="text-[10px] font-medium uppercase tracking-wide md:text-sm md:normal-case mt-1">{label}</span>
    </Link>
);

export function Layout({ children }) {
    const location = useLocation();
    const { tribe } = useTribe();

    return (
        <div className="min-h-screen bg-neutral-50 pb-28 md:pb-0 font-sans">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
                    <div className="flex items-center space-x-2 md:space-x-4">
                        <Link to="/" className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors" style={{ backgroundColor: tribe.color }}>
                            <img src="/logo.svg" className="w-5 h-5 invert" alt="" onError={(e) => e.target.style.display = 'none'} />
                            {/* Fallback if no logo: Cube icon or similar */}
                            <span className="text-white font-bold text-sm">G</span>
                        </Link>
                        <Link to="/" className="font-bold text-lg md:text-xl tracking-tight text-gray-900">Grid Sports</Link>

                        {/* Desktop Nav Links */}
                        <div className="hidden md:flex items-center ml-8 space-x-1">
                            <NavItem icon={Home} label="Home" path="/" isActive={location.pathname === "/"} color={tribe.color} />
                            <NavItem icon={Flag} label="Compete" path="/compete" isActive={location.pathname === "/compete"} color={tribe.color} />
                            <NavItem icon={BarChart3} label="Rank" path="/rank" isActive={location.pathname === "/rank"} color={tribe.color} />
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                            <Bell size={20} className="text-gray-600" />
                        </button>
                        <Link to="/profile" className="p-0.5 rounded-full border-2 hover:shadow-lg transition-all" style={{ borderColor: tribe.color }}>
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                <User size={16} />
                            </div>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-6 space-y-8 md:space-y-12 min-h-[calc(100vh-5rem)]">
                {children}
            </main>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-white backdrop-blur-xl rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] z-50 h-16 px-6 flex items-center justify-between">
                <NavItem
                    icon={Home}
                    label="Home"
                    path="/"
                    isActive={location.pathname === "/"}
                    color={tribe.color}
                />
                <NavItem
                    icon={Flag}
                    label="Compete"
                    path="/compete"
                    isActive={location.pathname === "/compete"}
                    color={tribe.color}
                />

                {/* Floating Action Button Style Center */}
                <div className="-mt-12">
                    <button
                        className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center transform active:scale-95 transition-transform hover:scale-110 text-white"
                        style={{ backgroundColor: tribe.color, boxShadow: `0 8px 24px ${tribe.color}40` }}
                    >
                        <Plus size={28} />
                    </button>
                </div>

                <NavItem
                    icon={BarChart3}
                    label="Rank"
                    path="/rank"
                    isActive={location.pathname === "/rank"}
                    color={tribe.color}
                />
                <NavItem
                    icon={User}
                    label="Profile"
                    path="/profile"
                    isActive={location.pathname === "/profile"}
                    color={tribe.color}
                />
            </nav>
        </div>
    );
}
