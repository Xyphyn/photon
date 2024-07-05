import { getClient } from '$lib/lemmy.js'
import { userSettings } from '$lib/settings.js'
import type { GetPostsResponse, ListingType, SortType } from 'lemmy-js-client'
import { get, writable } from 'svelte/store'
import { error } from '@sveltejs/kit'
import { _posts } from './+page.svelte'
import { browser } from '$app/environment'

export async function load({ url, fetch }) {
  const cursor = url.searchParams.get('cursor') as string | undefined
  const prevCursor = url.searchParams.get('prevCursor') as string | undefined
  const page = Number(url.searchParams.get('page')) || undefined

  const settings = get(userSettings)

  const sort: SortType =
    (url.searchParams.get('sort') as SortType) || settings.defaultSort.sort
  const listingType: ListingType =
    (url.searchParams.get('type') as ListingType) || settings.defaultSort.feed

  const cached = get(_posts)

  const posts =
    cached && url.searchParams.toString() == cached.params.toString()
      ? cached.data
      : await getClient(undefined, fetch).getPosts({
          limit: 20,
          page: page,
          sort: sort,
          type_: listingType,
          page_cursor: cursor,
          show_hidden: settings.posts.showHidden,
        })

  if (
    !(cached && url.searchParams.toString() == cached.params.toString()) &&
    browser
  )
    _posts.set({ data: posts, params: url.searchParams, lastSeen: 0 })

  try {
    return {
      sort: sort,
      listingType: listingType,
      page: page || 1,
      posts: posts,
      cursor: {
        next: posts.next_page,
        back: prevCursor,
        current: cursor,
      },
    }
  } catch (err) {
    error(500, {
      message: 'Failed to fetch homepage.',
    })
  }
}
