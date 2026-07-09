/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eefaf3",
          100: "#d8f2e3",
          200: "#b4e6cc",
          300: "#84d6ad",
          400: "#4fbe87",
          500: "#2ca86d",
          600: "#1f8555",
          700: "#1b6945",
          800: "#19533a",
          900: "#164532"
        }
      }
    }
  },
  plugins: []
};
