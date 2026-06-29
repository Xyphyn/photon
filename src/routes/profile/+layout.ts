import { client } from '$lib/api/client.svelte'
import { profile } from '$lib/app/auth'
import { error } from '@sveltejs/kit'

// disable ssr, as the server cannot be authenticated
export const ssr = false

export async function load({ fetch }) {
  if (!profile.current.jwt) error(401)

  const my_user =
    profile.current?.user ?? (await client({ auth: profile.current?.jwt, func: fetch }).getMyUser())

  return my_user
}
