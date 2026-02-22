import { HomeHeader } from "@/components/home/HomeHeader";
import { BottomNav } from "@/components/home/BottomNav";

export function AuthenticatedLayout({ children }) {
    return (
        <div className="relative flex flex-col min-h-screen w-full overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-[#1c140d] dark:text-[#fcfaf8]">
            <HomeHeader />

            <main className="flex-1 w-full max-w-[1200px] mx-auto pt-24 pb-24 md:pb-8 px-6">
                {children}
            </main>

            <BottomNav />
        </div>
    );
}
