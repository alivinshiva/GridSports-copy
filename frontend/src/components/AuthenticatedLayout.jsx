import { HomeHeader } from "@/components/home/HomeHeader";
import { BottomNav } from "@/components/home/BottomNav";

export function AuthenticatedLayout({ children, customBg, fullWidth }) {
    return (
        <div className={`relative flex flex-col min-h-screen w-full overflow-x-hidden font-display ${customBg || "bg-[#0a0f16] text-white"}`}>
            <HomeHeader />

            <main className={`flex-1 w-full ${fullWidth ? "" : "max-w-[1200px] mx-auto pt-24 pb-24 md:pb-8 px-6"}`}>
                {children}
            </main>

            <BottomNav />
        </div>
    );
}
