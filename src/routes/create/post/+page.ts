import { profile } from '$lib/auth.svelte.js'
import { redirect } from '@sveltejs/kit'

export const load = ({ url }) => {
  if (!profile.current.jwt) redirect(302, '/login')

  return { crosspost: Boolean(url.searchParams.get('crosspost')) }
}
