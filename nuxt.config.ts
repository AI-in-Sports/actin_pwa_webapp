export default defineNuxtConfig({
  // The member app keeps its session in localStorage and its persisted Pinia
  // store is a client-only plugin, so it is a SPA: server-rendered pages would
  // run the auth middleware without a token and crash. Nitro still serves it.
  ssr: false,
  // Nuxt 4 app directory: pages, components, layouts, plugins, stores and assets
  // live in app/. The layer's own dirs stay at its package root (srcDir ".").
  srcDir: "app",
  devtools: {
    enabled: false,
  },
  gtag: {
    id: 'G-VYZEM75972'
  },
  modules: [
    "@vite-pwa/nuxt", "@nuxt/image", "nuxt-gtag"
  ],
  image: {dir: 'assets/'},
  css: [
    "@fortawesome/fontawesome-svg-core/styles.css",
    "vue-skeletor/dist/vue-skeletor.css",
    "vue-advanced-cropper/dist/style.css"
  ],
  // Tailwind CSS 4 runs through the layer's @tailwindcss/vite plugin; no PostCSS
  // tailwind plugin is needed here.
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
  extends: ["@ai-in-sports/actin-pwa-layer"],
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
    generateSW: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
    },
  }
})
