import { profile } from '$lib/auth.js'
import { getClient } from '$lib/lemmy.js'
import { getItemPublished } from '$lib/lemmy/item.js'
import type { SortType } from 'lemmy-js-client'
import { get } from 'svelte/store'

export async function load({ params, url, fetch }) {
  const my_user = (await getClient().getSite()).my_user

  return {
    my_user: my_user,
    community_blocks: my_user?.community_blocks,
    person_blocks: my_user?.person_blocks,
  }
}
