import { client } from '$lib/api/client.svelte.js'
import { profile } from '$lib/app/auth'
import { urlParam } from '$lib/app/util/params.js'
import { error } from '@sveltejs/kit'
import type { NotificationTypeFilter } from 'lemmy-js-client'

export async function load({ url, fetch }) {
  if (!profile.current.jwt) error(401)

  const type = urlParam.string<NotificationTypeFilter>(url, 'type', 'all')
  const cursor = urlParam.optional(url, 'cursor')
  const unreadOnly = urlParam.bool(url, 'unreadOnly', false)

  const inbox = await client({ func: fetch }).listNotifications({
    limit: 20,
    page_cursor: cursor,
    unread_only: unreadOnly,
    type_: type,
  })

  return {
    params: {
      unreadOnly: unreadOnly,
      type: type,
      cursor: cursor,
      next: inbox.next_page,
      prev: inbox.prev_page,
    },
    inbox: inbox,
    limit: 20,
  }
}
