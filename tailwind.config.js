/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'pastel-pink': '#F8BBD9',
        'pastel-purple': '#E4C1F9',
        'pastel-mint': '#A8E6CF',
        'pastel-cream': '#FFF2CC',
        'pastel-blue': '#A8E6F7',
      },
      backgroundImage: {
        'gradient-pastel': 'linear-gradient(135deg, #F8BBD9 0%, #E4C1F9 25%, #A8E6CF 50%, #FFF2CC 75%, #A8E6F7 100%)',
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
};