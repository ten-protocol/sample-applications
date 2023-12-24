/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        yellow: "#FAEC00",
        red: "#F05",
      },
    },
  },
  plugins: [],
};
