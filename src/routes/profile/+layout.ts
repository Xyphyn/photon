import { profile } from '$lib/auth.svelte'
import { client, getClient } from '$lib/lemmy.js'
import { getItemPublished } from '$lib/lemmy/item.js'
import type { SortType } from 'lemmy-js-client'
import { get } from 'svelte/store'

// disable ssr, as the server cannot be authenticated
export let ssr = false

export async function load({ params, url, fetch }) {
  const my_user =
    // profile?.user ??
    (await client({ auth: profile?.jwt, func: fetch }).getSite()).my_user

  return {
    my_user: my_user,
    community_blocks: my_user?.community_blocks,
    person_blocks: my_user?.person_blocks,
    follows: my_user?.follows,
    moderates: my_user?.moderates,
  }
}
