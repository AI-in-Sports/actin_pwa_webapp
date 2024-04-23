export default defineNuxtConfig({
  devtools: {
    enabled: true,

    timeline: {
      enabled: true
    }
  },
  gtag: {
    id: 'G-VYZEM75972'
  },
  modules: [
    "@vite-pwa/nuxt", "nuxt3-leaflet", "nuxt-swiper",
    "@pinia/nuxt", "@pinia-plugin-persistedstate/nuxt",
    "@nuxt/image", "nuxt-gtag"
  ],
  image: {dir: 'assets/'},
  css: [
    "@fortawesome/fontawesome-svg-core/styles.css",
    "vue-skeletor/dist/vue-skeletor.css",
    "vue-advanced-cropper/dist/style.css"
  ],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  pinia: {
    storesDirs: [
      './stores/'
    ]
  },
  runtimeConfig: {
    public: {
      APP_BACKEND: process.env.APP_BACKEND,
      DISABLE_RESERVATION: process.env.DISABLE_RESERVATION,
      GIGET_AUTH: process.env.GIGET_AUTH
    }
  },
  extends: ["@actin/pwa-layer"],
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Actin Health',
      short_name: 'Actin Health',
      theme_color: '#ffffff',
      "display": "standalone",
      "background_color": "#ffffff",
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