import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sky: {
          light: "#87CEEB",
          DEFAULT: "#5BA4CF",
          dark: "#3A86B4",
        },
        wanderlist: {
          orange: "#F97316",
          teal: "#20B2AA",
          beige: "#F5F0E8",
          cream: "#FDFAF5",
        },
        category: {
          food: "#1A237E",
          drinks: "#C2185B",
          outdoors: "#097138",
          furry: "#F57C00",
          entertainment: "#0288D1",
          weird: "#9C27B0",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
