<script lang="ts" context="module">
  export interface CachedPosts {
    data: GetPostsResponse
    params: URLSearchParams
    lastSeen: number
    instance: string
  }

  export const _posts = writable<CachedPosts>(undefined)

  export const shouldReload = (
    cache: CachedPosts | undefined,
    params: string,
    instance: string
  ): boolean =>
    cache?.instance != instance || cache?.params.toString() != params
</script>

<script lang="ts">
  import { page } from '$app/stores'
  import Pageination from '$lib/components/ui/Pageination.svelte'
  import Sort from '$lib/components/lemmy/dropdowns/Sort.svelte'
  import ViewSelect from '$lib/components/lemmy/dropdowns/ViewSelect.svelte'
  import { searchParam } from '$lib/util.js'
  import {
    ChartBar,
    ExclamationCircle,
    ExclamationTriangle,
    GlobeAmericas,
    Icon,
    ServerStack,
  } from 'svelte-hero-icons'
  import { getClient, site } from '$lib/lemmy.js'
  import Location from '$lib/components/lemmy/dropdowns/Location.svelte'
  import Header from '$lib/components/ui/layout/pages/Header.svelte'
  import { t } from '$lib/translations.js'
  import InfiniteScroll from 'svelte-infinite-scroll'
  import { Button, Material, Spinner } from 'mono-svelte'
  import { get, writable } from 'svelte/store'
  import type { GetPostsResponse } from 'lemmy-js-client'
  import { userSettings } from '$lib/settings.js'
  import { afterNavigate } from '$app/navigation'
  import { browser } from '$app/environment'
  import { onMount } from 'svelte'
  import { instance } from '$lib/instance.js'
  import VirtualFeed from '$lib/components/lemmy/post/feed/VirtualFeed.svelte'
  import PostFeed from '$lib/components/lemmy/post/feed/PostFeed.svelte'

  export let data

  const limit = 20
  let hasMore = data.posts.posts.length != 0
  let error: any = undefined
  let loading = false

  async function loadMore() {
    if (!hasMore) return

    try {
      loading = true
      const newPosts = await getClient()
        .getPosts({
          limit: limit,
          page: data.page,
          sort: data.sort,
          type_: data.listingType,
          page_cursor: data.cursor.next,
        })
        .catch((e) => {
          throw new Error(e)
        })

      error = null

      hasMore = newPosts.posts.length != 0

      data.cursor.next = newPosts.next_page
      data.posts.posts = [...data.posts.posts, ...newPosts.posts]

      _posts.update((ps) => ({
        data: data.posts,
        params: ps.params,
        lastSeen: ps.lastSeen,
        instance: ps.instance,
      }))

      loading = false
    } catch (e) {
      error = e
      loading = false
    }
  }

  const callback: IntersectionObserverCallback = (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return

      const element = entry.target as HTMLElement
      const id = element.getAttribute('data-index')

      if (!id) return

      $_posts.lastSeen = Number(id)
      observer.unobserve(element)
    })
  }

  onMount(() => {
    const observer = new IntersectionObserver(callback, {
      root: null,
      rootMargin: '0px',
      threshold: 0.25,
    })

    const elements = document.querySelectorAll('.post-container')
    elements.forEach((el) => observer.observe(el))

    const postContainer = document.querySelector('#feed')
    if (postContainer) {
      const mutationObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach((node) => {
              if (
                node instanceof HTMLElement &&
                node.classList.contains('post-container')
              ) {
                observer.observe(node)
              }
            })
          }
        })
      })

      mutationObserver.observe(postContainer, {
        childList: true,
        subtree: true,
      })
    }
  })
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

  <svelte:component
    this={browser ? VirtualFeed : PostFeed}
    posts={data.posts.posts}
  >
    {#if $userSettings.infiniteScroll && browser}
      {#if error}
        <div
          class="flex flex-col justify-center items-center
           rounded-xl gap-2 py-8 mt-6
          border !border-b !border-red-500 bg-red-500/5"
        >
          <div class="bg-red-500/30 rounded-full p-3 text-red-500">
            <Icon src={ExclamationTriangle} size="24" solid></Icon>
          </div>
          <pre class="py-0.5">{error}</pre>
          <Button
            color="primary"
            {loading}
            disabled={loading}
            on:click={loadMore}
          >
            {$t('message.retry')}
          </Button>
        </div>
      {:else if hasMore}
        <div class="w-full flex flex-col skeleton gap-2 animate-pulse pt-6">
          <div class="w-96 h-8"></div>
          <div class="w-full h-48"></div>
          <div class="!bg-transparent h-8 flex justify-between">
            <div class="w-48 h-8"></div>
            <div class="w-24 h-8"></div>
          </div>
        </div>
      {/if}
      <InfiniteScroll window threshold={1000} on:loadMore={loadMore} />
    {/if}
  </svelte:component>
  <svelte:element
    this={$userSettings.infiniteScroll ? 'noscript' : 'div'}
    class="mt-auto"
  >
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
  </svelte:element>
</div>

<style lang="postcss">
  .skeleton * {
    @apply bg-slate-100 dark:bg-zinc-800 rounded-md;
  }
</style>
