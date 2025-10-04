/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        light: "#ffffff", // White for clean backgrounds
        accent: "#e63946", // Vibrant red for primary accents
        accentLight: "#bcc6da", // Soft red for secondary accents
        dark: "#1f2428", // Dark gray for headers/backgrounds
        lightDark: "#6b7280", // Medium gray for subtle elements
      },
    },
  },
  plugins: [],
};
