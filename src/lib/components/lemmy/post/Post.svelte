<script lang="ts">
  import type { PostView } from 'lemmy-js-client'
  import { isImage, isVideo } from '$lib/ui/image.js'
  import { getInstance } from '$lib/lemmy.js'
  import PostActions from '$lib/components/lemmy/post/PostActions.svelte'
  import { userSettings } from '$lib/settings.js'
  import PostLink from '$lib/components/lemmy/post/PostLink.svelte'
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

  $: type = mediaType(post.post.url, view)

  $: tags = parseTags(post.post.name)
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
<Material
  color={view != 'card' ? 'none' : 'distinct'}
  class="post relative max-w-full min-w-0 w-full group cursor-pointer
  {view != 'card' ? 'bg-transparent !border-0' : 'p-5'} {view == 'compact'
    ? 'py-4 list-type'
    : view == 'list'
      ? 'py-5 list-type'
      : 'py-5 flex flex-col gap-2'} {$$props.class}"
  id={post.post.id.toString()}
  padding="none"
  on:click={(e) => {
    onClick(e)
  }}
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
    title={hideTitle ? undefined : tags?.title ? tags.title : post.post.name}
    read={post.read}
    style="grid-area: meta;"
    tags={tags?.tags}
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
          bind:post={post.post}
          blur={rule == 'blur' ? true : undefined}
          {view}
          {type}
        />
      {/if}
    </div>
    {#if view == 'list' || view == 'compact'}
      <PostMediaCompact
        bind:post={post.post}
        bind:type
        class="{$userSettings.leftAlign
          ? 'mr-2'
          : 'ml-2'} flex-shrink no-list-margin"
        style="grid-area: media;"
      />
    {/if}
  {/key}
  {#if post.post.body && !post.post.nsfw && view != 'compact' && !hideBody && rule != 'hide'}
    <PostBody body={post.post.body} {view} style="grid-area: body" />
  {/if}
  {#if actions}
    <PostActions on:hide bind:post {type} style="grid-area: actions;" />
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
    class="absolute overflow-hidden inset-0 group-hover:inset-y-0.5 group-hover:-inset-x-4 group-hover:sm:-inset-x-5
    sm:rounded-xl bg-slate-50 dark:bg-zinc-900
    opacity-0 group-hover:opacity-100 transition-all -z-10 no-list-margin
    duration-150"
  />
</Material>

<style>
  :global(.list-type) {
    display: grid;
    grid-template-areas: var(
      --template-areas,
      'meta media' 'title media' 'body media' 'embed embed' 'actions actions'
    );
    width: 100%;
    height: 100%;
    grid-template-columns: var(--template-columns, 1fr auto);
  }

  :global(.list-type > *:not(.no-list-margin):not(:first-child)) {
    margin-top: 0.5rem;
  }
</style>
