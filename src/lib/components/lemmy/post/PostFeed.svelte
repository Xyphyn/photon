<script lang="ts">
  import Button from '$lib/components/input/Button.svelte'
  import Post from '$lib/components/lemmy/post/Post.svelte'
  import Placeholder from '$lib/components/ui/Placeholder.svelte'
  import { userSettings } from '$lib/settings.js'
  import type { PostView } from 'lemmy-js-client'
  import { ArchiveBox, Icon, Plus } from 'svelte-hero-icons'
  import { fly } from 'svelte/transition'

  export let posts: PostView[]
</script>

<div
  class="flex flex-col {!$userSettings.showCompactPosts
    ? 'gap-3 md:gap-4'
    : ''} divide-slate-200 dark:divide-zinc-800"
  class:divide-y={$userSettings.showCompactPosts}
>
  {#if posts.length == 0}
    <div class="h-full grid place-items-center">
      <Placeholder
        icon={ArchiveBox}
        title="No posts"
        description="There are no posts that match this filter."
      >
        <Button href="/communities">
          <Icon src={Plus} size="16" mini slot="icon" />
          <span>Follow some communities</span>
        </Button>
      </Placeholder>
    </div>
  {:else}
    {#each posts as post, index (post.post.id)}
      {#if !($userSettings.hidePosts.deleted && post.post.deleted) && !($userSettings.hidePosts.removed && post.post.removed)}
        <div
          in:fly={{
            y: -8,
            duration: 500,
            opacity: 0,
            delay: index < 4 ? index * 100 : 0,
          }}
        >
          <Post compact={$userSettings.showCompactPosts} {post} />
        </div>
      {/if}
    {/each}
  {/if}
</div>
