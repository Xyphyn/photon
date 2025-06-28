<script lang="ts">
  import { browser } from '$app/environment'
  import Post from '$lib/components/lemmy/post/Post.svelte'
  import VirtualList from '$lib/components/render/VirtualList.svelte'
  import EndPlaceholder from '$lib/components/ui/EndPlaceholder.svelte'
  import Placeholder from '$lib/components/ui/Placeholder.svelte'
  import { t } from '$lib/i18n/translations'
  import { client } from '$lib/client/client.svelte'
  import {
    postFeeds,
    type PostFeed,
    type PostFeedID,
  } from '$lib/lemmy/postfeed.svelte'
  import { settings } from '$lib/settings.svelte.js'
  import type { PostView } from 'lemmy-js-client'
  import { Button } from 'mono-svelte'
  import { onMount, untrack } from 'svelte'
  import {
    ArchiveBox,
    ChevronDoubleUp,
    ExclamationTriangle,
    Icon,
    Plus,
  } from 'svelte-hero-icons'
  import InfiniteScroll from 'svelte-infinite-scroll'

  interface Props {
    posts: PostView[]
    community?: boolean
    feedId: PostFeedID
    feedData: PostFeed['data']
    children?: import('svelte').Snippet
  }

  let {
    posts = $bindable(),
    community = false,
    feedId,
    feedData = $bindable(),
    children,
  }: Props = $props()

  let listEl = $state<HTMLUListElement>()
  let listComp = $state<{
    scrollToIndex: (index: number, window?: boolean) => void
  }>()

  let error = $state()
  let loading = $state(false)
  let hasMore = $state(true)

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
        .catch(e => {
          throw new Error(e)
        })

      error = null

      hasMore = newPosts.posts.length != 0

      feedData.cursor.next = newPosts.next_page
      feedData.posts.posts.push(...newPosts.posts)

      postFeeds.value[feedId].data = feedData

      loading = false
    } catch (e) {
      error = e
      loading = false
    }
  }

  const callback: IntersectionObserverCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return

      const element = entry.target as HTMLElement
      const id = element.getAttribute('data-index')

      if (!id) return

      postFeeds.value[feedId].lastSeen = Number(id)

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

    new MutationObserver(mutations => {
      mutations.forEach(({ addedNodes, removedNodes }) => {
        addedNodes.forEach(observePost)
        removedNodes.forEach(unobservePost)
      })
    }).observe(feed, { childList: true, subtree: false })
  })

  $effect(() => {
    if (listComp) {
      untrack(() => {
        if (postFeeds.value[feedId].lastSeen != 0) {
          listComp?.scrollToIndex(postFeeds.value[feedId].lastSeen, true)
        }
      })
    }
  })

  let initialOffset = $derived(listEl?.offsetTop)
</script>

<ul class="flex flex-col list-none" bind:this={listEl}>
  {#key posts}
    {#if posts?.length == 0}
      <div class="h-full grid place-items-center">
        <Placeholder
          icon={ArchiveBox}
          title="No posts"
          description="There are no posts that match this filter."
        >
          <Button href="/communities">
            {#snippet prefix()}
              <Icon src={Plus} size="16" mini />
            {/snippet}
            <span>Follow some communities</span>
          </Button>
        </Placeholder>
      </div>
    {:else}
      <VirtualList
        id="feed"
        class="divide-y -mx-4 sm:-mx-6 divide-slate-200 dark:divide-zinc-900"
        items={posts}
        {initialOffset}
        overscan={1000}
        bind:restore={postFeeds.value[feedId].clientData}
        bind:this={listComp}
      >
        {#snippet item(row)}
          <li
            data-index={row}
            style={row < 7 ? `--anim-delay: ${row * 50}ms` : ''}
            class={[
              'relative post-container px-4 sm:px-6',
              row < 7 && 'pop-in opacity-0',
            ]}
          >
            <Post
              bind:post={posts[row]}
              hideCommunity={community}
              view={(posts[row]?.post.featured_community ||
                posts[row]?.post.featured_local) &&
              settings.posts.compactFeatured
                ? 'compact'
                : settings.view}
              class="transition-all duration-250"
              onhide={() => {
                posts = posts.toSpliced(row, 1)
              }}
            ></Post>
          </li>
        {/snippet}
      </VirtualList>
    {/if}
  {/key}

  {#if settings.infiniteScroll && browser}
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
            community_name: feedData.community_name ?? 'undefined',
          })}
          {#snippet action()}
            <Button color="tertiary">
              {#snippet prefix()}
                <Icon src={ChevronDoubleUp} size="16" micro />
              {/snippet}
              {$t('routes.post.scrollToTop')}
            </Button>
          {/snippet}
        </EndPlaceholder>
      </div>
    {/if}
    <InfiniteScroll window threshold={1000} on:loadMore={loadMore} />
  {/if}
  {@render children?.()}
</ul>

<style lang="postcss">
  @keyframes popIn {
    from {
      transform: translateY(24px);
      opacity: 0;
    }
    to {
      transform: translateY(0px);
      opacity: 1;
    }
  }

  .pop-in {
    animation: popIn 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) forwards
      var(--anim-delay);
  }
</style>
