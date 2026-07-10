import { client } from '$lib/api/client.svelte'
import type { ListingType, SearchResponse, SearchType } from '$lib/api/types'
import { urlParam } from '$lib/app/util/params.js'
import { feed } from '$lib/feature/feeds/feed.svelte.js'

export async function load({ url, fetch, route }) {
  const query = urlParam.string<string>(url, 'q', '')
  const cursor = urlParam.optional(url, 'cursor')
  const community = urlParam.number(url, 'community')
  const creator = urlParam.number(url, 'creator')
  const listing_type = urlParam.string<ListingType>(url, 'listing_type', 'all')
  const type = urlParam.string<SearchType>(url, 'type', 'all')

  const results: SearchResponse = query
    ? await feed(route.id, (params) => client({ func: fetch }).search(params)).load({
        search_term: query,
        community_id: community,
        creator_id: creator,
        limit: type == 'all' ? 2 : 20,
        page_cursor: cursor,
        listing_type: listing_type,
        type_: type,
      })
    : {
        comments: [],
        communities: [],
        multi_communities: [],
        persons: [],
        posts: [],
      }

  return {
    params: {
      type: type,
      next: results.next_page,
      back: results.prev_page,
      query: query,
    },
    results: results,
  }
}
