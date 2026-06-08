import { client } from '$lib/api/client.svelte'

export async function load({ fetch, url }) {
  const cursor = url.searchParams.get('cursor') || undefined

  const res = await client({ func: fetch }).listMedia({
    limit: 20,
    page_cursor: cursor,
  })

  return {
    images: res.items,
    params: {
      next: res.next_page,
      prev: res.prev_page,
    },
  }
}
