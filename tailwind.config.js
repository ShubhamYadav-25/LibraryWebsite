/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    {
      pattern: /(from|via|to)-(red|green|blue|purple|pink|yellow|orange|teal|cyan|indigo|emerald|lime|rose)-(100|200|300|400|500|600)/,
    },
    {
      pattern: /bg-gradient-to-(tr|tl|br|bl|r|l|t|b)/,
    },
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

