import { t } from '$lib/i18n/translations.js'
import { postFeed } from '$lib/lemmy/postfeed.svelte.js'
import { settings } from '$lib/settings.svelte'
import type { ListingType, SortType } from 'lemmy-js-client'
import { ChevronDoubleUp } from 'svelte-hero-icons'

export async function load({ url, fetch }) {
  const cursor = url.searchParams.get('cursor') as string | undefined

  const sort: SortType =
    (url.searchParams.get('sort') as SortType) || settings.defaultSort.sort
  const listingType: ListingType =
    (url.searchParams.get('type') as ListingType) || settings.defaultSort.feed

  return {
    feed: await postFeed({
      id: 'main',
      request: {
        page_cursor: cursor,
        sort: sort,
        type_: listingType,
        limit: 20,
        show_hidden: settings.posts.showHidden,
      },
      url: url,
      fetch: fetch,
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
