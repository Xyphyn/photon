<script lang="ts">
  import { settings, type View } from '$lib/settings.svelte.js'
  import type { Post } from '$lib/api/types'
  import {
    PostImage,
    PostIframe,
    PostLink,
    type MediaType,
    iframeType,
  } from '..'

  interface Props {
    view?: View
    post: Post
    type?: MediaType
    opened?: boolean | undefined
    blur?: boolean
  }

  let {
    view = 'cozy',
    post,
    type = 'none',
    opened = undefined,
    blur = post.nsfw && settings.nsfwBlur,
  }: Props = $props()
</script>

<!-- 
  @component
  This component will show either
  - A media item (pictures, videos) (large form factor posts only)
  - Embed link/card.
-->
{#if type == 'image' && view == 'cozy'}
  <PostImage {post} {blur} />
{:else if (type == 'iframe' || type == 'video') && view == 'cozy' && post.url}
  <PostIframe
    thumbnail={post.thumbnail_url}
    type={iframeType(post.url)}
    url={post.url}
    {opened}
  />
{:else if type == 'embed' && post.url}
  <PostLink
    url={post.url}
    thumbnail_url={post.thumbnail_url}
    nsfw={post.nsfw}
    embed_title={post.embed_title}
    {view}
  />
{/if}
