import { client } from '$lib/api/client.svelte'
import { SvelteURL } from 'svelte/reactivity'

export async function load({ params, fetch }) {
  const site = await client({ instanceURL: params.instance, func: fetch}).getSite()

  return {...site, instance: new SvelteURL(site.site_view.site.actor_id).hostname}
}
