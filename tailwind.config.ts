import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#05040a",
        purple: "#151020",
        neon: "#ff0a5c",
        smoke: "#9f9aae",
        frost: "#f6f1ff",
      },
      boxShadow: {
        neon: "0 0 32px rgba(255, 10, 92, 0.45)",
        panel: "0 24px 90px rgba(0, 0, 0, 0.45)",
      },
      fontFamily: {
        display: ["var(--font-display)", "Inter", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "radial-lux":
          "radial-gradient(circle at 20% 20%, rgba(255,10,92,.18), transparent 28rem), radial-gradient(circle at 75% 10%, rgba(119,67,255,.18), transparent 32rem), linear-gradient(180deg, #05040a 0%, #151020 48%, #05040a 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
