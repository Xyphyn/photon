import { client } from '$lib/client/lemmy.svelte.js'
import type { ListingType, SortType } from '$lib/client/types'
import { t } from '$lib/app/i18n/translations.js'
import { feed } from '$lib/feature/feeds/feed.svelte.js'
import { settings } from '$lib/settings.svelte'
import { ReactiveState, awaitIfServer } from '$lib/util.svelte.js'
import { ChevronDoubleUp } from 'svelte-hero-icons'

export async function load({ url, fetch, route }) {
  const cursor = url.searchParams.get('cursor') as string | undefined

  const sort: SortType =
    (url.searchParams.get('sort') as SortType) || settings.defaultSort.sort
  const listingType: ListingType =
    (url.searchParams.get('type') as ListingType) || settings.defaultSort.feed

  const feedData = feed(route.id, async (params) => {
    const posts = await client({ func: fetch }).getPosts(params)
    return {
      ...posts,
      params: { ...params, page_cursor: posts.next_page },
      client: {},
    }
  }).load({
    page_cursor: cursor,
    sort: sort,
    type_: listingType,
    limit: 20,
    show_hidden: settings.posts.showHidden,
  })

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
