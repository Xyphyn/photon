import { svelte } from '@sveltejs/vite-plugin-svelte'
import { defineConfig } from 'vitest/dist/config'

export default defineConfig({
  // @ts-expect-error svelte is in fact a valid plugin
  plugins: [svelte()],
  test: {
    globals: true,
    environment: 'jsdom',
  },
})
