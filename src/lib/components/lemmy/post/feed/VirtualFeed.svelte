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
    ExclamationTriangle,
    Icon,
    Minus,
    Plus,
  } from 'svelte-hero-icons'
  import { expoOut } from 'svelte/easing'
  import { fly, slide } from 'svelte/transition'
  import { browser } from '$app/environment'
  import { afterUpdate, onMount, tick, type SvelteComponent } from 'svelte'
  import { createWindowVirtualizer } from '@tanstack/svelte-virtual'
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

  export let posts: PostView[]
  export let community: boolean = false
  export let lastSeen: number | undefined = undefined
  export let feedId: PostFeedID

  let combinedPosts = combineCrossposts(posts)
  $: combinedPosts = combineCrossposts(posts)

  const virtualizer = createWindowVirtualizer({
    count: combinedPosts.length,
    estimateSize: () => 150,
  })

  $: if (combinedPosts.length)
    $virtualizer.setOptions({
      count: combinedPosts.length,
    })

  let virtualItemEls: HTMLElement[] = []

  $: items = $virtualizer.getVirtualItems()
  $: {
    if (virtualItemEls.length)
      virtualItemEls.forEach((el) => $virtualizer.measureElement(el))
  }

  afterNavigate(() => {
    $virtualizer.scrollToIndex($postFeeds[feedId].lastSeen ?? 0)
  })

  export let feedData: PostFeed['data']

  const limit = 20
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

      $postFeeds[feedId].lastSeen = Number(id)
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
    >
      <div
        style="position: absolute; top: 0; left: 0; width: 100%; transform: translateY({items?.[0]
          ? items?.[0]?.start
          : 0}px);"
        class="divide-y divide-slate-200 dark:divide-zinc-800"
        id="feed"
      >
        {#each items as row, index (row.index)}
          <li
            in:fly|global={{
              y: -8,
              duration: 300,
              opacity: 0,
              delay: 50 + index * 20,
            }}
            bind:this={virtualItemEls[index]}
            data-index={row.index}
            class="relative post-container"
          >
            {#if combinedPosts[row.index]}
              <Post
                hideCommunity={community}
                view={(combinedPosts[row.index]?.post.featured_community ||
                  combinedPosts[row.index]?.post.featured_local) &&
                $userSettings.posts.compactFeatured
                  ? 'compact'
                  : $userSettings.view}
                post={combinedPosts?.[row.index]}
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
  <slot />
</ul>

<style lang="postcss">
  .skeleton * {
    @apply bg-slate-100 dark:bg-zinc-800 rounded-md;
  }
</style>
