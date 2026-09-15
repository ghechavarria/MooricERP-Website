/** @type {import('tailwindcss').Config} */
import containerQueries from "@tailwindcss/container-queries";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,css}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Montserrat", "system-ui", "sans-serif"],
        serif: ['"Source Serif 4"', "Georgia", "serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      colors: {
        ink: {
          950: "#0a0e14",
          900: "#10141d",
          800: "#1a2230",
          700: "#273449",
        },
        navy: "#0a0e14",
        /** Luminous cool silver (logo-adjacent) */
        accent: {
          DEFAULT: "#bfd3e6",
          light: "#f4f9fc",
        },
        /** Wordmark “ERP” + primary CTAs (see `.btn-primary-silver` in `src/index.css`) */
        erp: {
          DEFAULT: "#0075FF",
          600: "#0062db",
          700: "#0050b5",
        },
        organ: {
          50: "#ffffff",
          100: "#f4f6f9",
          200: "#e7ebf1",
          600: "#6b645c",
          700: "#534c46",
          800: "#3f3833",
          900: "#2c2825",
          950: "#1c1a18",
        },
      },
      boxShadow: {
        card: "0 1px 3px 0 rgb(15 23 42 / 0.06), 0 1px 2px -1px rgb(15 23 42 / 0.06)",
        "card-md":
          "0 4px 6px -1px rgb(15 23 42 / 0.07), 0 2px 4px -2px rgb(15 23 42 / 0.05)",
      },
    },
  },
  plugins: [containerQueries],
};
