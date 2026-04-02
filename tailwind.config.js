/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        heresy: {
          DEFAULT: "#7f1d1d",
          light: "#fca5a5",
          border: "#991b1b",
        },
        truth: {
          DEFAULT: "#f59e0b",
          light: "#fde68a",
          dark: "#92400e",
        },
      },
    },
  },
  plugins: [],
};
