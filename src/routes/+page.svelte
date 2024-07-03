<script lang="ts" context="module">
  export const _posts = writable<{
    data: GetPostsResponse
    params: URLSearchParams
  }>(undefined)
</script>

<script lang="ts">
  import { page } from '$app/stores'
  import Pageination from '$lib/components/ui/Pageination.svelte'
  import Sort from '$lib/components/lemmy/dropdowns/Sort.svelte'
  import ViewSelect from '$lib/components/lemmy/dropdowns/ViewSelect.svelte'
  import { searchParam } from '$lib/util.js'
  import PostFeed from '$lib/components/lemmy/post/PostFeed.svelte'
  import { ChartBar, GlobeAmericas, Icon, ServerStack } from 'svelte-hero-icons'
  import { getClient, site } from '$lib/lemmy.js'
  import Location from '$lib/components/lemmy/dropdowns/Location.svelte'
  import Header from '$lib/components/ui/layout/pages/Header.svelte'
  import { t } from '$lib/translations.js'
  import InfiniteScroll from 'svelte-infinite-scroll'
  import { Spinner } from 'mono-svelte'
  import { writable } from 'svelte/store'
  import type { GetPostsResponse } from 'lemmy-js-client'

  export let data

  const limit = 20
  let hasMore = data.posts.posts.length == limit

  async function loadMore() {
    if (!hasMore) return

    const newPosts = await getClient().getPosts({
      limit: limit,
      page: data.page,
      sort: data.sort,
      type_: data.listingType,
      page_cursor: data.cursor.next,
    })

    hasMore = newPosts.posts.length == limit

    console.log(hasMore)

    data.cursor.next = newPosts.next_page
    data.posts.posts = [...data.posts.posts, ...newPosts.posts]

    _posts.set({ data: data.posts, params: $page.url.searchParams })
  }
</script>

<div class="flex flex-col gap-4 max-w-full w-full min-w-0">
  <header>
    <Header>{$t('routes.frontpage.title')}</Header>
  </header>
  <div class="flex items-center gap-2">
    <Location changeDefault selected={data.listingType} />
    <Sort changeDefault selected={data.sort} />
    <div class="max-[420px]:hidden">
      <ViewSelect />
    </div>
  </div>

  <PostFeed posts={data.posts.posts}>
    {#if hasMore}
      <div class="w-full flex flex-col skeleton gap-2 animate-pulse pt-6">
        <div class="w-96 h-8"></div>
        <div class="w-full h-48"></div>
        <div class="!bg-transparent h-8 flex justify-between">
          <div class="w-48 h-8"></div>
          <div class="w-24 h-8"></div>
        </div>
      </div>
    {/if}
    <InfiniteScroll window threshold={750} on:loadMore={loadMore} />
  </PostFeed>
  <div class="mt-auto">
    <Pageination
      page={data.page}
      cursor={{ next: data.cursor.next, back: data.cursor.back }}
      on:change={(p) => searchParam($page.url, 'page', p.detail.toString())}
      on:cursor={(c) => {
        searchParam($page.url, 'cursor', c.detail)
      }}
    >
      <span class="flex flex-row items-center gap-1">
        <Icon src={ChartBar} size="16" mini />
        {$t('routes.frontpage.footer', {
          // @ts-ignore
          users: $site?.site_view.counts.users_active_day ?? '??',
        })}
      </span>
    </Pageination>
  </div>
</div>

<style lang="postcss">
  .skeleton * {
    @apply bg-slate-100 dark:bg-zinc-800 rounded-md;
  }
</style>
