import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#FAF6EE",
          100: "#F5EFE3",
          200: "#EFE6D2",
          300: "#E6D9BD",
        },
        kennel: {
          gold: "#A48056",
          brown: "#7A6347",
          dark: "#3F3326",
          accent: "#C9A878",
          btn: "#705C42",
        },
        ink: {
          900: "#1A1A1A",
          700: "#3D3D3D",
          500: "#6E6E6E",
          400: "#9C9C9C",
        },
      },
      fontFamily: {
        sans: ["Pretendard", "Apple SD Gothic Neo", "system-ui", "sans-serif"],
        serif: ["'Playfair Display'", "Georgia", "serif"],
      },
      maxWidth: {
        page: "1280px",
      },
      animation: {
        "scroll-x": "scroll-x 30s linear infinite",
        "scroll-x-reverse": "scroll-x-reverse 35s linear infinite",
      },
      keyframes: {
        "scroll-x": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "scroll-x-reverse": {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
