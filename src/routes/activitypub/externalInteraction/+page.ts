import { profile } from '$lib/auth.svelte.js'
import { client } from '$lib/client/lemmy.svelte'
import { error, redirect } from '@sveltejs/kit'

export const ssr = false

export async function load({ fetch, url }) {
  const uri = url.searchParams.get('uri')
  if (!uri) error(404)

  if (!profile.current.jwt)
    redirect(302, `/login?ref=${encodeURIComponent(url.toString())}`)

  return {
    resolved: client({ func: fetch }).resolveObject({
      q: uri,
    }),
  }
}
