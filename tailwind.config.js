/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts,scss}'],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['"DM Sans"', 'sans-serif'],
        display: ['"Fraunces"', 'serif'],
        mono:    ['"DM Mono"', 'monospace'],
      },
      colors: {
        brand: {
          DEFAULT:    '#0f172a',
          muted:      '#1e293b',
          accent:     '#6366f1',
          'accent-h': '#4f46e5',
          success:    '#10b981',
        },
      },
      keyframes: {
        slideUp:   { from: { opacity:'0', transform:'translateY(10px)' }, to: { opacity:'1', transform:'translateY(0)' } },
        fadeIn:    { from: { opacity:'0' },                               to: { opacity:'1' } },
        scaleIn:   { from: { opacity:'0', transform:'scale(0.95)' },      to: { opacity:'1', transform:'scale(1)' } },
      },
      animation: {
        'slide-up': 'slideUp 0.22s ease forwards',
        'fade-in':  'fadeIn  0.18s ease forwards',
        'scale-in': 'scaleIn 0.20s ease forwards',
      },
    },
  },
  plugins: [],
};
