/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors:{
        'Fuchsia': '#4a044e',
        'dim': '#c026d3',
        'Purple' : '#3b0764',
        caribbeangreen: {
          5: "#C1FFFD",
          25: "#83F1DE",
          50: "#44E4BF",
          100: "#06D6A0",
          200: "#05BF8E",
          300: "#05A77B",
          400: "#049069",
          500: "#037957",
          600: "#026144",
          700: "#014A32",
          800: "#01321F",
          900: "#001B0D",
        },
      },
      fontFamily: {
        'nunito': ['Nunito', 'sans-serif'],
      },
      boxShadow:{
        'custom-shadow': '0.5px 1px 1px black, 0 0 18px blue, 0 0 3px darkblue;',
        'video-shadow': 'pink -5px 5px,  -10px 10px, -5px 5px,  -15px 15px',
        'custom-shadow-1': '0.5px 1px 1px yellow, 0 0 18px pink, 0 0 3px darkgreen;'
      }
    },
   
  },
  plugins: [],
};
