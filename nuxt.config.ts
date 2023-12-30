export default defineNuxtConfig({
  devtools: {
    enabled: true,

    timeline: {
      enabled: true
    }
  },
  modules: [
    "@vite-pwa/nuxt", "nuxt3-leaflet", "nuxt-swiper",
    "@pinia/nuxt", "@pinia-plugin-persistedstate/nuxt",
    "@nuxt/image"
  ],
  image: {
    dir: 'assets/',
  },
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
      APP_BACKEND: process.env.APP_BACKEND,
      DISABLE_RESERVATION: process.env.DISABLE_RESERVATION
    }
  },
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Actin Health',
      short_name: 'Actin Health',
      theme_color: '#ffffff',
      "display": "standalone",
      "background_color": "#000000",
      icons: [
        {
          "src": "logo.png",
          "sizes": "48x48",
          "type": "image/png"
        },
        {
          "src": "logo.png",
          "sizes": "72x72",
          "type": "image/png"
        },
        {
          "src": "logo.png",
          "sizes": "96x96",
          "type": "image/png"
        },
        {
          "src": "logo.png",
          "sizes": "144x144",
          "type": "image/png"
        },
        {
          "src": "logo.png",
          "sizes": "168x168",
          "type": "image/png"
        },
        {
          "src": "logo.png",
          "sizes": "192x192",
          "type": "image/png"
        }
      ],
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
    },
    client: {
      installPrompt: true,
      periodicSyncForUpdates: 20,
    }
  }
})