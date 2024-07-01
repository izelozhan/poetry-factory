import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // backgroundImage: {
      //   "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      //   "gradient-conic":
      //     "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      // },
      colors: {
        maroon: "#820300",
        goldfish: "#e2b13c",
        orange: "#f88379",
        teal: "#5F8670",
        "color-light": "#E2C799",
        "color-light-2": "#F2ECBE",
        "text-dark": "#322C2B",
        "text-light": "#7c6d6a",
      },
      fontFamily: {
        badscript: ["var(--font-bad-script)"],
        roboto_flex: ["var(--font-roboto-flex)"],
        playfair: ["var(--font-playfair)"],
      },
      variants: {
        extend: {
          borderColor: ["hover", "focus", "active"],
        },
      },
      width: {
        "128": "30rem",
        "160": "40rem",
      },
      
    },
  },
  plugins: [],
};
export default config;
