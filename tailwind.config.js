/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{tsx,html,jsx}"],
  darkMode: "class",
  mode: "jit",
  theme: {
    spacing: Array.from({ length: 400 }).reduce((map, _, index) => {
      map[index] = `${index}px`;
      return map;
    }, {}),
    extend: {
      colors: {
        c60: '#606060',
        bcf1: '#f1f4f9'
      }
    }
  },
}
