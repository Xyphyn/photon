<script lang="ts">
  import type { PostView } from 'lemmy-js-client'
  import { isImage } from '$lib/ui/image.js'
  import Card from '$lib/components/ui/Card.svelte'
  import { getInstance } from '$lib/lemmy.js'
  import PostActions from '$lib/components/lemmy/post/PostActions.svelte'
  import { userSettings } from '$lib/settings.js'
  import PostLink from '$lib/components/lemmy/post/PostLink.svelte'
  import PostMeta from '$lib/components/lemmy/post/PostMeta.svelte'
  import { toast } from 'mono-svelte'
  import Markdown from '$lib/components/markdown/Markdown.svelte'

  export let post: PostView
  export let actions: boolean = true
  export let hideCommunity = false
  export let compact: boolean = false

  let loaded = false
</script>

<Card
  class="flex flex-col max-w-full min-w-0 w-full gap-2.5 {compact
    ? '!bg-transparent !border-0 py-5'
    : 'p-5'}"
  id={post.post.id}
>
  <div class="flex flex-row gap-2 max-w-full w-full">
    <div class="flex flex-col w-full gap-2">
      <div class="flex flex-col w-full gap-2">
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
          class="font-medium max-w-full w-full break-words"
          style="word-break: break-word;"
          class:text-slate-500={post.read && $userSettings.markReadPosts}
          class:dark:text-zinc-400={post.read && $userSettings.markReadPosts}
        >
          {post.post.name}
        </a>
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
          <!--disabled preloads here since most people will hover over every image while scrolling-->
          <a
            href="/post/{getInstance()}/{post.post.id}"
            class="self-start overflow-hidden z-10 relative bg-slate-200 dark:bg-zinc-800 rounded-md max-w-full"
            data-sveltekit-preload-data="off"
            aria-label={post.post.name}
          >
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
                class="max-w-full object-cover rounded-md max-h-[80vh] h-auto z-30 opacity-0 transition-opacity duration-300"
                class:opacity-100={loaded}
                width={512}
                height={300}
                class:blur-3xl={post.post.nsfw && $userSettings.nsfwBlur}
                on:load={() => (loaded = true)}
              />
            </picture>
          </a>
        {:else if post.post.url}
          <PostLink
            url={post.post.url}
            thumbnail_url={post.post.thumbnail_url
              ? `${post.post.thumbnail_url}?format=webp&thumbnail=512`
              : undefined}
            nsfw={post.post.nsfw}
          />
        {/if}
      {/if}
      {#if post.post.body && !post.post.nsfw}
        <div
          class="text-sm relative overflow-hidden {compact
            ? `text-zinc-600 dark:text-zinc-400 max-h-24`
            : 'text-slate-600 dark:text-zinc-400 max-h-48'}"
        >
          <Markdown inline source={post.post.body.slice(0, 400)} />
          {#if post.post.body.length > (compact ? 200 : 600)}
            <div
              class="absolute bottom-0 w-full h-16 bg-gradient-to-b {compact
                ? 'dark:from-zinc-950/0 dark:to-zinc-950 from-slate-50/0 to-slate-50'
                : 'dark:from-zinc-900/0 dark:to-zinc-900 from-white/0 to-white'} "
            />
          {/if}
        </div>
      {/if}
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
  {#if actions}
    <div class="w-full" class:mt-2={compact}>
      <PostActions
        bind:post
        on:edit={(e) => {
          toast({
            content: 'The post was edited successfully.',
            type: 'success',
          })
        }}
      />
    </div>
  {/if}
</Card>
