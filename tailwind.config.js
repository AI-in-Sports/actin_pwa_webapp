/** @type {import('tailwindcss').Config} */
import layerTheme from "@ai-in-sports/actin-pwa-layer/tailwind.config"

export default {
    content: [
        "./node_modules/@ai-in-sports/actin-pwa-layer/**/*.{js,vue,ts}",
        "./components/**/*.{js,vue,ts}",
        "./layouts/**/*.vue",
        "./pages/**/*.vue",
        "./plugins/**/*.{js,ts}",
        "./nuxt.config.{js,ts}",
        "./app.vue",
        "./error.vue"
    ],
    theme: layerTheme.theme,
    plugins: [],
}
