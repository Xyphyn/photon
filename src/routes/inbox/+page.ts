import { client } from '$lib/api/client.svelte.js'
import { profile } from '$lib/app/auth'
import { ReactiveState } from '$lib/app/util.svelte'
import { error } from '@sveltejs/kit'
import type { NotificationTypeFilter } from 'lemmy-js-client'

export async function load({ url, fetch }) {
  if (!profile.current.jwt) error(401)

  const type: NotificationTypeFilter =
    (url.searchParams.get('type') as NotificationTypeFilter) || 'all'
  const cursor = url.searchParams.get('cursor') || undefined
  const unreadOnly: boolean = (url.searchParams.get('unreadOnly') || 'false') == 'true'

  const inbox = await client({ func: fetch }).listNotifications({
    limit: 20,
    page_cursor: cursor,
    unread_only: unreadOnly,
    type_: type,
  })

  return {
    params: new ReactiveState({
      unreadOnly: unreadOnly,
      type: type,
      cursor: cursor,
      next: inbox.next_page,
      prev: inbox.prev_page,
    }),
    inbox: inbox,
    limit: 20,
  }
}
