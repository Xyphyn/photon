<script lang="ts">
  import { bestImageURL, postLink } from '$lib/components/lemmy/post/helpers.js'
  import ExpandableImage from '$lib/components/ui/ExpandableImage.svelte'
  import { userSettings } from '$lib/settings.js'
  import { isImage } from '$lib/ui/image'
  import type { Post } from 'lemmy-js-client'

  export let view: 'card' | 'cozy' | 'list' | 'compact' = 'cozy'
  export let post: Post
</script>

{#if (view == 'list' || view == 'compact') && !post.embed_title && (post.thumbnail_url || isImage(post.url))}
  <div class="flex-shrink-0 w-24 h-24">
    {#if !$userSettings.expandImages || (post.thumbnail_url && !isImage(post.url))}
      <a href={postLink(post)}>
        <!-- svelte-ignore a11y-missing-attribute -->
        <img
          src={bestImageURL(post, true)}
          loading="lazy"
          class="object-cover bg-slate-100 dark:bg-zinc-800 rounded-md h-24 w-24 border border-slate-200 dark:border-zinc-700"
        />
      </a>
    {:else}
      <ExpandableImage url={bestImageURL(post, false, 2048)}>
        <!-- svelte-ignore a11y-missing-attribute -->
        <img
          src={bestImageURL(post, true)}
          loading="lazy"
          class="object-cover bg-slate-100 rounded-md h-24 w-24 border border-slate-200 dark:border-zinc-700"
        />
      </ExpandableImage>
    {/if}
  </div>
{/if}
