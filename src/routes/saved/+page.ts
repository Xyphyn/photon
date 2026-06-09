import { client } from '$lib/api/client.svelte'
import type { PersonContentType } from '$lib/api/types'
import { profile } from '$lib/app/auth'
import { urlParam } from '$lib/app/util/params.js'
import { feed } from '$lib/feature/feeds/feed.svelte.js'
import { error } from '@sveltejs/kit'

export async function load({ url, fetch, route }) {
  if (!profile.current.jwt) throw error(401)

  const query = urlParam.optional(url, 'q')
  const cursor = urlParam.optional(url, 'cursor')
  const type = urlParam.string<PersonContentType>(url, 'type', 'all')

  const results = await feed(route.id, (params) =>
    client({ func: fetch }).listPersonSaved(params),
  ).load({
    page_cursor: cursor,
    type_: type,
    limit: 20,
    search_term: query,
  })

  return {
    params: {
      type,
      cursor,
      next: results.next_page,
      prev: results.prev_page,
      query: query,
    },
    items: results.items,
  }
}
