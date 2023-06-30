/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{tsx,ts}'],
  theme: {
    extend: {
      colors: {
        p: '#323232',
        s: '#0D7377',
        a: '#14FFEC',
        w: '#F5FFFA',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('daisyui')],
};
