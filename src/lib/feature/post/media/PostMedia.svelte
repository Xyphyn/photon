<script lang="ts">
  import type { Post } from '$lib/api/types'
  import { settings, type View } from '$lib/app/settings.svelte'
  import { PostIframe, PostImage, PostLink } from '..'
  import { iframeType, type MediaType } from '../helpers'

  interface Props {
    view?: View
    post: Post
    type?: MediaType
    opened?: boolean | undefined
    blur?: boolean
    [key: string]: any
  }

  let {
    view = 'cozy',
    post,
    type = 'none',
    opened = undefined,
    blur = post.nsfw && settings.nsfwBlur,
    ...rest
  }: Props = $props()
</script>

<!-- 
  @component
  This component will show either
  - A media item (pictures, videos) (large form factor posts only)
  - Embed link/card.
-->
{#if type == 'image' && view == 'cozy'}
  <PostImage {post} {blur} {...rest} />
{:else if (type == 'iframe' || type == 'video') && view == 'cozy' && post.url}
  <PostIframe
    thumbnail={post.thumbnail_url}
    type={iframeType(post.url)}
    url={post.url}
    {opened}
    title={post.name}
    {...rest}
  />
{:else if type == 'embed' && post.url}
  <PostLink
    url={post.url}
    thumbnail_url={post.thumbnail_url}
    nsfw={post.nsfw}
    embed_title={post.embed_title}
    {view}
    {...rest}
  />
{/if}
