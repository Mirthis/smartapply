import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      "business",
      // {
      //   mytheme: {
      //     primary: "#dc2626",
      //     secondary: "#D85251",
      //     accent: "#fb923c",
      //     neutral: "#fee2e2",

      //     "base-100": "#f3f4f6",
      //     info: "#42ADBB",
      //     success: "#499380",
      //     warning: "#E97F14",
      //     error: "#DF1A2F",
      //   },
      // },
    ],
  },
} satisfies Config;
