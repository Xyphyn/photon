<script lang="ts">
  import type { PostView } from '$lib/api/types'
  import { profile } from '$lib/app/auth.svelte'
  import { type View, settings } from '$lib/app/settings.svelte'
  import { publishedToDate } from '$lib/ui/util/date'
  import type { ClassValue } from 'svelte/elements'
  import {
    PostActions,
    PostBody,
    PostMedia,
    PostMediaCompact,
    PostMeta,
  } from '.'
  import { mediaType } from './helpers'
  import { type Tag, parseTags } from './PostMeta.svelte'

  function getTagRule(tags: Tag[]): 'blur-sm' | 'hide' | undefined {
    const tagContent = tags.map((t) => t.content.toLowerCase())

    let rule: 'blur-sm' | 'hide' | undefined
    if (settings.nsfwBlur && (post.post.nsfw || post.community.nsfw))
      rule = 'blur-sm'
    tagContent.forEach(() => {
      if (rule == 'hide') return rule
    })

    return rule
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

  let tags = $derived.by<{ title?: string; tags: Tag[] }>(() => {
    const parsed = parseTags(post.post.name)

    return {
      title: parsed.title,
      tags: [
        ...parsed.tags,
        ...(post.flair_list?.map((i) => ({
          content: i.flair_title,
          color: i.background_color,
          icon: null,
          type: 'flair' as 'flair' | 'custom',
          textColor: i.text_color,
        })) ?? []),
      ],
    }
  })
  let type = $derived(mediaType(post.post))
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
<article
  class={[
    'relative group/post',
    settings.leftAlign && 'left-align',
    view == 'compact' && 'py-3 list-type compact',
    view == 'cozy' && 'py-5 flex flex-col gap-2',
    clazz,
  ]}
  id={post.post.id.toString()}
  {style}
>
  <PostMeta
    community={post.community}
    showCommunity={!hideCommunity}
    user={post.creator}
    published={publishedToDate(post.post.published)}
    {badges}
    subscribed={profile.current?.user?.follows
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
</article>

<style>
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
