/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  // Safelist important dynamic classes that might be purged
  safelist: [
    // Material Symbols icon variations
    'material-symbols-outlined',
    // Dynamic color classes
    {
      pattern: /^(bg|text|border)-(primary|slate|emerald|amber|rose|blue)-(50|100|200|300|400|500|600|700|800|900)$/,
    },
    // Dark mode variants
    {
      pattern: /^dark:/,
    },
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#0056b3", // NewsVoice Blue (darker, authoritative)
        "primary-hover": "#004494",
        "primary-light": "rgba(0, 86, 179, 0.1)",
        "accent": "#d32f2f", // News/Alert Red
        "background-light": "#f8f9fa", // Paper-like off-white
        "background-dark": "#121212", // OLED/Deep Black
        "surface-light": "#ffffff",
        "surface-dark": "#1e1e1e",
      },
      fontFamily: {
        "display": ["Merriweather", "serif"],
        "sans": ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        "serif": ["Merriweather", "serif"],
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "2xl": "1rem",
        "full": "9999px",
      },
    },
  },
  plugins: [],
}
