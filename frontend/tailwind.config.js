module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#0B0B0F',
          secondary: '#111118',
          card: '#14141D',
          border: '#1F1F2A',
        },
        primary: {
          DEFAULT: '#7C3AED', // purple CTA
          hover: '#6D28D9',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#A1A1AA',
          muted: '#71717A',
        },
        success: '#22C55E',
        warning: '#F59E0B',
      },
    },
  },
  plugins: [],
}
