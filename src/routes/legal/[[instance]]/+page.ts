import { getClient, site } from '$lib/lemmy.js'
import { get } from 'svelte/store'

export async function load({ params }) {
  const siteData = params.instance
    ? await getClient(params.instance).getSite()
    : get(site)

  return {
    site: siteData
  }
}