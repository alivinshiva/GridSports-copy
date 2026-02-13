import { useAuth } from "@/context/AuthContext";
import { AuthenticatedHome } from "@/components/home/AuthenticatedHome";
import { LandingPage } from "@/components/LandingPage";

export default function Home() {
    const { user } = useAuth();

    if (user) {
        return <AuthenticatedHome />;
    }

    return <LandingPage />;
}
