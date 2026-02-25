/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "#f48c25", // Updated from snippet
                    foreground: "hsl(var(--primary-foreground))",
                },
                "background-light": "#f8f7f5", // New
                "background-dark": "#221910", // New
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                "racing-orange": "#F59E0B",
                "racing-black": "#0F172A",
                "racing-gray": "#1E293B",
                "racing-white": "#F8FAFC",
            },
            fontFamily: {
                sans: ['"Outfit"', 'sans-serif'],
                display: ['"Be Vietnam Pro"', "sans-serif"], // New
                body: ['"Noto Sans"', "sans-serif"], // New
                feguropic: ['"Feguropic"', 'sans-serif'],
            },
            borderRadius: { "DEFAULT": "0.5rem", "lg": "1rem", "xl": "1.5rem", "full": "9999px" }, // Validated from snippet
        },
    },
    plugins: [],
}
