import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        sap: {
          blue: "#0A6ED1",
          hover: "#0854A0",
          dark: "#081d33",
          card: "#121a29",
          border: "#1e293b",
          gold: "#E09B16",
          red: "#DE4040",
          green: "#2B9854",
        },
      },
    },
  },
  plugins: [],
};
export default config;
