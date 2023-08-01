import { profile } from '$lib/auth.js'
import { getClient } from '$lib/lemmy.js'
import { userSettings } from '$lib/settings.js'
import type { ListingType, SortType } from 'lemmy-js-client'
import { get } from 'svelte/store'

export async function load(req: any) {
  const page = Number(req.url.searchParams.get('page') || 1) || 1

  const sort: SortType =
    (req.url.searchParams.get('sort') as SortType) ||
    get(userSettings).defaultSort.sort

  return {
    sort: sort,
    page: page,
    posts: await getClient().getPosts({
      limit: 40,
      community_name: req.params.name,
      page: page,
      sort: sort,
      auth: get(profile)?.jwt,
    }),
    community: (
      await getClient().getCommunity({
        name: req.params.name,
        auth: get(profile)?.jwt,
      })
    ).community_view,
  }
}
