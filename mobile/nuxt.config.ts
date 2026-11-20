// The member app is a static SPA shipped inside Tauri v2 on iOS and Android
// (src-tauri). There is no Nitro server, so nothing here may depend on SSR.
// On a phone the dev server must be reachable from the device, so `tauri
// android dev` / `tauri ios dev` set TAURI_DEV_HOST to the machine's LAN IP.
import { fileURLToPath } from 'node:url'

const devHost = process.env.TAURI_DEV_HOST

export default defineNuxtConfig({
  // Keep the generated files in .nuxt (Nuxt 4.6 otherwise moves the build dir
  // into node_modules/.cache). mobile/tsconfig.json extends .nuxt/tsconfig.json,
  // and Vite's Oxc transform resolves that file while bundling.
  buildDir: '.nuxt',
  // Nuxt 4 app directory: pages, components, layouts and assets live in app/.
  srcDir: 'app',
  ssr: false,
  compatibilityDate: '2026-01-01',
  devtools: { enabled: false },
  telemetry: false,

  // Design system (tokens, Ds* components, fonts) and app-core (auth store, OTP login, API client).
  extends: ['@ai-in-sports/actin-pwa-layer'],

  css: ['~/assets/style/main.css'],

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
    // Oxc looks for the nearest tsconfig for every file it transforms. Without
    // an explicit path it walks up to the repo tsconfig.json, whose `extends`
    // points at the generated root .nuxt/tsconfig.json; a CI checkout without
    // that file then fails the build. tsconfig.build.json only carries the
    // transform options. Types are checked separately by `nuxt typecheck`.
    tsconfig: fileURLToPath(new URL('./tsconfig.build.json', import.meta.url)),
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
