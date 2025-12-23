import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Theme colors using CSS variables
        'theme-bg': 'var(--color-bg-primary)',
        'theme-bg-secondary': 'var(--color-bg-secondary)',
        'theme-bg-card': 'var(--color-bg-card)',
        'theme-text': 'var(--color-text-primary)',
        'theme-text-secondary': 'var(--color-text-secondary)',
        'theme-text-muted': 'var(--color-text-muted)',
        'theme-accent': 'var(--color-accent)',
        'theme-border': 'var(--color-border)',
        // VioTune brand colors
        'vio-accent': '#728AAB',
        'vio-800': 'rgba(18, 32, 68, 0.8)',
        'vio-900': 'rgba(12, 19, 41, 0.9)',
      },
    },
  },
  plugins: [],
}

export default config