import { profile } from '$lib/app/auth'
import { error } from '@sveltejs/kit'

export function load() {
  if (!profile.current.jwt) error(401)
}
