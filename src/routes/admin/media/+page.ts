import { client } from '$lib/api/client.svelte'
import { urlParam } from '$lib/app/util/params'

export async function load({ fetch, url }) {
  const cursor = urlParam.optional(url, 'cursor')

  const res = await client({ func: fetch }).adminListMedia({
    limit: 20,
    page_cursor: cursor,
  })

  return {
    images: res.items,
    next: res.next_page,
    prev: res.prev_page,
  }
}
