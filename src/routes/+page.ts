import { client } from '$lib/api/client.svelte'
import type { ListingType, PostSortType } from '$lib/api/types'
import { t } from '$lib/app/i18n'
import { settings } from '$lib/app/settings.svelte'
import { awaitIfServer } from '$lib/app/util.svelte'
import { urlParam } from '$lib/app/util/params.js'
import { feed } from '$lib/feature/feeds/feed.svelte'
import { ChevronDoubleUp } from '@xylightdev/svelte-hero-icons'

export async function load({ url, fetch, route }) {
  const cursor = urlParam.optional(url, 'cursor')

  const sort = urlParam.string<PostSortType>(url, 'sort', settings.defaultSort.sort)
  const type = urlParam.string<ListingType>(url, 'type', settings.defaultSort.feed)
  const period = urlParam.number(url, 'period')

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
    type_: type,
    limit: 20,
    show_hidden: settings.posts.showHidden,
    time_range_seconds: period,
  })

  return {
    feed: (await awaitIfServer(feedData)).data,
    params: {
      sort: sort,
      type_: type,
      period: period,
    },
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
