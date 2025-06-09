import { getClient, site as siteStore } from '$lib/lemmy.svelte.js'

export async function load({ fetch }) {
  const site = siteStore

  if (!site.data) {
    const res = await getClient(undefined, fetch).getSite()

    site.data = res
  }

  return {
    site: site.data,
  }
}
