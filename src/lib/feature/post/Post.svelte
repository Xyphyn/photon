<script lang="ts">
  import { profile } from '$lib/app/auth'
  import { type View, settings } from '$lib/app/settings.svelte'
  import { publishedToDate } from '$lib/ui/util/date'
  import type { ClassValue } from 'svelte/elements'
  import { PostActions, PostBody, PostMedia, PostMediaCompact, PostMeta } from '.'
  import type { PostModel } from './post.svelte'

  interface Props {
    post: PostModel
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

  let hideTitle = $derived(
    settings.posts.deduplicateEmbed &&
      post.post.embed_title == post.post.name &&
      view != 'compact' &&
      post.mediaType != 'iframe',
  )
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
    published={publishedToDate(post.post.published_at)}
    badges={post.badges}
    subscribed={profile.current?.user?.follows
      .map((c) => c.community.id)
      .includes(post.community.id)}
    id={post.post.id}
    title={hideTitle ? undefined : post.post.name}
    read={post.read}
    edited={post.post.updated_at}
    style="grid-area: meta;"
    postUrl={post.post.url}
    {view}
    {extraBadges}
  />
  {#key post.post.url}
    <div style="grid-area:embed;" class={{ contents: view == 'cozy' }}>
      {#if post.filterRule != 'hide'}
        <PostMedia {post} {view} />
      {/if}
    </div>
    {#if view == 'compact'}
      <PostMediaCompact
        {post}
        class="{settings.leftAlign ? 'mr-3' : 'ml-3'} shrink no-list-margin"
        style="grid-area: media;"
        blur={post.filterRule == 'blur' ? true : undefined}
        {view}
      />
    {/if}
  {/key}
  {#if post.post.body && !post.post.nsfw && view != 'compact'}
    <PostBody element="section" body={post.post.body} style="grid-area: body" class="relative" />
  {/if}
  {#if actions}
    <PostActions {onhide} {post} style="grid-area: actions;" {view} />
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
