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
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
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
                "racing-orange": "#F59E0B", // Amber-500 equivalent, vibrant
                "racing-black": "#0F172A", // Slate-900
                "racing-gray": "#1E293B", // Slate-800
                "racing-white": "#F8FAFC", // Slate-50
            },
            fontFamily: {
                sans: ['"Outfit"', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
