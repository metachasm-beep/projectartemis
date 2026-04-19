/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        obsidian: "#0A0A0A",
        graphite: "#1C1C1C",
        plum: "#4B0082",
        gold: "#D4AF37",
        silver: "#C0C0C0",
      },
      fontFamily: {
        // You can add custom fonts here later
      },
    },
  },
  plugins: [],
}
