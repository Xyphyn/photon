<script lang="ts">
  import type { PostView } from 'lemmy-js-client'
  import { isImage } from '$lib/ui/image.js'
  import Card from '$lib/components/ui/Card.svelte'
  import { getInstance } from '$lib/lemmy.js'
  import PostActions from '$lib/components/lemmy/post/PostActions.svelte'
  import { userSettings } from '$lib/settings.js'
  import PostLink from '$lib/components/lemmy/post/PostLink.svelte'
  import PostMeta from '$lib/components/lemmy/post/PostMeta.svelte'
  import { ToastType, toast } from '$lib/components/ui/toasts/toasts.js'

  export let post: PostView
  export let actions: boolean = true
  export let hideCommunity = false
</script>

<Card class="bg-white flex flex-col w-full p-5 gap-2.5">
  <div class="flex flex-row w-full gap-2.5">
    <div class="flex flex-col gap-1.5 grow">
      <PostMeta
        community={hideCommunity ? undefined : post.community}
        user={post.creator}
        published={new Date(post.post.published + 'Z')}
        upvotes={post.counts.upvotes}
        downvotes={post.counts.downvotes}
        deleted={post.post.deleted}
        removed={post.post.removed}
        locked={post.post.locked}
        featured={post.post.featured_local || post.post.featured_community}
        nsfw={post.post.nsfw}
        saved={post.saved}
      />
      <a
        href="/post/{getInstance()}/{post.post.id}"
        class="font-medium"
        class:text-slate-500={post.read && $userSettings.markReadPosts}
        class:dark:text-zinc-400={post.read && $userSettings.markReadPosts}
      >
        {post.post.name}
      </a>
    </div>
    {#if $userSettings.showCompactPosts && (post.post.thumbnail_url || isImage(post.post.url))}
      <div class="flex-none w-24 h-24">
        <a href="/post/{getInstance()}/{post.post.id}">
          {#if post.post.thumbnail_url}
            <!-- svelte-ignore a11y-missing-attribute -->
            <img
              src="{post.post.thumbnail_url}?thumbnail=256&format=webp"
              loading="lazy"
              class="object-cover bg-slate-100 rounded-md h-24 w-24 border border-slate-200 dark:border-zinc-700"
            />
          {:else}
            <!-- svelte-ignore a11y-missing-attribute -->
            <img
              src="{post.post.url}?thumbnail=256&format=webp"
              loading="lazy"
              class="object-cover bg-slate-100 rounded-md h-24 w-24 border border-slate-200 dark:border-zinc-700"
            />
          {/if}
        </a>
      </div>
    {/if}
  </div>
  {#if !$userSettings.showCompactPosts}
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
          <!-- svelte-ignore a11y-missing-attribute -->
          <img
            src="{post.post.url}?thumbnail=512&format=webp"
            loading="lazy"
            class="object-cover bg-slate-100 rounded-md max-h-[50vh] w-full"
            width={512}
            height={300}
            alt=""
          />
        </picture>
      </div>
    {:else if post.post.thumbnail_url && post.post.url}
      <PostLink
        url={post.post.url}
        thumbnail_url="{post.post.thumbnail_url}?format=webp&thumbnail=512"
        nsfw={post.post.nsfw}
      />
    {/if}
    {#if post.post.body && !post.post.nsfw}
      <p
        class="text-sm line-clamp-3 bg-slate-100 dark:bg-zinc-800
            border border-slate-200 dark:border-zinc-700 rounded-md p-2"
      >
        {post.post.body.length > 350
          ? `${post.post.body.slice(0, 350)}...`
          : post.post.body}
      </p>
    {/if}
  {/if}
  {#if actions}
    <PostActions
      {post}
      on:edit={(e) => {
        post.post.name = e.detail.post.name
        post.post.body = e.detail.post.body
        post.post.url = e.detail.post.url
        toast({
          content: 'The post was edited successfully.',
          type: ToastType.success,
        })
      }}
    />
  {/if}
</Card>
