import { sveltekit } from '@sveltejs/kit/vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    // remove +page.server.ts on tauri to prevent __data.json dependencies
    ...(!!process.env.TAURI_ENV_PLATFORM
      ? [
          {
            name: 'ignore-server-files',
            load(id: string) {
              if (
                id.includes('+page.server') ||
                id.includes('+layout.server')
              ) {
                return 'export const load = undefined'
              }
            },
          },
        ]
      : []),
    sveltekit(),
    tailwindcss(),
  ],
  build: {
    sourcemap: true,
  },
  define: {
    __VERSION__: JSON.stringify(process.env.npm_package_version),
  },
  server: {
    watch: {
      ignored: ['!**/node_modules/mono-svelte/**'],
    },
  },
})
