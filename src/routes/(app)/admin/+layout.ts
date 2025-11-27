import { getClient, site } from '$lib/api/client.svelte'
import { profile } from '$lib/app/auth.svelte'
import { error } from '@sveltejs/kit'

export async function load({ fetch }) {
  if (!profile.current.jwt) error(403)
  if (!site.data) {
    const res = await getClient(undefined, fetch).getSite()

    site.data = res
  }

  return {
    site: site.data,
  }
}
