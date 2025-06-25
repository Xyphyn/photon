import { profile } from '$lib/auth.svelte'
import { client } from '$lib/lemmy.svelte.js'
import { error } from '@sveltejs/kit'

// disable ssr, as the server cannot be authenticated
export const ssr = false

export async function load({ fetch }) {
  if (!profile.data.jwt) error(401)

  const my_user =
    // profile.data?.user ??
    (await client({ auth: profile.data?.jwt, func: fetch }).getSite()).my_user

  return {
    my_user: my_user,
    community_blocks: my_user?.community_blocks,
    person_blocks: my_user?.person_blocks,
    follows: my_user?.follows,
    moderates: my_user?.moderates,
  }
}
