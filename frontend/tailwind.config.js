/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        siem: {
          bg: "#09111a",
          panel: "#101b2b",
          accent: "#0ea5e9",
          success: "#22c55e",
          warn: "#f59e0b",
          danger: "#ef4444",
        },
      },
    },
  },
  plugins: [],
};