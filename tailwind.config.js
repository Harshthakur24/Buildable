/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens:{
      s: "479px",
      sm: "640px",
      m: "767px",
      l: "991px",
      lg: "1024px",
      xl: '1280px',
      ss: '1px',
      mm: "480px",
      ll: "768px",
      gg: "992px",
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