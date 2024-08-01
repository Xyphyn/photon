import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig, type PluginOption } from 'vite'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [sveltekit(), visualizer({}) as PluginOption],

  define: {
    __VERSION__: JSON.stringify(process.env.npm_package_version),
  },
})
