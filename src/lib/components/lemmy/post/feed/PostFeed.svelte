<script lang="ts">
  import Post from '$lib/components/lemmy/post/Post.svelte'
  import Placeholder from '$lib/components/ui/Placeholder.svelte'
  import { settings } from '$lib/settings.svelte.js'
  import type { PostView } from '$lib/client/types'
  import { Button } from 'mono-svelte'
  import type { Snippet } from 'svelte'
  import { ArchiveBox, Icon, Plus } from 'svelte-hero-icons'

  interface Props {
    posts: PostView[]
    community?: boolean
    children?: Snippet
  }

  let { posts = $bindable(), community = false, children }: Props = $props()
</script>

<ul
  class="flex flex-col list-none divide-y divide-slate-200 dark:divide-zinc-800"
>
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
    {#each posts as post, index (post.post.id)}
      <li class="relative post-container">
        <Post
          hideCommunity={community}
          view={(post.post.featured_community || post.post.featured_local) &&
          settings.posts.compactFeatured
            ? 'compact'
            : settings.view}
          {post}
          class="transition-all duration-250"
          onhide={() => {
            posts = posts.toSpliced(index, 1)
          }}
        />
      </li>
    {/each}
  {/if}
  {@render children?.()}
</ul>
