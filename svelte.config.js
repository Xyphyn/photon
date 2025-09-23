import node from '@sveltejs/adapter-node'
import bun from 'svelte-adapter-bun-next'
import auto from '@sveltejs/adapter-auto'
import staticAdapter from '@sveltejs/adapter-static'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: vitePreprocess(),

  kit: {
    // adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
    // If your environment is not supported or you settled on a specific environment, switch out the adapter.
    // See https://kit.svelte.dev/docs/adapters for more information about adapters.
    adapter:
      process.env.ADAPTER == 'static'
        ? staticAdapter({
            fallback: 'app.html',
            precompress: true,
          })
        : process.env.ADAPTER == 'node'
          ? node()
          : process.env.ADAPTER == 'bun'
            ? bun({
                out: 'build',
                precompress: {
                  brotli: true,
                  gzip: true,
                },
              })
            : auto(),
    alias: {
      'mono-svelte': 'src/lib/mono',
      'svelte-hero-icons': 'node_modules/@xylightdev/svelte-hero-icons',
      $comp: 'src/lib/components',
    },
  },
}

export default config
