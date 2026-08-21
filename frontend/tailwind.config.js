/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FDFBF7',
          100: '#FBF4E7',
          200: '#F5E3C3',
          300: '#EED29E',
          400: '#E1B356',
          500: '#D4AF37', // Primary Gold Accent
          600: '#B8922A',
          700: '#94721F',
          800: '#715518',
          900: '#533D12'
        },
        emerald: {
          900: '#064E3B',
          950: '#022C22'
        },
        burgundy: {
          800: '#5C1420',
          900: '#4A0E17'
        },
        cream: {
          50: '#FCFBF7',
          100: '#FAF8F5',
          200: '#F2ECE4'
        },
        luxury: {
          dark: '#0F172A',
          card: '#1E293B',
          border: '#334155'
        }
      },
      fontFamily: {
        serif: ['Cinzel', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'Outfit', 'sans-serif']
      },
      boxShadow: {
        'gold-glow': '0 0 25px -5px rgba(212, 175, 55, 0.3)',
        'luxury': '0 20px 40px -15px rgba(0, 0, 0, 0.5)'
      }
    },
  },
  plugins: [],
}
