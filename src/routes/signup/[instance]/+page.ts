import { getClient } from '$lib/api/client.svelte'

export async function load({ params, fetch }) {
  const site = await getClient(params.instance, fetch).getSite()

  return site
}
