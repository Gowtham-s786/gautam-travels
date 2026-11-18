import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./lib/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17211b",
        forest: "#245443",
        moss: "#6d8760",
        saffron: "#ef9f43",
        cream: "#f7f3eb",
        sand: "#e8dfd1",
        clay: "#bd694d",
      },
      boxShadow: {
        soft: "0 18px 60px rgba(23, 33, 27, 0.09)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Arial", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      backgroundImage: {
        grain: "radial-gradient(rgba(23,33,27,.11) .7px, transparent .7px)",
      },
    },
  },
  plugins: [],
};

export default config;
