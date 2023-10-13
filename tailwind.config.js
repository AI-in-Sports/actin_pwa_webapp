/** @type {import('tailwindcss').Config} */
import defaultTheme from "tailwindcss/defaultTheme"

export default {
    content: [
        "./components/**/*.{js,vue,ts}",
        "./layouts/**/*.vue",
        "./pages/**/*.vue",
        "./plugins/**/*.{js,ts}",
        "./nuxt.config.{js,ts}",
        "./app.vue",
        "./error.vue"
    ],
    theme: {
        screens: {
            'sm': '420px',
        },
        extend: {
            animation: {
                'spin-slow': 'spin 2.5s linear infinite',
            },
            fontFamily: {
                dana: ["Dana", "Arial", "sans-serif"],
            },
            colors: {
                mainBlue: "#0085FF",
                mainDark: "#8080804D",
                mainYellow: "#F8D32D",
                mainDarkYellow: "#BFAC00",
                mainRed: "#FF6B6B",
                mainGreen: "#00A62E",
                mainDarkSecondary: "#101C27"
            }
        }
    },
    plugins: [],
}