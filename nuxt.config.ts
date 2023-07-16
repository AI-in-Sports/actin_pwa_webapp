// https://nuxt.com/docs/api/configuration/nuxt-config
import {plugins} from "nitropack/dist/runtime/virtual/plugins";

export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/style/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  }
})
