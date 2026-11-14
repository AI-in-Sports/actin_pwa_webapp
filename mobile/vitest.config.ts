import { defineConfig } from 'vitest/config'

// Unit tests for the pure helpers in utils/; they need no Nuxt runtime.
export default defineConfig({
  test: { include: ['tests/**/*.test.ts'], environment: 'node' },
})
