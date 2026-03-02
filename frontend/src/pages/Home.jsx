import { useAuth } from "@/context/AuthContext";
import { AuthenticatedHome } from "@/components/home/AuthenticatedHome";
import { LandingPage } from "@/components/LandingPage";
import { Helmet } from "react-helmet-async";
export default function Home() {
    const { user } = useAuth();

    return (
        <>
            <Helmet>
                <title>SHOWGRID | Racing Hub</title>
                <meta name="description" content="Join SHOWGRID to compete in exclusive racing challenges, follow your favorite tribe, and track your performance." />
            </Helmet>
            {user ? <AuthenticatedHome /> : <LandingPage />}
        </>
    );
}
