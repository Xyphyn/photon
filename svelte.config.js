import node from '@sveltejs/adapter-node';
import bun from '@catdadcode/svelte-adapter-bun'
import vercel from '@sveltejs/adapter-vercel'
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: process.env.ADAPTER == 'node' ? node() : process.env.ADAPTER == 'bun' ? bun() : vercel(),
		// csp: {
		// 	directives: {
		// 		'script-src': ['self'],
		// 		'object-src': ['none'],
		// 		'base-uri': ['none']
		// 	},
		// 	mode: 'nonce'
		// }
		
	},
};

export default config;
