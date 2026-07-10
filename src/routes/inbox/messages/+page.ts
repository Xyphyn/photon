import { client } from '$lib/api/client.svelte'
import { awaitIfServer } from '$lib/app/util.svelte'

export async function load({ fetch, url }) {
  const cursor = url.searchParams.get('cursor') || undefined

  // TODO probably add proper paging
  const messagePromise = client({ func: fetch }).listNotifications({
    limit: 50,
    page_cursor: cursor,
    type_: 'private_message',
  })

  return {
    messages: (await awaitIfServer(messagePromise)).data,
  }
}
