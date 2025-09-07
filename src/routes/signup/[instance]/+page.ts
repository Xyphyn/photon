import { getClient } from '$lib/client/lemmy.svelte'

export async function load({ params, fetch }) {
  const site = await getClient(params.instance, fetch).getSite()

  return site
}
