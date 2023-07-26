import { authData, getClient } from '$lib/lemmy.js'
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

function getSearchItemPublished(
  item: PostView | CommentView | PersonView | CommunityView
) {
  if ('comment' in item) {
    return item.comment.published
  } else if ('post' in item) {
    return item.post.published
  }

  if ('person' in item) {
    return item.person.published
  }

  if ('community' in item) {
    return item.community.published
  }

  return ''
}

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
        Date.parse(getSearchItemPublished(b)) -
        Date.parse(getSearchItemPublished(a))
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
