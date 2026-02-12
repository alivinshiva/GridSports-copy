import { Layout } from "@/components/Layout";
import { Hero } from "@/components/Hero";
import { CategoryRail } from "@/components/CategoryRail";
import { DiscoveryFeed } from "@/components/DiscoveryFeed";
import { Instructions } from "@/components/Instructions";

export default function Home() {
    return (
        <Layout>
            <Hero />
            <CategoryRail />
            <Instructions />
            <DiscoveryFeed />
        </Layout>
    );
}
