<script lang="ts">
  import type { PostView } from '$lib/api/types'
  import { settings } from '$lib/app/settings.svelte'
  import Placeholder from '$lib/ui/info/Placeholder.svelte'
  import { Button } from 'mono-svelte'
  import type { Snippet } from 'svelte'
  import { ArchiveBox, Plus } from 'svelte-hero-icons/dist'
  import { Post } from '..'
  import {
    parseKeywordFilter,
    parseUrlFilter,
    shouldFilterPost,
    shouldFilterPostByUrl,
  } from '../keywordFilter'

  interface Props {
    posts: PostView[]
    community?: boolean
    children?: Snippet
  }

  let { posts = $bindable(), community = false, children }: Props = $props()

  let keywords = $derived.by(() =>
    parseKeywordFilter(settings.posts.keywordFilter),
  )

  let urlFilters = $derived.by(() =>
    parseUrlFilter(settings.posts.urlFilter),
  )

  let visiblePosts = $derived.by(() =>
    (posts ?? [])
      .map((post, index) => ({ post, index }))
      .filter(
        (entry) =>
          !shouldFilterPost(entry.post, keywords) &&
          !shouldFilterPostByUrl(entry.post, urlFilters),
      ),
  )

  const removePost = (postId: number) => {
    const index = posts.findIndex((post) => post.post.id === postId)
    if (index === -1) return
    posts = posts.toSpliced(index, 1)
  }
</script>

<ul
  class="flex flex-col list-none divide-y divide-slate-200 dark:divide-zinc-800"
>
  {#if visiblePosts.length === 0}
    <div class="h-full grid place-items-center">
      <Placeholder
        icon={ArchiveBox}
        title="No posts"
        description="There are no posts that match this filter."
      >
        <Button href="/communities" icon={Plus}>
          <span>Follow some communities</span>
        </Button>
      </Placeholder>
    </div>
  {:else}
    {#each visiblePosts as entry (entry.post.post.id)}
      <li class="relative post-container">
        <Post
          hideCommunity={community}
          view={(entry.post.post.featured_community ||
            entry.post.post.featured_local) &&
          settings.posts.compactFeatured
            ? 'compact'
            : settings.view}
          post={entry.post}
          class="transition-all duration-250"
          onhide={() => {
            removePost(entry.post.post.id)
          }}
        />
      </li>
    {/each}
  {/if}
  {@render children?.()}
</ul>
