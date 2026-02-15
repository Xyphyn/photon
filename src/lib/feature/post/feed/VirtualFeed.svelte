<script lang="ts">
  import { browser } from '$app/environment'
  import { client, site } from '$lib/api/client.svelte'
  import type { GetPosts, PostView } from '$lib/api/types'
  import { errorMessage } from '$lib/app/error'
  import { t } from '$lib/app/i18n'
  import VirtualList from '$lib/app/render/VirtualList.svelte'
  import { settings } from '$lib/app/settings.svelte'
  import Placeholder from '$lib/ui/info/Placeholder.svelte'
  import EndPlaceholder from '$lib/ui/layout/EndPlaceholder.svelte'
  import { Button, Material, Spinner } from 'mono-svelte'
  import { onDestroy, onMount, untrack } from 'svelte'
  import {
    ArchiveBox,
    ArrowsPointingOut,
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
  import { filterPost, type FilteredItem } from '../filters.svelte'
  import { ReactiveState } from '$lib/app/util.svelte'

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

  let filteredPosts: FilteredItem[] = $derived(
    posts.map((post) => ({
      id: post.post.id,
      action: filterPost(post),
    })),
  )

  let listEl = $state<HTMLUListElement>()
  let listComp = $state<{
    scrollToIndex: (index: number, window?: boolean) => void
    rerender: () => void
  }>()

  let error = $state()
  let loading = $state(false)
  let hasMore = $state(false)
  let feedKey = $state('')

  const abortLoad = new AbortController()
  let seenIds = new SvelteSet<number>(posts.map((post) => post.post.id))

  const removePost = (postId: number) => {
    const index = posts.findIndex((post) => post.post.id === postId)
    if (index === -1) return
    posts = posts.toSpliced(index, 1)
  }

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

      hasMore = !!newPosts.next_page

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

  $effect(() => {
    const limit = params?.limit ?? 20
    const nextKey = JSON.stringify({
      ...params,
      page_cursor: undefined,
      page: undefined,
    })

    if (nextKey !== feedKey) {
      feedKey = nextKey
      seenIds = new SvelteSet<number>(posts.map((post) => post.post.id))
      hasMore = posts.length >= limit
    }
  })

  let initialOffset = $derived(listEl?.offsetTop)

  onDestroy(() => {
    abortLoad?.abort()
  })
</script>

<ul class="flex flex-col list-none" bind:this={listEl}>
  {#key posts}
    {#if posts.length == 0}
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
          <!--god svelte is gonna make me lose it-->
          {@const filter = new ReactiveState(filteredPosts[row])}
          <li
            in:fly={row < 7
              ? { duration: 800, easing: expoOut, y: 24, delay: row * 50 }
              : { opacity: 1, duration: 0 }}
            data-index={row}
            class={[
              'relative post-container',
              filter.value.action == 'hide' && 'hidden',
              row < 7 && '',
            ]}
          >
            <!--TODO make my component isolation not abysmal-->
            {#if filter.value.action == 'none'}
              <Post
                bind:post={posts[row]}
                hideCommunity={community}
                view={(posts[row].post.featured_community ||
                  posts[row].post.featured_local) &&
                settings.posts.compactFeatured
                  ? 'compact'
                  : settings.view}
                onhide={() => removePost(posts[row].post.id)}
                class="px-3 sm:px-6 hover:bg-slate-100/30 hover:dark:bg-zinc-900/30 transition-colors"
              ></Post>
            {:else if filter.value.action == 'minimize'}
              <Button
                onclick={() => {
                  filteredPosts[row].action = 'none'
                  filter.value.action = 'none'
                  listComp?.rerender()
                }}
                color="tertiary"
                rounding="none"
                icon={ArrowsPointingOut}
                class="text-slate-400 dark:text-zinc-600 w-full"
                size="xs"
              >
                {$t('settings.lemmy.contentFilter.minimized')}
              </Button>
            {/if}
          </li>
        {/snippet}
      </VirtualList>
    {/if}
  {/key}

  {#if settings.infiniteScroll && browser && posts.length > 0}
    {#if error}
      <Material color="error" class="flex flex-col gap-4">
        <div>
          <Icon
            src={ExclamationTriangle}
            size="20"
            micro
            class="inline-block rounded-lg clear-both float-left mr-2"
          />
          {errorMessage(error)}
        </div>
        <Button
          color="primary"
          {loading}
          disabled={loading}
          onclick={() => loadMore()}
        >
          {$t('message.retry')}
        </Button>
      </Material>
    {:else if loading}
      <div class="w-full h-32 grid place-items-center">
        <Spinner width={24} />
      </div>
    {:else}
      <div style="border-top-width: 0">
        <EndPlaceholder>
          {$t('routes.frontpage.endFeed', {
            community_name:
              params.community_name ??
              site.data?.site_view?.site?.name ??
              'Lemmy. There are no more posts. You saw them all', // TODO: This should be translated
          })}
          {#snippet action()}
            <Button color="tertiary" icon={ChevronDoubleUp}>
              {$t('routes.post.scrollToTop')}
            </Button>
          {/snippet}
        </EndPlaceholder>
      </div>
    {/if}
    <InfiniteScroll window threshold={300} on:loadMore={loadMore} />
  {/if}
  {@render children?.()}
</ul>
