import { client } from '$lib/api/client.svelte'
import { urlParam } from '$lib/app/util/params'

export async function load({ fetch, url }) {
  const cursor = urlParam.optional(url, 'cursor')
  const type = urlParam.string(url, 'type', 'unread')

  const res = await client({ func: fetch }).listRegistrationApplications({
    page_cursor: cursor,
    limit: 40,
    unread_only: type == 'unread',
  })

  return {
    params: {
      next: res.next_page,
      prev: res.prev_page,
      type: type,
    },
    applications: res.items,
  }
}
