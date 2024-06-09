<script lang="ts">
  import {
    bestImageURL,
    optimizeImageURL,
    postLink,
  } from '$lib/components/lemmy/post/helpers.js'
  import { showImage } from '$lib/components/ui/ExpandableImage.svelte'
  import { userSettings } from '$lib/settings.js'
  import { isImage } from '$lib/ui/image'
  import type { Post } from 'lemmy-js-client'

  export let view: 'card' | 'cozy' | 'list' | 'compact' = 'cozy'
  export let post: Post
</script>

{#if (view == 'list' || view == 'compact') && !post.embed_title && (post.thumbnail_url || isImage(post.url))}
  <div
    class="w-24 sm:w-32 h-24 group/media {$$props.class ?? ''}"
    style={$$props.style ?? ''}
  >
    <svelte:element
      this={!$userSettings.expandImages ||
      (post.thumbnail_url && !isImage(post.url))
        ? 'a'
        : 'button'}
      href={postLink(post)}
      on:click={() => showImage(bestImageURL(post, false, 2048))}
      role="button"
      tabindex="0"
    >
      <img
        src={optimizeImageURL(post.thumbnail_url || post.url || '', 128)}
        loading="lazy"
        class="object-cover overflow-hidden bg-slate-100 dark:bg-zinc-800 rounded-xl h-24 w-24 sm:w-32
        border border-slate-200 dark:border-zinc-800 group-hover/media:border-slate-400
        group-hover/media:dark:border-zinc-600 transition-colors"
        alt={post.name}
      />
    </svelte:element>
  </div>
{/if}
