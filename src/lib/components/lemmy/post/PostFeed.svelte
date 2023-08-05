<script lang="ts">
  import Post from '$lib/components/lemmy/post/Post.svelte'
  import { userSettings } from '$lib/settings.js'
  import type { PostView } from 'lemmy-js-client'
  import { fly } from 'svelte/transition'

  export let posts: PostView[]
</script>

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
      <Post {post} />
    </div>
  {/if}
{/each}
