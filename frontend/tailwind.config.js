/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // Add Lora to the font families
      fontFamily: {
        // Overrides the default 'sans' font to use Lora
        sans: ['Lora', 'serif'],
        // You can also define it as a custom name if you prefer
        // lora: ['Lora', 'serif'],
      },
    },
  },
  plugins: [],
}