import { profile } from '$lib/auth.svelte'
import { error } from '@sveltejs/kit'

export function load() {
  if (!profile.data.jwt) error(401)
}
