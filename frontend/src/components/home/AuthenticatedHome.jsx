import { useEffect, useState } from "react";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { Hero } from "@/components/home/Hero";
import { ThisWeekend } from "@/components/home/ThisWeekend";
import { UpcomingLocations } from "@/components/home/UpcomingLocations";
import { getAllActiveWeekends, getAllUpcomingWeekends } from "@/services/weekendService";

export function AuthenticatedHome() {
    const [activeWeekends, setActiveWeekends] = useState([]);
    const [upcomingWeekends, setUpcomingWeekends] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWeekends = async () => {
            try {
                // Fetch active weekends to populate Hero and ThisWeekend
                const activeRes = await getAllActiveWeekends();
                if (activeRes.success) {
                    setActiveWeekends(activeRes.data);
                }

                // Fetch upcoming weekends to populate UpcomingLocations
                const upcomingRes = await getAllUpcomingWeekends();
                if (upcomingRes.success) {
                    setUpcomingWeekends(upcomingRes.data);
                }
            } catch (error) {
                // Silently handle error
            } finally {
                setLoading(false);
            }
        };

        fetchWeekends();
    }, []);

    // Active weekend is the first one
    const activeWeekend = activeWeekends[0] || null;

    return (
        <AuthenticatedLayout fullWidth={true} customBg="bg-[#0a0f16] text-white">
            <div className="pb-20">
                {!loading && (
                    <>
                        {/* Passes all weekends, Hero component selects the first one */}
                        <Hero weekends={activeWeekends} />

                        {/* Displays challenges for the active weekend */}
                        <ThisWeekend weekend={activeWeekend} />

                        {/* Displays cards for future upcoming weekends */}
                        <UpcomingLocations upcomingWeekends={upcomingWeekends} />
                    </>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
