import auto from '@sveltejs/adapter-auto'
import node from '@sveltejs/adapter-node'
import staticAdapter from '@sveltejs/adapter-static'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import bun from 'svelte-adapter-bun-next'

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
            fallback: 'index.html',
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
      'mono-svelte': 'src/lib/ui/shared',
      'svelte-hero-icons': 'node_modules/@xylightdev/svelte-hero-icons',
      $comp: 'src/lib/components',
    },
    csp: {
      directives: {
        'script-src': ['self'],
      },
      // must be specified with either the `report-uri` or `report-to` directives, or both
      reportOnly: {
        'script-src': ['self'],
        'report-uri': ['/'],
      },
    },
    paths: {
      base: '',
      relative: true,
    },
  },
}

export default config
