import { env } from '$env/dynamic/public'
import { t } from '$lib/i18n/translations.js'
import { ReactiveState, awaitIfServer } from '$lib/util.svelte.js'
import { settings } from '$lib/settings.svelte'
import type { ListingType, SortType } from '$lib/client/types'
import { ChevronDoubleUp } from 'svelte-hero-icons'
import { feed } from '$lib/lemmy/feeds/feed.svelte.js'
import { client } from '$lib/client/lemmy.svelte.js'

export async function load({ url, fetch, route }) {
  const cursor = url.searchParams.get('cursor') as string | undefined

  const sort: SortType =
    (url.searchParams.get('sort') as SortType) || settings.defaultSort.sort
  const listingType: ListingType =
    (url.searchParams.get('type') as ListingType) || settings.defaultSort.feed

  const feedData = feed(route.id, async (params) => ({
    data: await client({ func: fetch }).getPosts(params),
    params: params,
    client: {},
  })).load({
    page_cursor: cursor,
    sort: sort,
    type_: listingType,
    limit: 20,
    show_hidden: settings.posts.showHidden,
  })

  if (env.PUBLIC_SSR_ENABLED?.toLowerCase() == 'true') await feedData

  return {
    feed: new ReactiveState((await awaitIfServer(feedData)).data),
    filters: new ReactiveState({
      sort: sort,
      type_: listingType,
    }),
    contextual: {
      actions: [
        {
          name: t.get('routes.post.scrollToTop'),
          handle: () => window?.scrollTo({ top: 0, behavior: 'instant' }),
          icon: ChevronDoubleUp,
        },
      ],
    },
  }
}
