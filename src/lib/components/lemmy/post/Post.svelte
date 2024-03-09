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
</script>

<Material
  color={view != 'card' ? 'none' : 'distinct'}
  padding="none"
  class="relative max-w-full min-w-0 w-full group gap-2  flex flex-col
  {view != 'card' ? 'bg-transparent !border-0' : 'p-5'} {view == 'compact'
    ? 'py-4'
    : view == 'list'
      ? 'py-5'
      : 'py-5'} {$$props.class}"
  id={post.post.id}
>
  <PostMeta
    community={hideCommunity ? undefined : post.community}
    user={post.creator}
    published={publishedToDate(post.post.published)}
    badges={{
      deleted: post.post.deleted,
      removed: post.post.removed,
      locked: post.post.locked,
      featured: post.post.featured_local || post.post.featured_community,
      nsfw: post.post.nsfw,
      saved: post.saved,
      admin: post.creator_is_admin,
      moderator: post.creator_is_moderator,
    }}
    subscribed={$profile?.user?.follows
      .map((c) => c.community.id)
      .includes(post.community.id)
      ? 'Subscribed'
      : 'NotSubscribed'}
    id={post.post.id}
    title={post.post.name}
  >
    <slot name="badges" slot="badges" />
  </PostMeta>
  <PostMedia bind:post={post.post} {view} {type} />
  {#if view == 'list' || view == 'compact'}
    <PostMediaCompact
      {view}
      bind:post={post.post}
      style="grid-area: media; grid-column: span 2 / span 2;"
    />
  {/if}
  {#if post.post.body && !post.post.nsfw && view != 'compact'}
    <PostBody
      body={post.post.body}
      {view}
      style="grid-area: body; grid-column: span 1 / span 1;"
    />
  {/if}
  {#if actions}
    <PostActions
      bind:post
      on:edit={(e) => {
        toast({
          content: 'The post was edited successfully.',
          type: 'success',
        })
      }}
      style="grid-area: actions; grid-column: span 2 / span 2;"
    />
  {/if}
</Material>

<style>
  :global(.list-type) {
    display: grid;
    gap: 0;
    grid-template-areas:
      'meta' 'media'
      'body' 'media'
      'actions' 'actions';
    width: 100%;
    height: 100%;
    grid-template-rows: 3;
    grid-template-columns: 2;
  }
</style>
