<script lang="ts">
  import type { PostView } from 'lemmy-js-client'
  import { isImage } from '$lib/ui/image.js'
  import { getInstance } from '$lib/lemmy.js'
  import PostActions from '$lib/components/lemmy/post/PostActions.svelte'
  import { userSettings } from '$lib/settings.js'
  import PostLink from '$lib/components/lemmy/post/PostLink.svelte'
  import PostMeta from '$lib/components/lemmy/post/PostMeta.svelte'
  import { Material, toast } from 'mono-svelte'
  import Markdown from '$lib/components/markdown/Markdown.svelte'
  import ExpandableImage from '$lib/components/ui/ExpandableImage.svelte'
  import { bestImageURL, postLink } from '$lib/components/lemmy/post/helpers.js'
  import Empty from '$lib/components/helper/Empty.svelte'

  export let post: PostView
  export let actions: boolean = true
  export let hideCommunity = false
  export let view: 'card' | 'list' | 'compact' = $userSettings.view

  let loaded = false
</script>

<Material
  color="distinct"
  padding="none"
  class="relative max-w-full min-w-0 w-full group
  {view == 'list' || view == 'compact'
    ? '!bg-transparent !border-0'
    : 'p-5'} {view == 'list' ? 'py-5' : view == 'compact' ? 'py-4' : ''}"
>
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  {#if view == 'list'}
    <div
      class="absolute -inset-x-2 md:-inset-x-4 inset-y-2 scale-95 opacity-0 bg-slate-50 dark:bg-zinc-900
    -z-10 rounded-xl group-hover:opacity-100 group-hover:scale-100 transition-all"
    />
  {/if}
  <div
    class="flex {$userSettings.leftAlign
      ? 'flex-row-reverse'
      : 'flex-row'} gap-4 max-w-full w-full"
  >
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
          class="font-medium max-w-full w-full break-words text-base"
          style="word-break: break-word;"
          class:text-slate-500={post.read && $userSettings.markReadPosts}
          class:dark:text-zinc-400={post.read && $userSettings.markReadPosts}
        >
          <Markdown source={post.post.name} inline />
        </a>
      </div>
      {#if $userSettings.view == 'card'}
        {#if isImage(post.post.url)}
          <!--disabled preloads here since most people will hover over every image while scrolling-->
          <svelte:component
            this={$userSettings.expandImages ? ExpandableImage : Empty}
            url={bestImageURL(post.post, false, 2048)}
            class="self-start max-w-full"
          >
            <svelte:element
              this={$userSettings.expandImages ? 'div' : 'a'}
              href={postLink(post.post)}
              class="self-start overflow-hidden z-10 relative bg-slate-200 dark:bg-zinc-800 rounded-md max-w-full"
              data-sveltekit-preload-data="off"
              aria-label={post.post.name}
            >
              <picture
                class="rounded-md overflow-hidden max-h-[min(50vh,500px)] w-full max-w-full"
              >
                <source
                  srcset={bestImageURL(post.post, false, 512)}
                  media="(max-width: 256px)"
                />
                <source
                  srcset={bestImageURL(post.post, false, 512)}
                  media="(max-width: 512px)"
                />
                <!-- svelte-ignore a11y-missing-attribute -->
                <img
                  src={bestImageURL(post.post, false, 1024)}
                  loading="lazy"
                  class="max-w-full w-max object-cover rounded-md max-h-[80vh] h-auto z-30 opacity-0 transition-opacity duration-300"
                  class:opacity-100={loaded}
                  width={512}
                  height={300}
                  class:blur-3xl={post.post.nsfw && $userSettings.nsfwBlur}
                  on:load={() => (loaded = true)}
                />
              </picture>
            </svelte:element>
          </svelte:component>
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
      {#if post.post.body && !post.post.nsfw && (view == 'list' || view == 'card')}
        <div
          class="text-sm relative overflow-hidden {view == 'list'
            ? `text-zinc-600 dark:text-zinc-400 max-h-24`
            : 'text-slate-600 dark:text-zinc-400 max-h-48'} paragraph"
        >
          <Markdown inline source={post.post.body.slice(0, 400)} />
          {#if post.post.body.length > (view == 'list' ? 200 : 600)}
            <div
              class="absolute bottom-0 w-full h-16 bg-gradient-to-b {view ==
              'list'
                ? `dark:from-zinc-950/0 dark:to-zinc-950
                  from-slate-25/0 to-slate-25 group-hover:from-slate-100/0 group-hover:to-slate-100
                  transition-all group-hover:dark:from-zinc-900/0 group-hover:dark:to-zinc-900`
                : 'dark:from-zinc-900/0 dark:to-zinc-900 from-white/0 to-white'}"
            />
          {/if}
        </div>
      {/if}
    </div>
    {#if ($userSettings.view == 'list' || $userSettings.view == 'compact') && (post.post.thumbnail_url || isImage(post.post.url))}
      <div class="flex-none w-24 h-24">
        {#if !$userSettings.expandImages || (post.post.thumbnail_url && !isImage(post.post.url))}
          <a href={postLink(post.post)}>
            <!-- svelte-ignore a11y-missing-attribute -->
            <img
              src={bestImageURL(post.post, true)}
              loading="lazy"
              class="object-cover bg-slate-100 rounded-md h-24 w-24 border border-slate-200 dark:border-zinc-700"
            />
          </a>
        {:else}
          <ExpandableImage url={bestImageURL(post.post, false, 2048)}>
            <!-- svelte-ignore a11y-missing-attribute -->
            <img
              src={bestImageURL(post.post, true)}
              loading="lazy"
              class="object-cover bg-slate-100 rounded-md h-24 w-24 border border-slate-200 dark:border-zinc-700"
            />
          </ExpandableImage>
        {/if}
      </div>
    {/if}
  </div>
  {#if actions}
    <div class="w-full" class:mt-2={view == 'list'}>
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
</Material>
