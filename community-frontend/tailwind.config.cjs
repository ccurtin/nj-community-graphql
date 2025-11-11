/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // <- includes App.tsx
  ],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/postcss"), require("autoprefixer")],
  darkMode: "class", // optional if you want dark mode toggling
};
