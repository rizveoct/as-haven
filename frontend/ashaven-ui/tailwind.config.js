/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        brand: "#204726", // Deep forest green
        mist: "#f1fbec", // Soft mint accent background
        accent: "#ff771b", // Vibrant orange for calls to action
        ink: "#000000", // Rich black for text and contrast
        pure: "#ffffff", // Clean white surfaces
      },
      boxShadow: {
        "luxe-glow": "0 30px 80px rgba(32, 71, 38, 0.3)",
      },
    },
  },
  plugins: [],
};
