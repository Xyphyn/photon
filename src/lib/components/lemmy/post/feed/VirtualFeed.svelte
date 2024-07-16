<script lang="ts">
  import Post from '$lib/components/lemmy/post/Post.svelte'
  import Placeholder from '$lib/components/ui/Placeholder.svelte'
  import { userSettings } from '$lib/settings.js'
  import type { PostView } from 'lemmy-js-client'
  import { Badge, Button } from 'mono-svelte'
  import { ArchiveBox, Icon, Minus, Plus } from 'svelte-hero-icons'
  import { expoOut } from 'svelte/easing'
  import { fly, slide } from 'svelte/transition'
  import { browser } from '$app/environment'
  import { afterUpdate, onMount, tick, type SvelteComponent } from 'svelte'
  import { createWindowVirtualizer } from '@tanstack/svelte-virtual'
  import { afterNavigate, beforeNavigate } from '$app/navigation'
  import { _posts } from '../../../../../routes/+page.svelte'

  export let posts: PostView[]
  export let community: boolean = false

  const virtualizer = createWindowVirtualizer({
    count: posts.length,
    estimateSize: () => 150,
  })

  $: if (posts.length)
    $virtualizer.setOptions({
      count: posts.length,
    })

  let virtualItemEls: HTMLElement[] = []

  $: items = $virtualizer.getVirtualItems()
  $: {
    if (virtualItemEls.length)
      virtualItemEls.forEach((el) => $virtualizer.measureElement(el))
  }

  afterNavigate(() => {
    $virtualizer.scrollToIndex($_posts?.lastSeen)
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
  <slot />
</ul>
