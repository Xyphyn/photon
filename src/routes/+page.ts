import { getClient } from '$lib/lemmy.js'
import { userSettings } from '$lib/settings.js'
import type { GetPostsResponse, ListingType, SortType } from 'lemmy-js-client'
import { get, writable } from 'svelte/store'
import { error } from '@sveltejs/kit'
import { _posts, shouldReload, type CachedPosts } from './+page.svelte'
import { browser } from '$app/environment'
import { instance } from '$lib/instance'

export async function load({ url, fetch }) {
  const cursor = url.searchParams.get('cursor') as string | undefined
  const prevCursor = url.searchParams.get('prevCursor') as string | undefined
  const page = Number(url.searchParams.get('page')) || undefined

  const settings = get(userSettings)

  const sort: SortType =
    (url.searchParams.get('sort') as SortType) || settings.defaultSort.sort
  const listingType: ListingType =
    (url.searchParams.get('type') as ListingType) || settings.defaultSort.feed

  const cached: CachedPosts | undefined = get(_posts)

  const posts = shouldReload(cached, url.searchParams.toString(), get(instance))
    ? await getClient(undefined, fetch).getPosts({
        limit: 20,
        page: page,
        sort: sort,
        type_: listingType,
        page_cursor: cursor,
        show_hidden: settings.posts.showHidden,
      })
    : cached.data.posts

  if (
    shouldReload(cached, url.searchParams.toString(), get(instance)) &&
    browser
  )
    _posts.set({
      data: {
        sort: sort,
        listingType: listingType,
        page: page || 1,
        posts: posts,
        cursor: {
          next: posts.next_page,
        },
      },
      params: url.searchParams,
      lastSeen: 0,
      instance: get(instance),
    })

  try {
    return shouldReload(cached, url.searchParams.toString(), get(instance))
      ? {
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
      : cached.data
  } catch (err) {
    error(500, {
      message: 'Failed to fetch homepage.',
    })
  }
}
