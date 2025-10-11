/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        brand: "#3c75ba", // Deep forest green
        mist: "#f1fbec", // Soft mint accent background
        accent: "#ff771b", // Vibrant orange for calls to action
        ink: "#000000", // Rich black for text and contrast
        pure: "#ffffff", // Clean white surfaces
      },
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
        serif: ["Playfair Display", "serif"],
      },
      boxShadow: {
        "luxe-glow": "0 30px 80px rgba(32, 71, 38, 0.25)",
        "luxe-soft": "0 18px 50px rgba(32, 71, 38, 0.18)",
      },
      borderRadius: {
        luxe: "24px",
        "luxe-sm": "18px",
      },
    },
  },
  plugins: [],
};
