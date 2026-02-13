import { useState, useEffect } from "react";

const DEFAULT_TRIBE = {
    id: "orange",
    name: "Orange Grid",
    color: "#EA580C",
    bg: "linear-gradient(135deg, #F97316 0%, #C2410C 100%)"
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
