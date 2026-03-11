import glowPreset from 'glow-ds/tailwind-preset'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
    './node_modules/glow-ds/dist/**/*.js',
  ],
  presets: [glowPreset],
  theme: {
    extend: {
      // Project-specific overrides go here
    },
  },
  plugins: [],
}
