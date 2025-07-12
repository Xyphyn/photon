import { profile } from '$lib/auth.svelte'
import { error } from '@sveltejs/kit'

export function load() {
  if (!profile.current.jwt) error(401)
}
