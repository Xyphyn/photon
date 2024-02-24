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
  import {
    bestImageURL,
    mediaType,
    postLink,
  } from '$lib/components/lemmy/post/helpers.js'
  import Empty from '$lib/components/helper/Empty.svelte'
  import { publishedToDate } from '$lib/components/util/date.js'
  import { Icon, VideoCamera } from 'svelte-hero-icons'
  import PostMedia from '$lib/components/lemmy/post/media/PostMedia.svelte'
  import PostMediaCompact from '$lib/components/lemmy/post/media/PostMediaCompact.svelte'
  import PostBody from './PostBody.svelte'
  import { profile } from '$lib/auth'
  import { goto } from '$app/navigation'

  export let post: PostView
  export let actions: boolean = true
  export let hideCommunity = false
  export let view = $userSettings.view

  $: type = mediaType(post.post.url, view)

  let loaded = false
</script>

<Material
  color={view != 'card' ? 'none' : 'distinct'}
  padding="none"
  class="relative max-w-full min-w-0 w-full group z-10 isolation-auto
  {view != 'card' ? 'bg-transparent !border-0' : 'p-5'} {view == 'compact'
    ? 'py-4'
    : view == 'list'
      ? 'py-5'
      : 'py-5'} {$$props.class}"
  id={post.post.id}
>
  {#if view == 'cozy' || view == 'list'}
    <button
      on:click={() => goto(postLink(post.post))}
      class="-z-20 bg-slate-50 dark:bg-zinc-900 rounded-xl absolute -mx-6 top-0 left-0 w-[calc(100%+3rem)]
    h-full opacity-0 scale-95 group-hover:scale-[99%] group-hover:opacity-100 transition-all
    "
    ></button>
  {/if}
  <div
    class="flex {$userSettings.leftAlign
      ? 'flex-row-reverse'
      : 'flex-row'} gap-4 max-w-full w-full min-w-0"
  >
    <div class="flex flex-col w-full gap-2 flex-1 max-w-full min-w-0">
      <div class="flex flex-col w-full gap-2 z-10">
        <PostMeta
          community={hideCommunity ? undefined : post.community}
          user={post.creator}
          published={publishedToDate(post.post.published)}
          deleted={post.post.deleted}
          removed={post.post.removed}
          locked={post.post.locked}
          featured={post.post.featured_local || post.post.featured_community}
          nsfw={post.post.nsfw}
          saved={post.saved}
          subscribed={$profile?.user?.follows
            .map((c) => c.community.id)
            .includes(post.community.id)
            ? 'Subscribed'
            : 'NotSubscribed'}
        >
          <slot name="badges" slot="badges" />
        </PostMeta>
        {#if !(post.post.embed_title == post.post.name && type == 'embed') || view == 'compact'}
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
      <div class="contents z-50 isolate">
        <PostMedia bind:post={post.post} {view} {type} />
      </div>
      {#if post.post.body && !post.post.nsfw && view != 'compact'}
        <PostBody body={post.post.body} {view} />
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
