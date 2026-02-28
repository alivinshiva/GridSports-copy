import { useState, useEffect } from "react";

const DEFAULT_TRIBE = {
    id: "ORANGE TRIBE",
    name: "ORANGE TRIBE",
    color: "#E78230",
    bg: "linear-gradient(135deg, #E78230 0%, #0B0B0F 100%)"
};

export function useTribe() {
    const [tribe, setTribe] = useState(DEFAULT_TRIBE);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedTribe = localStorage.getItem("gridsports_tribe");
        if (storedTribe) {
            try {
                setTribe(JSON.parse(storedTribe));
            } catch (e) {
                console.error("Failed to parse tribe from local storage", e);
            }
        }
        setIsLoading(false);
    }, []);

    return { tribe, isLoading };
}
