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
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        serif: ["Playfair Display", "serif"],
      },
      maxWidth: {
        content: "min(92vw, 1200px)",
        "content-lg": "min(85vw, 1680px)",
      },
      spacing: {
        "section-y": "clamp(4rem, 8vw, 6.5rem)",
        "section-x": "clamp(1.5rem, 5vw, 2rem)",
        "section-gap": "clamp(2rem, 5vw, 3.5rem)",
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
