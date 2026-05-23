/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        mono:  ['var(--font-dm-mono)', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};
