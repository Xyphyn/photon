<script lang="ts">
  import { goto } from '$app/navigation'
  import { profile } from '$lib/auth.svelte'
  import { mediaType, postLink } from '$lib/components/lemmy/post/helpers.js'
  import PostMedia from '$lib/components/lemmy/post/media/PostMedia.svelte'
  import PostMediaCompact from '$lib/components/lemmy/post/media/PostMediaCompact.svelte'
  import PostActions from '$lib/components/lemmy/post/PostActions.svelte'
  import PostMeta, {
    parseTags,
    type Tag,
  } from '$lib/components/lemmy/post/PostMeta.svelte'
  import { publishedToDate } from '$lib/components/util/date.js'
  import { settings, type View } from '$lib/settings.svelte.js'
  import type { PostView } from 'lemmy-js-client'
  import type { ClassValue } from 'svelte/elements'
  import PostBody from './PostBody.svelte'

  function getTagRule(tags: Tag[]): 'blur-sm' | 'hide' | undefined {
    const tagContent = tags.map(t => t.content.toLowerCase())

    let rule: 'blur-sm' | 'hide' | undefined
    if (settings.nsfwBlur && (post.post.nsfw || post.community.nsfw))
      rule = 'blur-sm'
    tagContent.forEach(() => {
      if (rule == 'hide') return rule
    })

    return rule
  }

  function onClick(e: Event) {
    const event = e as Event
    const parent = document.getElementById(post.post.id.toString())

    if (event.target == parent) {
      goto(postLink(post.post))
    }
  }

  interface Props {
    post: PostView
    actions?: boolean
    hideCommunity?: boolean
    view?: View
    style?: string
    class?: ClassValue
    extraBadges?: import('svelte').Snippet
    onhide?: (hide: boolean) => void
  }

  let {
    post = $bindable(),
    actions = true,
    hideCommunity = false,
    view = settings.view,
    style = '',
    class: clazz = '',
    extraBadges,
    onhide,
  }: Props = $props()

  let tags = $derived(parseTags(post.post.name))
  let type = $derived(mediaType(post.post.url))
  let rule = $derived(getTagRule(tags.tags))
  let hideTitle = $derived(
    settings.posts.deduplicateEmbed &&
      post.post.embed_title == post.post.name &&
      view != 'compact' &&
      type != 'iframe',
  )

  let badges = $derived({
    deleted: post.post.deleted,
    removed: post.post.removed,
    locked: post.post.locked,
    featured: post.post.featured_local || post.post.featured_community,
    nsfw: post.post.nsfw || post.community.nsfw,
    saved: post.saved,
    admin: post.creator_is_admin,
    moderator: post.creator_is_moderator,
  })
</script>

<!-- 
  @component
  This is the sole component for displaying posts.
  It adapts to all kinds of form factors for different contexts, such as feeds, full post view, and crosspost list.
-->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
  class={[
    'post relative max-w-full min-w-0 w-full cursor-pointer outline-hidden group',
    settings.leftAlign && 'left-align',
    view == 'compact' && 'py-3 list-type compact',
    view == 'cozy' && 'py-5 flex flex-col gap-2',
    clazz,
  ]}
  id={post.post.id.toString()}
  onclick={e => {
    onClick(e)
  }}
  onkeydown={e => {
    if (e.key == 'Enter') onClick(e)
  }}
  tabindex="0"
  {style}
>
  <PostMeta
    community={post.community}
    showCommunity={!hideCommunity}
    user={post.creator}
    published={publishedToDate(post.post.published)}
    {badges}
    subscribed={profile.current?.user?.follows
      .map(c => c.community.id)
      .includes(post.community.id)
      ? 'Subscribed'
      : 'NotSubscribed'}
    id={post.post.id}
    title={hideTitle ? undefined : tags?.title ? tags.title : post.post.name}
    read={post.read}
    style="grid-area: meta;"
    edited={post.post.updated}
    tags={tags?.tags}
    postUrl={post.post.url}
    {view}
    {extraBadges}
  />
  {#key post.post.url}
    <div style="grid-area:embed;" class={{ contents: view == 'cozy' }}>
      {#if rule != 'hide'}
        <PostMedia
          post={post.post}
          blur={rule == 'blur-sm' ? true : undefined}
          {view}
          {type}
        />
      {/if}
    </div>
    {#if view == 'compact'}
      <PostMediaCompact
        post={post.post}
        {type}
        class="{settings.leftAlign ? 'mr-3' : 'ml-3'} shrink no-list-margin"
        style="grid-area: media;"
        blur={rule == 'blur-sm' ? true : undefined}
        {view}
      />
    {/if}
  {/key}
  {#if post.post.body && !post.post.nsfw && view != 'compact'}
    <PostBody
      element="section"
      body={post.post.body}
      style="grid-area: body"
      class="relative"
    />
  {/if}
  {#if actions}
    <PostActions {onhide} bind:post style="grid-area: actions;" {view} />
  {/if}
  <div
    class="absolute overflow-hidden inset-0
    sm:rounded-xl bg-slate-50 dark:bg-zinc-900
    opacity-0 transition-all -z-50 no-list-margin
    group-hover:inset-y-0.5 group-hover:-inset-x-3 sm:group-hover:-inset-x-5 group-hover:opacity-100
    group-focus:inset-y-0.5 group-focus:-inset-x-3 sm:group-focus:-inset-x-5 group-focus:opacity-100
    duration-150"
  ></div>
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
