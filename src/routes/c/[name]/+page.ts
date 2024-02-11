import { client } from '$lib/lemmy.js'
import { userSettings } from '$lib/settings.js'
import type { SortType } from 'lemmy-js-client'
import { get } from 'svelte/store'

export async function load({ params, fetch, url }) {
  const cursor: string | undefined = url.searchParams.get('cursor') as
    | string
    | undefined
  const page = Number(url.searchParams.get('page')) || undefined

  const sort: SortType =
    (url.searchParams.get('sort') as SortType) ||
    get(userSettings).defaultSort.sort

  return {
    sort: sort,
    page: page || 1,
    posts: await client({ func: fetch }).getPosts({
      limit: 40,
      community_name: params.name,
      page: page,
      sort: sort,
      page_cursor: cursor,
    }),
  }
}
