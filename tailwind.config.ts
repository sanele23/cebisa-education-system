import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/roles/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          teal: "#0d9488",
          tealLight: "#14b8a6",
          blue: "#1d4ed8",
          navy: "#0f172a",
          navyMid: "#1e293b",
          gold: "#f59e0b",
          goldLight: "#fbbf24",
        },
        surface: {
          DEFAULT: "#f8fafc",
          card: "#ffffff",
          muted: "#f1f5f9",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #0d9488 0%, #1d4ed8 100%)",
        "brand-gradient-soft": "linear-gradient(135deg, #0f766e 0%, #1e40af 100%)",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)",
        "card-hover": "0 4px 6px rgba(0,0,0,0.07), 0 12px 32px rgba(0,0,0,0.1)",
      },
    },
  },
  plugins: [],
};

export default config;
