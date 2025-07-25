/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'burger-red': '#FF4C4C',
        'burger-orange': '#FFA500',
        'burger-yellow': '#FFC107',
        'burger-dark': '#2D2D2D',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
};