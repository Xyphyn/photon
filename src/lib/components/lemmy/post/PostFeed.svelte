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

{#if posts.length == 0}
  <div class="h-full grid place-items-center">
    <Placeholder>
      <Icon src={ArchiveBox} size="32" solid slot="icon" />
      <span slot="title">No posts</span>
      <Button href="/communities" class="mt-4" slot="action">
        <Icon src={Plus} size="16" mini slot="icon" />
        <span>Follow some communities</span>
      </Button>
    </Placeholder>
  </div>
{:else}
  {#each posts as post, index (post.post.id)}
    {#if !($userSettings.hidePosts.deleted && post.post.deleted) && !($userSettings.hidePosts.removed && post.post.removed) && !($userSettings.hidePosts.read && post.read)}
      <div
        in:fly={{
          y: -8,
          duration: 500,
          opacity: 0,
          delay: index < 4 ? index * 100 : 0,
        }}
      >
        <Post {post} />
      </div>
    {/if}
  {/each}
{/if}
