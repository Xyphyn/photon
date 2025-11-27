import { client } from '$lib/api/client.svelte'
import type { ListingType, SortType } from '$lib/api/types'
import { t } from '$lib/app/i18n'
import { settings } from '$lib/app/settings.svelte'
import { ReactiveState, awaitIfServer } from '$lib/app/util.svelte'
import { feed } from '$lib/feature/feeds/feed.svelte'
import { ChevronDoubleUp } from '@xylightdev/svelte-hero-icons'

export async function load({ url, fetch, route, parent }) {
  const { userHost } = await parent()

  const cursor = url.searchParams.get('cursor') as string | undefined

  const sort: SortType =
    (url.searchParams.get('sort') as SortType) ||
    settings.value.defaultSort.sort
  const listingType: ListingType =
    (url.searchParams.get('type') as ListingType) ||
    settings.value.defaultSort.feed

  const feedData = feed(route.id, async (params) => {
    const posts = await client({
      func: fetch,
      profile: userHost?.profile,
    }).getPosts(params)
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
    show_hidden: userHost.settings.posts.showHidden,
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
