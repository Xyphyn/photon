<script lang="ts">
  import type { PostView } from 'lemmy-js-client'
  import { isImage, isVideo } from '$lib/ui/image.js'
  import { getInstance } from '$lib/lemmy.js'
  import PostActions from '$lib/components/lemmy/post/PostActions.svelte'
  import { userSettings } from '$lib/settings.js'
  import PostLink from '$lib/components/lemmy/post/PostLink.svelte'
  import PostMeta from '$lib/components/lemmy/post/PostMeta.svelte'
  import { Material, toast } from 'mono-svelte'
  import Markdown from '$lib/components/markdown/Markdown.svelte'
  import ExpandableImage from '$lib/components/ui/ExpandableImage.svelte'
  import { bestImageURL, postLink } from '$lib/components/lemmy/post/helpers.js'
  import Empty from '$lib/components/helper/Empty.svelte'
  import { publishedToDate } from '$lib/components/util/date.js'
  import { Icon, VideoCamera } from 'svelte-hero-icons'
  import PostMedia from '$lib/components/lemmy/post/media/PostMedia.svelte'
  import PostMediaCompact from '$lib/components/lemmy/post/media/PostMediaCompact.svelte'

  export let post: PostView
  export let actions: boolean = true
  export let hideCommunity = false
  export let view = $userSettings.view

  let loaded = false
</script>

<Material
  color={view != 'card' ? 'none' : 'distinct'}
  padding="none"
  class="relative max-w-full min-w-0 w-full group
  {view != 'card' ? 'bg-transparent !border-0' : 'p-5'} {view == 'compact'
    ? 'py-4'
    : view == 'list'
    ? 'py-5'
    : 'py-5'} {$$props.class}"
  id={post.post.id}
>
  <div
    class="flex {$userSettings.leftAlign
      ? 'flex-row-reverse'
      : 'flex-row'} gap-4 max-w-full w-full min-w-0"
  >
    <div class="flex flex-col w-full gap-2 flex-1 max-w-full min-w-0">
      <div class="flex flex-col w-full gap-2">
        <PostMeta
          community={hideCommunity ? undefined : post.community}
          user={post.creator}
          published={publishedToDate(post.post.published)}
          upvotes={post.counts.upvotes}
          downvotes={post.counts.downvotes}
          deleted={post.post.deleted}
          removed={post.post.removed}
          locked={post.post.locked}
          featured={post.post.featured_local || post.post.featured_community}
          nsfw={post.post.nsfw}
          saved={post.saved}
        >
          <slot name="badges" slot="badges" />
        </PostMeta>
        {#if post.post.embed_title != post.post.name || view == 'compact'}
          <a
            target={$userSettings.openLinksInNewTab ? '_blank' : ''}
            href="/post/{getInstance()}/{post.post.id}"
            class="font-medium max-w-full w-full break-words text-base"
            style="word-break: break-word;"
            class:text-slate-500={post.read && $userSettings.markReadPosts}
            class:dark:text-zinc-400={post.read && $userSettings.markReadPosts}
          >
            <Markdown source={post.post.name} inline />
          </a>
        {/if}
      </div>
      <PostMedia bind:post={post.post} {view} />
      {#if post.post.body && !post.post.nsfw && view != 'compact'}
        <div
          class="text-sm relative overflow-hidden
          bg-gradient-to-b text-transparent from-slate-600 via-slate-600
          dark:from-zinc-400 dark:via-zinc-400 bg-clip-text
          {view == 'list' ? `max-h-24` : 'max-h-48'}"
        >
          <Markdown inline source={post.post.body} />
        </div>
      {/if}
    </div>
    {#if view == 'list' || view == 'compact'}
      <PostMediaCompact {view} bind:post={post.post} />
    {/if}
  </div>
  {#if actions}
    <div class="w-full mt-2">
      <PostActions
        bind:post
        on:edit={(e) => {
          toast({
            content: 'The post was edited successfully.',
            type: 'success',
          })
        }}
      />
    </div>
  {/if}
</Material>
