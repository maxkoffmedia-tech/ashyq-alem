// tailwind.config.js
module.exports = {
  content: [
    "./src/app/**/*.{ts,tsx,js,jsx}",
    "./src/components/**/*.{ts,tsx,js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        'steppe-sand': '#D4AF37',
        'steppe-sky': '#87CEEB',
        'steppe-night': '#1A1A2E',
      }
    }
  },
  plugins: []
}
