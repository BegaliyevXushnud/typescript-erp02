/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        mouseAnimation: {
          '0%': { width: '25px', height: '25px' },
          '100%': { width: '15px', height: '15px' },
        },
      },
      animation: {
        mouseAnimation: 'mouseAnimation .5s infinite ease-in-out alternate',
      },
    },
  },
  plugins: [],
}