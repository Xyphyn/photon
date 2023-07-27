import { authData, getClient } from '$lib/lemmy.js'
import { getItemPublished } from '$lib/lemmy/item.js'
import type {
  CommentView,
  CommunityView,
  PersonView,
  PostView,
  SearchResponse,
  SearchType,
  SortType,
} from 'lemmy-js-client'
import { get } from 'svelte/store'

export async function load({ url }) {
  const query = url.searchParams.get('q')
  const page = Number(url.searchParams.get('page')) || 1
  const community = url.searchParams.get('community_name')
  const sort = url.searchParams.get('sort')
  const type = url.searchParams.get('type')

  if (query) {
    const results = await getClient().search({
      q: query,
      auth: get(authData)?.token,
      community_name: community ?? undefined,
      limit: 40,
      page: page,
      sort: (sort as SortType) || 'New',
      listing_type: 'All',
      type_: (type as SearchType) ?? 'All',
    })

    const [posts, comments, users, communities] = [
      results.posts,
      results.comments,
      results.users,
      results.communities,
    ]

    const everything = [...posts, ...comments, ...users, ...communities].sort(
      (a, b) =>
        Date.parse(getItemPublished(b)) - Date.parse(getItemPublished(a))
    )

    return {
      page: page,
      results: everything,
    }
  }

  return {
    page: 1,
  }
}
