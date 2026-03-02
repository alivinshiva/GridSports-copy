import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { getUserNotifications } from "../../services/notificationService";

export function HomeHeader() {
    const { user } = useAuth();
    const [unreadCount, setUnreadCount] = useState(0);
    const location = useLocation();
    const isNotificationsPage = location.pathname === "/notifications";
    const fromPath = location.state?.from && location.state.from !== "/notifications"
        ? location.state.from
        : "/";
    const notificationTarget = isNotificationsPage
        ? fromPath
        : { pathname: "/notifications", state: { from: location.pathname } };

    // Helper function to check if the path matches the current route
    const isActive = (path) => {
        if (path === '/' && location.pathname !== '/') return false;
        return location.pathname.startsWith(path);
    };

    // Default avatar if no image or error
    const defaultAvatar = "https://lh3.googleusercontent.com/aida-public/AB6AXuCc4Y1XBf6f-biRM87-e-Kkw7QScj9DgkT3fN395NkKVPZ-Js9aScP6jVRPNbYbxyFPARUOeRwPCHTiK9Iyp9LP5i1WSaPwzGlpZ_wATUf2RYVhrYrBbBTPVZO--afW_Gy0q-jnBycflAR6fFWBDP4VcKaY7C5BOo7bf84z99q9hGH_ZXMI4hShD-y9v_qvhHVuftJkC4VyFjQ1FlNBSxTJBMciDY-HaLEl79KHOjyqrZb091JFyFgaOVnD333FB9j1nFAuXPlmyZ0";

    useEffect(() => {
        if (user) {
            fetchUnreadCount();
        }
    }, [user]);

    const fetchUnreadCount = async () => {
        try {
            const res = await getUserNotifications();
            if (res.success && res.data) {
                // Compute number of unread if the model separates read/unread
                // The current requirement is that all retrieved notifications are unread because reading deletes them.
                setUnreadCount(res.data.length);
            }
        } catch (error) {
            // Silently handle error
        }
    };

    return (
        <header className="fixed z-[100] 
            top-0
            left-0 
            w-full 
            bg-[#101117]/90 backdrop-blur-md border-b border-white/5
            pt-2 md:pt-4 pb-2 md:pb-4 shadow-sm">
            <div className="max-w-[1200px] mx-auto px-4 md:px-6 h-12 md:h-12 flex items-center justify-between">

                {/* --- MOBILE LAYOUT (md:hidden) --- */}
                <div className="flex md:hidden items-center justify-between w-full h-full">
                    {/* Left: Notifications */}
                    <Link to={notificationTarget} className="relative text-white transition-colors hover:text-white/80 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[24px]">notifications</span>
                        {unreadCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 size-2.5 bg-primary rounded-full border-2 border-background-dark animate-pulse"></span>
                        )}
                    </Link>

                    {/* Center: App Name (Hidden on Mobile to save space if needed, optionally shown) */}
                    <Link to="/" className="flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
                        <h1 className="text-xl font-extrabold tracking-tight text-white drop-shadow-md">SHOWGRID</h1>
                    </Link>

                    {/* Right: Profile */}
                    <Link to="/profile">
                        <div
                            className="size-8 rounded-full bg-cover bg-center border-2 border-white/20 shadow-lg"
                            data-alt="User profile avatar"
                            style={{ backgroundImage: `url('${user?.imageUrl || defaultAvatar}')` }}
                        ></div>
                    </Link>
                </div>

                {/* --- DESKTOP LAYOUT (hidden md:flex) --- */}
                <div className="hidden md:flex items-center justify-between w-full h-full relative">
                    {/* Left: App Logo/Empty depending on Figma. Leaving it empty to match centered nav and clear UI */}
                    <div className="flex-1 flex items-center justify-start h-full">
                    </div>

                    {/* Center: Navigation Links */}
                    <nav className="absolute left-1/2 -translate-x-1/2 flex items-center gap-12 font-medium uppercase text-sm tracking-[0.15em]">
                        <Link to="/" className={`transition-opacity hover:opacity-100 ${isActive('/') ? 'text-white opacity-100' : 'text-white opacity-70'}`}>
                            HOME
                        </Link>
                        <Link to="/challenge/feed" className={`transition-opacity hover:opacity-100 ${isActive('/challenge/feed') ? 'text-white opacity-100' : 'text-white opacity-70'}`}>
                            DISCOVERY
                        </Link>
                        <Link to="/raceboard" className={`transition-opacity hover:opacity-100 ${isActive('/raceboard') ? 'text-white opacity-100' : 'text-white opacity-70'}`}>
                            RANK
                        </Link>
                        <Link to="/profile" className={`transition-opacity hover:opacity-100 ${isActive('/profile') ? 'text-white opacity-100' : 'text-white opacity-70'}`}>
                            PROFILE
                        </Link>
                    </nav>

                    {/* Right: Profile Only as per clean Figma layout (Notifications removed or subtle if needed, keeping for robustness if user wants) */}
                    <div className="flex-1 flex items-center justify-end h-full gap-4">
                        <Link to={notificationTarget} className="relative text-white transition-colors hover:text-white/80 flex items-center justify-center">
                            <span className="material-symbols-outlined text-[24px]">notifications</span>
                            {unreadCount > 0 && (
                                <span className="absolute top-1.5 right-1.5 size-2.5 bg-primary rounded-full border-2 border-background-dark animate-pulse"></span>
                            )}
                        </Link>

                        <Link to="/profile">
                            <div
                                className="size-10 rounded-full bg-cover bg-center border border-white/20 shadow-lg"
                                data-alt="User profile avatar"
                                style={{ backgroundImage: `url('${user?.imageUrl || defaultAvatar}')` }}
                            ></div>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}
