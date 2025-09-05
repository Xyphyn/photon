import { profile } from '$lib/auth.svelte'
import { client, getClient } from '$lib/client/lemmy.svelte'
import { PiefedClient } from '$lib/client/piefed/piefed.js'
import { getItemPublished } from '$lib/lemmy/item.js'
import { ReactiveState } from '$lib/promise.svelte.js'
import type { ListingType, SearchType, SortType } from 'lemmy-js-client'

export async function load({ url, fetch }) {
  const query = url.searchParams.get('q')
  const page = Number(url.searchParams.get('page')) || 1
  const community = Number(url.searchParams.get('community')) || undefined
  const sort = url.searchParams.get('sort') || 'New'
  const type =
    url.searchParams.get('type') ||
    (client() instanceof PiefedClient ? 'Posts' : 'All')
  const listing_type =
    (url.searchParams.get('listing_type') as ListingType) || 'All'

  if (query) {
    const results = await client({ func: fetch }).search({
      q: query,
      community_id: community ?? undefined,
      limit: 20,
      page: page,
      sort: (sort as SortType) || 'TopAll',
      listing_type: listing_type,
      type_: type as SearchType,
    })

    const [posts, comments, users, communities] = [
      results.posts,
      results.comments,
      results.users,
      results.communities,
    ]

    const everything = [...posts, ...comments, ...users, ...communities]

    if (sort == 'New') {
      everything.sort(
        (a, b) =>
          new Date(getItemPublished(b)).getTime() -
          new Date(getItemPublished(a)).getTime(),
      )
    }

    return {
      filters: new ReactiveState({
        type: type,
        sort: sort,
        page: page,
        query: query,
      })!,
      results: new ReactiveState(everything),
      streamed: {
        object: profile.current?.jwt
          ? getClient(undefined, fetch).resolveObject({
              q: query,
            })
          : undefined,
      },
    }
  }

  return {
    filters: new ReactiveState({
      page: 1,
      sort: sort,
      type: type,
      query: query,
    }),
  }
}
