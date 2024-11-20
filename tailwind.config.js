/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens:{
      s: "479px",
      m: "767px",
      l: "991px"
    },
    fontFamily: {
      serif: ['Merriweather', 'serif']
    },
    scale: {
      115: "1.15",
    }
  },
  plugins: [],
}