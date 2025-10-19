<script lang="ts">
  import { browser } from '$app/environment'
  import { client } from '$lib/api/client.svelte'
  import type { GetPosts, PostView } from '$lib/api/types'
  import { t } from '$lib/app/i18n'
  import VirtualList from '$lib/app/render/VirtualList.svelte'
  import { settings } from '$lib/app/settings.svelte'
  import Placeholder from '$lib/ui/info/Placeholder.svelte'
  import EndPlaceholder from '$lib/ui/layout/EndPlaceholder.svelte'
  import { Button } from 'mono-svelte'
  import { onDestroy, onMount, untrack } from 'svelte'
  import {
    ArchiveBox,
    ArrowTopRightOnSquare,
    ChevronDoubleUp,
    ExclamationTriangle,
    Icon,
  } from 'svelte-hero-icons/dist'
  import InfiniteScroll from 'svelte-infinite-scroll'
  import { expoOut } from 'svelte/easing'
  import { SvelteSet } from 'svelte/reactivity'
  import { fly } from 'svelte/transition'
  import { Post } from '..'

  interface Props {
    posts: PostView[]
    params: GetPosts
    virtualList?: { itemHeights: (number | null)[] }
    lastSeen?: number
    community?: boolean
    children?: import('svelte').Snippet
  }

  let {
    posts = $bindable(),
    params = $bindable(),
    virtualList = $bindable(),
    lastSeen = $bindable(0),
    community = false,
    children,
  }: Props = $props()

  let listEl = $state<HTMLUListElement>()
  let listComp = $state<{
    scrollToIndex: (index: number, window?: boolean) => void
  }>()

  let error = $state()
  let loading = $state(false)
  let hasMore = $state(true)

  const abortLoad = new AbortController()
  let seenIds = new SvelteSet<number>(posts.map((post) => post.post.id))

  async function loadMore() {
    if (!hasMore || loading) return

    try {
      loading = true

      const newPosts = await client({
        func: (input, init) =>
          fetch(input, { ...init, signal: abortLoad.signal }),
      })
        .getPosts(params)
        .catch((e) => {
          throw new Error(e)
        })

      error = null

      hasMore = newPosts.posts.length != 0

      params.page_cursor = newPosts.next_page

      posts.push(
        ...newPosts.posts.filter((post) => {
          if (seenIds.has(post.post.id)) return false
          seenIds.add(post.post.id)
          return true
        }),
      )

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

      lastSeen = Number(id)

      observer.unobserve(element)
    })
  }

  onMount(() => {
    const observer = new IntersectionObserver(callback, {
      threshold: 0.5,
    })

    const observePost = (node: Node) => {
      if (
        node instanceof HTMLElement &&
        node.classList.contains('post-container')
      )
        observer.observe(node)
    }

    const unobservePost = (node: Node) => {
      if (
        node instanceof HTMLElement &&
        node.classList.contains('post-container')
      )
        observer.unobserve(node)
    }

    document.querySelectorAll('.post-container').forEach(observePost)

    const feed = document.getElementById('feed')
    if (!feed) return

    new MutationObserver((mutations) => {
      mutations.forEach(({ addedNodes, removedNodes }) => {
        addedNodes.forEach(observePost)
        removedNodes.forEach(unobservePost)
      })
    }).observe(feed, { childList: true, subtree: false })
  })

  $effect(() => {
    if (listComp) {
      untrack(() => {
        if (lastSeen != 0) {
          listComp?.scrollToIndex(lastSeen, true)
        }
      })
    }
  })

  let initialOffset = $derived(listEl?.offsetTop)

  onDestroy(() => {
    abortLoad?.abort()
  })
</script>

<ul class="flex flex-col list-none" bind:this={listEl}>
  {#key posts}
    {#if posts?.length == 0}
      <div class="h-full grid place-items-center my-8">
        <Placeholder
          icon={ArchiveBox}
          title={$t('routes.frontpage.empty.title')}
          description={$t('routes.frontpage.empty.description')}
        >
          <Button
            href="/communities"
            rounding="pill"
            color="primary"
            icon={ArrowTopRightOnSquare}
          >
            {$t('nav.communities')}
          </Button>
        </Placeholder>
      </div>
    {:else}
      <VirtualList
        id="feed"
        class="divide-y -mx-3 sm:-mx-6 divide-slate-100 dark:divide-zinc-900"
        items={posts}
        {initialOffset}
        overscan={3}
        estimatedHeight={settings.view == 'cozy' ? 500 : 150}
        bind:restore={virtualList}
        bind:this={listComp}
      >
        {#snippet item(row)}
          <li
            in:fly={row < 7
              ? { duration: 800, easing: expoOut, y: 24, delay: row * 50 }
              : { opacity: 1, duration: 0 }}
            data-index={row}
            class={['relative post-container', row < 7 && '']}
          >
            <Post
              bind:post={posts[row]}
              hideCommunity={community}
              view={(posts[row]?.post.featured_community ||
                posts[row]?.post.featured_local) &&
              settings.posts.compactFeatured
                ? 'compact'
                : settings.view}
              onhide={() => {
                posts = posts.toSpliced(row, 1)
              }}
              class="px-3 sm:px-6 hover:bg-slate-100/50 hover:dark:bg-zinc-900/50 transition-colors"
            ></Post>
          </li>
        {/snippet}
      </VirtualList>
    {/if}
  {/key}

  {#if settings.infiniteScroll && browser && posts.length > 0}
    {#if error}
      <div
        class="flex flex-col justify-center items-center
        rounded-xl gap-2 py-8 mt-6
        border border-b! border-red-500! bg-red-500/5 px-4"
      >
        <div class="bg-red-500/30 rounded-full p-3 text-red-500">
          <Icon src={ExclamationTriangle} size="24" solid></Icon>
        </div>
        <pre class="py-0.5">{error}</pre>
        <Button
          color="primary"
          {loading}
          disabled={loading}
          onclick={() => loadMore()}
        >
          {$t('message.retry')}
        </Button>
      </div>
    {:else if hasMore}
      <div class="w-full flex flex-col gap-2 animate-pulse pt-6">
        <div
          class="w-96 max-w-full h-8 bg-slate-100 dark:bg-zinc-800 rounded-md"
        ></div>
        <div class="w-full h-48 bg-slate-100 dark:bg-zinc-800 rounded-md"></div>
        <div class="bg-transparent! h-8 flex justify-between">
          <div class="w-48 h-8 bg-slate-100 dark:bg-zinc-800 rounded-md"></div>
          <div class="w-24 h-8 bg-slate-100 dark:bg-zinc-800 rounded-md"></div>
        </div>
      </div>
    {:else}
      <div style="border-top-width: 0">
        <EndPlaceholder>
          {$t('routes.frontpage.endFeed', {
            community_name: params.community_name ?? 'undefined',
          })}
          {#snippet action()}
            <Button color="tertiary" icon={ChevronDoubleUp}>
              {$t('routes.post.scrollToTop')}
            </Button>
          {/snippet}
        </EndPlaceholder>
      </div>
    {/if}
    <InfiniteScroll window threshold={600} on:loadMore={loadMore} />
  {/if}
  {@render children?.()}
</ul>
