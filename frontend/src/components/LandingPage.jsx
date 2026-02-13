import { Layout } from "@/components/Layout";
import { LandingHero } from "@/components/LandingHero";
import { CategoryRail } from "@/components/CategoryRail";
import { DiscoveryFeed } from "@/components/DiscoveryFeed";

export function LandingPage() {
    return (
        <Layout>
            <LandingHero />
            <div className="my-8">
                <CategoryRail />
            </div>
            <DiscoveryFeed />
        </Layout>
    );
}
