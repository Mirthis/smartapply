import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      // "business",
      {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        smartapply: {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-var-requires
          ...require("daisyui/src/colors/themes")["[data-theme=corporate]"],
          "--rounded-box": "0.5rem", // border radius rounded-box utility class, used in card and other large boxes

          "--rounded-btn": "0.5rem", // border radius rounded-btn utility class, used in buttons and similar element
          // secondary: "#93c5fd",
          secondary: "#60a5fa",
        },
      },
    ],
  },
} satisfies Config;
