// The member app is a static SPA shipped inside Tauri v2 on iOS and Android
// (src-tauri). There is no Nitro server, so nothing here may depend on SSR.
// On a phone the dev server must be reachable from the device, so `tauri
// android dev` / `tauri ios dev` set TAURI_DEV_HOST to the machine's LAN IP.
const devHost = process.env.TAURI_DEV_HOST

export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2026-01-01',
  devtools: { enabled: false },
  telemetry: false,

  // Design system (tokens, Ds* components, fonts) and app-core (auth store, OTP login, API client).
  extends: ['@actin/pwa-layer'],

  css: ['~/assets/style/main.css'],

  postcss: {
    plugins: { tailwindcss: {}, autoprefixer: {} },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'fa', dir: 'rtl' },
      title: 'اکتین',
      meta: [
        // viewport-fit=cover so the layout can pad for the notch and home indicator.
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'theme-color', content: '#ffffff' },
      ],
    },
  },

  runtimeConfig: {
    public: {
      // Baked in at build time: APP_BACKEND=https://api.actinhealth.ir pnpm generate
      APP_BACKEND: process.env.APP_BACKEND || 'https://api.actinhealth.ir',
    },
  },

  devServer: { host: devHost || '0.0.0.0', port: 3000 },
  vite: {
    clearScreen: false,
    envPrefix: ['VITE_', 'TAURI_'],
    server: {
      strictPort: true,
      hmr: devHost ? { protocol: 'ws', host: devHost, port: 3001 } : undefined,
    },
  },
  ignore: ['src-tauri/**'],
  typescript: {
    tsConfig: { exclude: ['../src-tauri/**'] },
  },
})
