import { client, site } from '$lib/api/client.svelte'
import { profile } from '$lib/app/auth'
import { error } from '@sveltejs/kit'

export async function load({ fetch }) {
  if (!profile.current.jwt) error(403)
  if (!site.data) {
    const res = await client({ func: fetch }).getSite()

    site.data = res
  }

  return {
    site: site.data,
  }
}
