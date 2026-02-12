import { Bell, User, Home, Flag, BarChart3, Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const NavItem = ({ icon: Icon, label, path, isActive }) => (
    <Link
        to={path}
        className={cn(
            "flex flex-col items-center justify-center space-y-1 w-full h-full md:flex-row md:space-y-0 md:space-x-2 md:w-auto md:h-auto md:px-4 md:py-2 md:rounded-full md:hover:bg-gray-100 dark:md:hover:bg-white/10 transition-all",
            isActive ? "text-racing-orange md:bg-racing-orange/10" : "text-gray-400 hover:text-gray-200 md:text-gray-600 dark:md:text-gray-300"
        )}
    >
        <Icon size={24} strokeWidth={isActive ? 2.5 : 2} className="md:w-5 md:h-5" />
        <span className="text-[10px] font-medium uppercase tracking-wide md:text-sm md:normal-case">{label}</span>
    </Link>
);

export function Layout({ children }) {
    const location = useLocation();

    return (
        <div className="min-h-screen bg-background text-foreground pb-24 md:pb-0">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-gray-200 dark:border-white/5">
                <div className="max-w-7xl mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
                    <div className="flex items-center space-x-2 md:space-x-4">
                        <Link to="/" className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-racing-orange flex items-center justify-center hover:bg-amber-600 transition-colors">
                            <Flag className="text-white fill-white" size={16} />
                        </Link>
                        <Link to="/" className="font-bold text-lg md:text-xl tracking-tight hover:opacity-80 transition-opacity">Grid Sports</Link>

                        {/* Desktop Nav Links */}
                        <div className="hidden md:flex items-center ml-8 space-x-1">
                            <NavItem icon={Home} label="Home" path="/" isActive={location.pathname === "/"} />
                            <NavItem icon={Flag} label="Compete" path="/compete" isActive={location.pathname === "/compete"} />
                            <NavItem icon={BarChart3} label="Rank" path="/rank" isActive={location.pathname === "/rank"} />
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <button className="md:hidden p-2">
                            <Menu size={20} />
                        </button>
                        <button className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-white/5 hover:bg-gray-200 transition-colors">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="text-xs font-medium">Live</span>
                        </button>
                        <button className="p-2 rounded-full bg-gray-100 dark:bg-racing-gray hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                            <Bell size={20} className="text-gray-600 dark:text-gray-300" />
                        </button>
                        <button className="p-0.5 rounded-full border-2 border-racing-orange hover:shadow-lg hover:shadow-racing-orange/20 transition-all">
                            <img
                                src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                                alt="User Profile"
                                className="w-8 h-8 rounded-full object-cover"
                            />
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-6 space-y-8 md:space-y-12 min-h-[calc(100vh-5rem)]">
                {children}
            </main>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-white border border-gray-100 dark:bg-racing-black/90 dark:border-white/10 backdrop-blur-xl rounded-full shadow-2xl z-50 h-16 px-6 flex items-center justify-between">
                <NavItem
                    icon={Home}
                    label="Home"
                    path="/"
                    isActive={location.pathname === "/"}
                />
                <NavItem
                    icon={Flag}
                    label="Compete"
                    path="/compete"
                    isActive={location.pathname === "/compete"}
                />

                {/* Floating Action Button Style Center */}
                <div className="-mt-8">
                    <button className="w-14 h-14 rounded-full bg-racing-orange shadow-lg shadow-racing-orange/40 flex items-center justify-center transform active:scale-95 transition-transform hover:scale-110">
                        <Flag size={28} className="text-white fill-white" />
                    </button>
                </div>

                <NavItem
                    icon={BarChart3}
                    label="Rank"
                    path="/rank"
                    isActive={location.pathname === "/rank"}
                />
                <NavItem
                    icon={User}
                    label="Profile"
                    path="/profile"
                    isActive={location.pathname === "/profile"}
                />
            </nav>

            {/* Desktop Footer */}
            <footer className="hidden md:block border-t border-gray-200 dark:border-white/5 mt-12 py-8 bg-gray-50 dark:bg-racing-black/50">
                <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-sm text-muted-foreground">
                    <p>&copy; 2026 Grid Sports. All rights reserved.</p>
                    <div className="flex space-x-6">
                        <a href="#" className="hover:text-racing-orange">Privacy</a>
                        <a href="#" className="hover:text-racing-orange">Terms</a>
                        <a href="#" className="hover:text-racing-orange">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
