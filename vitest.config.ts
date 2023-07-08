import { svelte } from '@sveltejs/vite-plugin-svelte'
import { defineConfig } from 'vitest/dist/config'

export default defineConfig({
  // @ts-ignore
  plugins: [svelte()],
  test: {
    globals: true,
    environment: 'jsdom',
  },
})
