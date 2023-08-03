import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig, type PluginOption } from 'vite'
import { SvelteKitPWA } from '@vite-pwa/sveltekit'

export default defineConfig({
  plugins: [
    sveltekit(),
    SvelteKitPWA({
      registerType: 'prompt',
      strategies: 'generateSW',
      workbox: {
        globPatterns: ['client/**/*.{js,css,html,ico,png,svg}'],
      },
      devOptions: {
        enabled: true,
        type: 'module',
        navigateFallback: '/',
      },
      manifest: {
        name: 'Photon for Lemmy',
        short_name: 'Photon',
        description: 'A lemmy client with a sleek design',
        theme_color: '#000000',
        display: 'standalone',
        icons: [
          {
            src: 'logo_512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'masked any',
          },
        ],
      },
    }),
  ],

  define: {
    __VERSION__: JSON.stringify(process.env.npm_package_version),
  },
})
