import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

/** GitHub Pages serves the site from https://<user>.github.io/<repo>/, so production builds live under the repo path. */
const PAGES_BASE = '/bestari-proto/'

export default defineConfig(({ command, isPreview }) => ({
  base: command === 'build' || isPreview ? PAGES_BASE : '/',
  plugins: [react()],
  server: { port: 5173 },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: false,
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/main.tsx', 'src/test/**', 'src/**/*.test.{ts,tsx}'],
    },
  },
}))
