/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: ["./**/*.{html,js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
      sans: ['Inter var', ...defaultTheme.fontFamily.sans],
     },
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/forms'),
    require('daisyui'),
  ],
}