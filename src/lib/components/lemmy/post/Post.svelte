<script lang="ts">
  import type { PostView } from 'lemmy-js-client'
  import { isImage, isVideo } from '$lib/ui/image.js'
  import { getInstance } from '$lib/lemmy.js'
  import PostActions from '$lib/components/lemmy/post/PostActions.svelte'
  import { userSettings } from '$lib/settings.js'
  import PostLink from '$lib/components/lemmy/post/link/PostLink.svelte'
  import PostMeta, {
    parseTags,
    type Tag,
  } from '$lib/components/lemmy/post/PostMeta.svelte'
  import { Badge, Material, toast } from 'mono-svelte'
  import Markdown from '$lib/components/markdown/Markdown.svelte'
  import ExpandableImage from '$lib/components/ui/ExpandableImage.svelte'
  import {
    bestImageURL,
    mediaType,
    postLink,
  } from '$lib/components/lemmy/post/helpers.js'
  import Empty from '$lib/components/helper/Empty.svelte'
  import { publishedToDate } from '$lib/components/util/date.js'
  import {
    ArrowUp,
    ChatBubbleOvalLeft,
    Icon,
    VideoCamera,
  } from 'svelte-hero-icons'
  import PostMedia from '$lib/components/lemmy/post/media/PostMedia.svelte'
  import PostMediaCompact from '$lib/components/lemmy/post/media/PostMediaCompact.svelte'
  import PostBody from './PostBody.svelte'
  import { profile } from '$lib/auth'
  import { goto } from '$app/navigation'

  export let post: PostView
  export let actions: boolean = true
  export let hideCommunity = false
  export let view = $userSettings.view

  $: tags = parseTags(post.post.name)
  $: type = mediaType(post.post.url, view)
  $: rule = getTagRule(tags.tags)

  $: hideTitle =
    $userSettings.posts.deduplicateEmbed &&
    post.post.embed_title == post.post.name &&
    view != 'compact' &&
    type != 'iframe'

  $: hideBody =
    $userSettings.posts.deduplicateEmbed &&
    post.post.embed_description == post.post.body &&
    view != 'compact'

  function getTagRule(tags: Tag[]): 'blur' | 'hide' | undefined {
    const tagContent = tags.map((t) => t.content.toLowerCase())

    let rule: 'blur' | 'hide' | undefined
    if ($userSettings.nsfwBlur && (post.post.nsfw || post.community.nsfw))
      rule = 'blur'
    tagContent.forEach((tag) => {
      if ($userSettings.tagRules?.[tag])
        rule = $userSettings.tagRules?.[tag] ?? rule
      if (rule == 'hide') return rule
    })

    return rule
  }

  function onClick(e: any) {
    const event = e as MouseEvent
    const parent = document.getElementById(post.post.id.toString())

    if (event.target == parent) {
      goto(postLink(post.post))
    }
  }
</script>

<!-- 
  @component
  This is the sole component for displaying posts.
  It adapts to all kinds of form factors for different contexts, such as feeds, full post view, and crosspost list.
-->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<div
  class="post relative max-w-full min-w-0 w-full cursor-pointer outline-none
  group
  {$userSettings.leftAlign ? 'left-align' : ''}
  {view == 'compact' ? 'py-3 list-type compact' : ''}
  {view == 'list' ? 'py-5 list-type' : ''}
  {view == 'cozy' ? 'py-5 flex flex-col gap-2' : ''}
  {$$props.class ?? ''}"
  id={post.post.id.toString()}
  on:click={(e) => {
    onClick(e)
  }}
  on:keydown={(e) => {
    // @ts-ignore
    if (e.key == 'Enter') onClick(e)
  }}
  tabindex="0"
  style={$$props.style ?? ''}
>
  <PostMeta
    community={post.community}
    showCommunity={!hideCommunity}
    user={post.creator}
    published={publishedToDate(post.post.published)}
    badges={{
      deleted: post.post.deleted,
      removed: post.post.removed,
      locked: post.post.locked,
      featured: post.post.featured_local || post.post.featured_community,
      nsfw: post.post.nsfw || post.community.nsfw,
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
    title={hideTitle ? undefined : tags?.title ? tags.title : post.post.name}
    read={post.read}
    style="grid-area: meta;"
    edited={post.post.updated}
    tags={tags?.tags}
    {view}
  >
    <slot name="badges" slot="badges" />
  </PostMeta>
  {#key post.post.url}
    <div
      style="grid-area:embed;"
      class={view == 'list' || view == 'compact' ? '' : 'contents'}
    >
      {#if rule != 'hide'}
        <PostMedia
          post={post.post}
          blur={rule == 'blur' ? true : undefined}
          {view}
          {type}
        />
      {/if}
    </div>
    {#if view == 'list' || view == 'compact'}
      <PostMediaCompact
        post={post.post}
        {type}
        class="{$userSettings.leftAlign
          ? 'mr-3'
          : 'ml-3'} flex-shrink no-list-margin"
        style="grid-area: media;"
        blur={rule == 'blur' ? true : undefined}
        {view}
      />
    {/if}
  {/key}
  {#if post.post.body && !post.post.nsfw && view != 'compact' && !hideBody && rule != 'hide'}
    <PostBody
      element="section"
      body={post.post.body}
      {view}
      style="grid-area: body"
      class="relative"
    />
  {/if}
  {#if actions}
    <PostActions on:hide {post} style="grid-area: actions;" {view} />
  {:else if view == 'compact'}
    <div class="flex flex-row items-center gap-2 text-sm">
      <Badge>
        <Icon src={ArrowUp} slot="icon" size="14" micro />
        {post.counts.score}
      </Badge>
      <Badge>
        <Icon src={ChatBubbleOvalLeft} slot="icon" size="14" micro />
        {post.counts.comments}
      </Badge>
    </div>
  {/if}
  <div
    class="absolute overflow-hidden inset-0
    sm:rounded-xl bg-slate-50 dark:bg-zinc-900
    opacity-0 transition-all -z-50 no-list-margin
    group-hover:inset-y-0.5 group-hover:-inset-x-4 group-hover:sm:-inset-x-5 group-hover:opacity-100
    group-focus:inset-y-0.5 group-focus:-inset-x-4 group-focus:sm:-inset-x-5 group-focus:opacity-100
    duration-150"
  />
</div>

<style lang="postcss">
  .list-type {
    display: grid;
    grid-template-areas: 'meta media' 'title media' 'body media' 'embed embed' 'actions actions';
    grid-template-columns: minmax(0, 1fr) auto;
    width: 100%;
    height: 100%;
  }

  /* Swap media/item positions */
  .list-type.left-align {
    grid-template-areas: 'media meta' 'media title' 'media body' 'embed embed' 'actions actions';
    grid-template-columns: auto minmax(0, 1fr);
  }

  /* Has media on the right for all of them */
  @media (min-width: 480px) {
    .list-type.compact {
      grid-template-areas: 'meta media' 'title media' 'body media' 'embed media' 'actions media';
    }
  }

  /* Swap above again */
  @media (min-width: 480px) {
    .list-type.compact.left-align {
      grid-template-areas: 'media meta' 'media title' 'media body' 'media embed' 'media actions';
    }
  }

  :global(.compact > *:not(.no-list-margin):not(:first-child)) {
    margin-top: 0.3rem;
  }

  :global(.list-type:not(.compact) > *:not(.no-list-margin):not(:first-child)) {
    margin-top: 0.5rem;
  }
</style>
