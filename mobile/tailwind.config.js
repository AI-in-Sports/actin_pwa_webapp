/** @type {import('tailwindcss').Config} */
import layerTheme from "@actin/pwa-layer/tailwind.config"
export default {
  content: [
    "./node_modules/@actin/pwa-layer/**/*.{js,vue,ts}",
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./utils/**/*.ts",
    "./app.vue",
  ],
  darkMode: layerTheme.darkMode,
  theme: layerTheme.theme,
  plugins: [],
}
