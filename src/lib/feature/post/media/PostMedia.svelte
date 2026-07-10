<script lang="ts">
  import { type View } from '$lib/app/settings.svelte'
  import { PostIframe, PostImage, PostLink } from '..'
  import { iframeType } from '../post-helpers'
  import type { PostModel } from '../post.svelte'
  import PostEvent from './PostEvent.svelte'
  import PostPoll from './PostPoll.svelte'

  interface Props {
    view?: View
    post: PostModel
    opened?: boolean | undefined
    [key: string]: any
  }

  let {
    view = 'cozy',
    post,
    opened = undefined,
    blur = post.filterRule != 'none',
    ...rest
  }: Props = $props()
</script>

<!--
  @component
  This component will show either
  - A media item (pictures, videos) (large form factor posts only)
  - Embed link/card.
-->
{#if post.mediaType == 'image' && view == 'cozy'}
  <PostImage post={post.post} {blur} {...rest} />
{:else if (post.mediaType == 'iframe' || post.mediaType == 'video') && view == 'cozy' && post.post.url}
  <PostIframe
    thumbnail={post.post.thumbnail_url}
    type={iframeType(post.post.url)}
    url={post.post.url}
    {opened}
    title={post.post.name}
    {...rest}
  />
{:else if post.mediaType == 'poll' && post.post.poll && view == 'cozy'}
  <PostPoll post={{ ...post.post, poll: post.post.poll! }} />
{:else if post.mediaType == 'event' && post.post.event && view == 'cozy'}
  <PostEvent post={{ ...post.post, event: post.post.event! }} />
{:else if post.mediaType == 'embed' && post.post.url}
  <PostLink
    url={post.post.url}
    thumbnail_url={post.post.thumbnail_url}
    nsfw={post.post.nsfw}
    embed_title={post.post.embed_title}
    embed_body={post.post.embed_description}
    {view}
    {...rest}
  />
{/if}
