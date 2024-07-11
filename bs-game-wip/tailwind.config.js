/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        accent: 'rgb(var(--color-accent) / 1)',
        accentBackground: 'rgb(var(--color-accent) / .08)'
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};