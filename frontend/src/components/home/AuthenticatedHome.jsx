import { useEffect, useState } from "react";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { Hero } from "@/components/home/Hero";
import { WeekendChallenges } from "@/components/home/WeekendChallenges";
import { DiscoveryFeed } from "@/components/home/DiscoveryFeed";
import { ChallengeStatusSection } from "@/components/home/ChallengeStatusSection";
import { getAllActiveWeekends } from "@/services/weekendService";

export function AuthenticatedHome() {
    const [weekends, setWeekends] = useState([]);

    useEffect(() => {
        const fetchWeekends = async () => {
            try {
                // Use the new service to fetch only active weekends
                const response = await getAllActiveWeekends();
                if (response.success && response.data.length > 0) {
                    setWeekends(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch active weekends for Hero:", error);
            }
        };

        fetchWeekends();
    }, []);

    return (
        <AuthenticatedLayout>
            <Hero weekends={weekends || []} />
            <WeekendChallenges />
            <ChallengeStatusSection />
            <DiscoveryFeed />
        </AuthenticatedLayout>
    );
}
