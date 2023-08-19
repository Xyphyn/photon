import { getClient } from '$lib/lemmy.js'

export async function load({ params, fetch }) {
  const site = await getClient(params.instance, fetch).getSite()

  return site
}
