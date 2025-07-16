/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Dark Theme Palette
        'primary-bg': '#0B132B', // Midnight Blue
        'surface': '#1C2541',    // Dark Slate Blue
        'text-primary': '#F8F7F2', // Off-white (Cream)
        'text-secondary': '#A8A29E', // Muted Stone
        'accent-primary': '#C0392B', // Deep Red
        'accent-secondary': '#D4AF37', // Warm Gold
      },
      fontFamily: {
        'sans': ['"Noto Sans JP"', 'sans-serif'],
        'serif': ['"Shippori Mincho"', 'serif'],
      },
      keyframes: {
        'zoom-fade-in': {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        'zoom-fade-in': 'zoom-fade-in 0.5s ease-out',
      },
    },
  },
  plugins: [],
}
