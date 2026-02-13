import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { Hero } from "@/components/home/Hero";
import { WeekendChallenges } from "@/components/home/WeekendChallenges";
import { DiscoveryFeed } from "@/components/home/DiscoveryFeed";

export function AuthenticatedHome() {
    return (
        <AuthenticatedLayout>
            <Hero />
            <WeekendChallenges />
            <DiscoveryFeed />
        </AuthenticatedLayout>
    );
}
