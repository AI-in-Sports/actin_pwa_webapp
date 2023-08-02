export default defineNuxtConfig({
  devtools: { enabled: true },
  css: [
    "~/assets/style/main.css",
    "@fortawesome/fontawesome-svg-core/styles.css"
  ],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  runtimeConfig: {
    public: {
      EXPRESS_BACKEND: process.env.EXPRESS_BACKEND,
    }
  },
})
