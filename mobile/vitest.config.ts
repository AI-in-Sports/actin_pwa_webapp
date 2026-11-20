import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

// Unit tests for the pure helpers in app/utils/; they need no Nuxt runtime.
// Pin the transform to tests/tsconfig.json so Oxc does not walk up to
// mobile/tsconfig.json and fail on the generated .nuxt/tsconfig.json that only
// exists after `nuxt prepare`.
export default defineConfig({
  oxc: {
    // Rolldown's transform accepts a tsconfig path; Vite's public type omits it.
    // @ts-expect-error -- not in OxcOptions
    tsconfig: fileURLToPath(new URL('./tests/tsconfig.json', import.meta.url)),
  },
  test: { include: ['tests/**/*.test.ts'], environment: 'node' },
})
