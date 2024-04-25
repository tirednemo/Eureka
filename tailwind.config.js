/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          orange: '#F99615',
          cyan: '#00BAC3',
        },
        secondary: {
          orange: '#FFC588',
          cyan: '#B6F0F4',
        },
      },
    },
  },
  plugins: [],
};
