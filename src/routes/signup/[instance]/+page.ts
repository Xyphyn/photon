import { getClient } from '$lib/client/client.svelte.js'

export async function load({ params, fetch }) {
  const site = await getClient(params.instance, fetch).getSite()

  return site
}
