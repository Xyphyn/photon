import { getClient } from '$lib/lemmy.js'
import { userSettings } from '$lib/settings.js'
import type { ListingType, SortType } from 'lemmy-js-client'
import { get } from 'svelte/store'
import { error } from '@sveltejs/kit'
import { profile } from '$lib/auth.js'
import { feature } from '$lib/version.js'

export async function load({ url, fetch }) {
  const cursor = url.searchParams.get('cursor') as string | undefined
  const page = Number(url.searchParams.get('page') || 1) || 1

  const sort: SortType =
    (url.searchParams.get('sort') as SortType) ||
    get(userSettings).defaultSort.sort
  const listingType: ListingType =
    (url.searchParams.get('type') as ListingType) ||
    get(userSettings).defaultSort.feed

  const posts = await getClient(undefined, fetch).getPosts({
    limit: 20,
    page: page,
    sort: sort,
    type_: listingType,
    page_cursor: cursor
  })

  try {
    return {
      sort: sort,
      listingType: listingType,
      page: page,
      posts: posts,
      next_page: posts.next_page
    }
  } catch (err) {
    throw error(500, {
      message: 'Failed to fetch homepage.',
    })
  }
}
