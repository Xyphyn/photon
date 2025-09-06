import { profile } from '$lib/auth.svelte.js'
import { getClient, site as siteStore } from '$lib/client/lemmy.svelte'
import { error } from '@sveltejs/kit'

export async function load({ fetch }) {
  if (!profile.current.jwt) error(403)
  const site = siteStore

  if (!site.data) {
    const res = await getClient(undefined, fetch).getSite()

    site.data = res
  }

  return {
    site: site.data,
  }
}
