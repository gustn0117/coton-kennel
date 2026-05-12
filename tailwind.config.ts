import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          brown: "#8E5E27",
          beige: "#F9F6F0",
          pink: "#ECDAD0",
          tan: "#E8DCC3",
        },
        ink: {
          900: "#000000",
          800: "#2D2D2D",
          700: "#383838",
          500: "#707070",
          300: "#D9D9D9",
        },
        line: {
          card: "#E8E8E8",
          tag: "#F3F4F6",
          surface: "#F9F9F9",
        },
        social: {
          kakao: "#FAE100",
          insta: "#664CBF",
          youtube: "#E21A20",
          xhs: "#FF2742",
          wechat: "#07C160",
        },
      },
      fontFamily: {
        sans: [
          "Noto Sans KR",
          "Noto Sans",
          "Apple SD Gothic Neo",
          "system-ui",
          "sans-serif",
        ],
        pretendard: ["Pretendard", "Noto Sans KR", "sans-serif"],
      },
      maxWidth: {
        page: "1574px",
        "page-wide": "1920px",
        "page-faq": "1562px",
      },
      borderRadius: {
        card: "29px",
        "card-asym-tl": "32px",
        "card-asym-tr": "36px",
        "card-asym-b": "16px",
        pill: "29.5px",
        "pill-sm": "22.5px",
        hero: "46px",
        modal: "46px",
        banner: "30px",
      },
      boxShadow: {
        card: "0px 4px 10px 0px rgba(0, 0, 0, 0.15)",
      },
      backgroundImage: {
        "footer-glow":
          "linear-gradient(239.479deg, rgba(255,166,0,0.05) 18.15%, rgba(133,121,97,0) 58.481%), linear-gradient(239.479deg, rgba(255,166,0,0.3) 18.15%, rgba(255,166,0,0) 58.481%)",
      },
      animation: {
        "scroll-x": "scroll-x 70s linear infinite",
        "scroll-x-reverse": "scroll-x-reverse 80s linear infinite",
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
