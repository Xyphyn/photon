<script lang="ts">
  import Post from '$lib/components/lemmy/post/Post.svelte'
  import Placeholder from '$lib/components/ui/Placeholder.svelte'
  import { userSettings } from '$lib/settings.js'
  import type {
    GetPostsResponse,
    ListingType,
    PostView,
    SortType,
  } from 'lemmy-js-client'
  import { Badge, Button } from 'mono-svelte'
  import {
    ArchiveBox,
    ChevronDoubleUp,
    ExclamationTriangle,
    Icon,
    Minus,
    Plus,
  } from 'svelte-hero-icons'
  import { expoOut } from 'svelte/easing'
  import { fly, slide } from 'svelte/transition'
  import { browser } from '$app/environment'
  import { afterUpdate, onMount, tick, type SvelteComponent } from 'svelte'
  import {
    createVirtualizer,
    createWindowVirtualizer,
    type SvelteVirtualizer,
  } from '@tanstack/svelte-virtual'
  import { afterNavigate, beforeNavigate } from '$app/navigation'
  import { combineCrossposts } from './crosspost'
  import { client } from '$lib/lemmy'
  import {
    postFeeds,
    type PostFeed,
    type PostFeedID,
  } from '$lib/lemmy/postfeed'
  import { t } from '$lib/translations'
  import InfiniteScroll from 'svelte-infinite-scroll'
  import type { Readable } from 'svelte/motion'
  import EndPlaceholder from '$lib/components/ui/EndPlaceholder.svelte'

  export let posts: PostView[]
  export let community: boolean = false
  export let feedId: PostFeedID

  let virtualItemEls: HTMLElement[] = []
  let virtualListEl: HTMLElement | undefined = undefined

  const virtualizer = createWindowVirtualizer({
    count: posts.length,
    estimateSize: () => 150,
  })

  $: items = $virtualizer.getVirtualItems()
  $: {
    if (virtualItemEls.length)
      virtualItemEls.forEach((el) => $virtualizer.measureElement(el))
  }

  $: if (posts.length && virtualListEl)
    $virtualizer.setOptions({
      scrollMargin: virtualListEl?.offsetTop,
      count: posts.length,
    })

  afterNavigate(() => {
    $virtualizer.scrollToIndex($postFeeds[feedId]?.lastSeen ?? 0)
  })

  export let feedData: PostFeed['data']

  let error: any = undefined
  let loading = false
  let hasMore = true

  async function loadMore() {
    if (!hasMore || loading) return

    try {
      loading = true

      const newPosts = await client()
        .getPosts({
          page_cursor: feedData.cursor.next,
          disliked_only: feedData.disliked_only,
          liked_only: feedData.liked_only,
          community_id: feedData.community_id,
          community_name: feedData.community_name,
          limit: feedData.limit,
          page: feedData.page,
          saved_only: feedData.saved_only,
          show_hidden: feedData.show_hidden,
          sort: feedData.sort,
          type_: feedData.type_,
        })
        .catch((e) => {
          throw new Error(e)
        })

      error = null

      hasMore = newPosts.posts.length != 0

      feedData.cursor.next = newPosts.next_page
      feedData.posts.posts = [...feedData.posts.posts, ...newPosts.posts]

      postFeeds.updateFeed(feedId, {
        data: feedData,
      })

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

      postFeeds.updateFeed(feedId, {
        lastSeen: Number(id),
      })
      observer.unobserve(element)
    })
  }

  onMount(() => {
    const observer = new IntersectionObserver(callback, {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
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
            mutation.removedNodes.forEach((node) => {
              if (
                node instanceof HTMLElement &&
                node.classList.contains('post-container')
              ) {
                observer.unobserve(node)
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

  onMount(async () => {
    await tick()
    $virtualizer.measure()
  })
</script>

<ul
  class="flex flex-col list-none {$userSettings.view == 'card'
    ? 'gap-3 md:gap-4'
    : 'divide-y'} divide-slate-200 dark:divide-zinc-800"
  style={$userSettings.leftAlign
    ? `--template-areas: 
'media meta'
'media title'
'media body'
'embed embed'
'actions actions'; --template-columns: auto 1fr;`
    : ``}
>
  {#if posts?.length == 0}
    <div class="h-full grid place-items-center">
      <Placeholder
        icon={ArchiveBox}
        title="No posts"
        description="There are no posts that match this filter."
      >
        <Button href="/communities">
          <Icon src={Plus} size="16" mini slot="prefix" />
          <span>Follow some communities</span>
        </Button>
      </Placeholder>
    </div>
  {:else}
    <div
      style="position:relative; height: {browser
        ? `${$virtualizer.getTotalSize()}px`
        : '100%'}; width: 100%;"
      bind:this={virtualListEl}
    >
      <div
        style="position: absolute; top: 0; left: 0; width: 100%; transform: translateY({items?.[0]
          ? items?.[0]?.start - $virtualizer.options.scrollMargin
          : 0}px);"
        class="divide-y divide-slate-200 dark:divide-zinc-800"
        id="feed"
      >
        {#each items as row, index (row.index)}
          <li
            bind:this={virtualItemEls[index]}
            data-index={row.index}
            class="relative post-container"
            in:fly={{ y: -16, easing: expoOut, duration: 500, opacity: 0 }}
          >
            {#if posts[row.index]}
              <Post
                hideCommunity={community}
                view={(posts[row.index]?.post.featured_community ||
                  posts[row.index]?.post.featured_local) &&
                $userSettings.posts.compactFeatured
                  ? 'compact'
                  : $userSettings.view}
                post={posts?.[row.index]}
                class="transition-all duration-250"
                on:hide={() => {
                  posts = posts.toSpliced(row.index, 1)
                }}
              ></Post>
            {/if}
          </li>
        {/each}
      </div>
    </div>
  {/if}

  {#if $userSettings.infiniteScroll && browser}
    {#if error}
      <div
        class="flex flex-col justify-center items-center
        rounded-xl gap-2 py-8 mt-6
        border !border-b !border-red-500 bg-red-500/5 px-4"
      >
        <div class="bg-red-500/30 rounded-full p-3 text-red-500">
          <Icon src={ExclamationTriangle} size="24" solid></Icon>
        </div>
        <pre class="py-0.5">{error}</pre>
        <Button
          color="primary"
          {loading}
          disabled={loading}
          on:click={() => loadMore()}
        >
          {$t('message.retry')}
        </Button>
      </div>
    {:else if hasMore}
      <div class="w-full flex flex-col skeleton gap-2 animate-pulse pt-6">
        <div class="w-96 max-w-full h-8"></div>
        <div class="w-full h-48"></div>
        <div class="!bg-transparent h-8 flex justify-between">
          <div class="w-48 h-8"></div>
          <div class="w-24 h-8"></div>
        </div>
      </div>
    {:else}
      <div style="border-top-width: 0">
        <EndPlaceholder>
          {$t('routes.frontpage.endFeed', {
            // @ts-ignore
            community_name: feedData.community_name ?? 'undefined',
          })}
          <Button slot="action" color="tertiary">
            <Icon src={ChevronDoubleUp} size="16" micro slot="prefix" />
            {$t('routes.post.scrollToTop')}
          </Button>
        </EndPlaceholder>
      </div>
    {/if}
    <InfiniteScroll window threshold={1000} on:loadMore={loadMore} />
  {/if}
  <slot />
</ul>

<style lang="postcss">
  .skeleton * {
    @apply bg-slate-100 dark:bg-zinc-800 rounded-md;
  }

  @keyframes popIn {
    from {
      transform: translateY(-24px);
      opacity: 0;
    }
    to {
      transform: translateY(0px);
      opacity: 1;
    }
  }

  .pop-in {
    animation: popIn 500ms cubic-bezier(0.075, 0.82, 0.165, 1) forwards;
  }
</style>
