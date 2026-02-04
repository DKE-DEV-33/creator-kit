/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#0f172a',
        paper: '#f6f3ee',
        mist: '#eef2ff',
        ember: '#f97316',
        forest: '#0f766e',
        slatewash: '#cbd5f5',
      },
      boxShadow: {
        glow: '0 20px 50px -30px rgba(15, 118, 110, 0.6)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
