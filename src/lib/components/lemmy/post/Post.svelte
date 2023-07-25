<script lang="ts">
  import type { PostView } from 'lemmy-js-client'
  import { isImage } from '$lib/ui/image.js'
  import Card from '$lib/components/ui/Card.svelte'
  import { getInstance } from '$lib/lemmy.js'
  import PostActions from '$lib/components/lemmy/post/PostActions.svelte'
  import { userSettings } from '$lib/settings.js'
  import PostLink from '$lib/components/lemmy/post/PostLink.svelte'
  import PostMeta from '$lib/components/lemmy/post/PostMeta.svelte'
  import Modal from '$lib/components/ui/modal/Modal.svelte'
  import PostForm from '$lib/components/lemmy/post/PostForm.svelte'

  export let post: PostView
</script>

<Card class="bg-white flex flex-col w-full p-5 gap-2.5">
  <PostMeta
    community={post.community}
    user={post.creator}
    published={new Date(post.post.published)}
    upvotes={post.counts.upvotes}
    downvotes={post.counts.downvotes}
    deleted={post.post.deleted}
    featured={post.post.featured_local || post.post.featured_community}
    nsfw={post.post.nsfw}
    saved={post.saved}
  />
  <a
    href="/post/{getInstance()}/{post.post.id}"
    class="font-bold"
    class:opacity-50={post.read && $userSettings.markReadPosts}
  >
    {post.post.name}
  </a>
  {#if post.post.url && !post.post.thumbnail_url}
    <a
      href={post.post.url}
      class="max-w-full overflow-hidden overflow-ellipsis whitespace-nowrap text-sky-400 hover:underline text-xs"
    >
      {post.post.url}
    </a>
  {/if}
  {#if isImage(post.post.url)}
    <div class="self-start" class:blur-3xl={post.post.nsfw}>
      <picture
        class="rounded-md overflow-hidden max-h-[min(50vh,500px)] w-full max-w-full"
      >
        <source
          srcset="{post.post.url}?thumbnail=256&format=webp"
          media="(max-width: 256px)"
        />
        <source
          srcset="{post.post.url}?thumbnail=512&format=webp"
          media="(max-width: 512px)"
        />
        <source
          srcset="{post.post.url}?thumbnail=720&format=webp"
          media="(max-width: 720px)"
        />
        <!-- svelte-ignore a11y-missing-attribute -->
        <img
          src="{post.post.url}?thumbnail=1024&format=webp"
          loading="lazy"
          class="object-cover bg-slate-100 rounded-md max-h-[50vh] w-full"
          width={512}
          height={300}
        />
      </picture>
    </div>
  {:else if post.post.thumbnail_url && post.post.url}
    <PostLink
      url={post.post.url}
      thumbnail_url={post.post.thumbnail_url}
      nsfw={post.post.nsfw}
    />
  {/if}
  {#if post.post.body && !post.post.nsfw}
    <p
      class="text-sm max-h-[74px] line-clamp-3 bg-slate-100 dark:bg-zinc-800
        border border-slate-200 dark:border-zinc-700 rounded-md p-2"
    >
      {post.post.body}
    </p>
  {/if}
  <PostActions
    {post}
    on:edit={(e) => {
      post.post.name = e.detail.post.name
      post.post.body = e.detail.post.body
      post.post.url = e.detail.post.url
    }}
  />
</Card>
