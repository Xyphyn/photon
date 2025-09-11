<script lang="ts">
  import { page } from '$app/state'
  import { profile } from '$lib/auth.svelte.js'
  import { client } from '$lib/client/lemmy.svelte'
  import {
    mediaType,
    parseTags,
    Post,
    PostActions,
    postLink,
    PostMedia,
    PostMeta,
  } from '$lib/components/lemmy/post'
  import Markdown from '$lib/components/markdown/Markdown.svelte'
  import EndPlaceholder from '$lib/components/ui/EndPlaceholder.svelte'
  import Expandable from '$lib/components/ui/Expandable.svelte'
  import Placeholder from '$lib/components/ui/Placeholder.svelte'
  import { publishedToDate } from '$lib/components/util/date.js'
  import FormattedNumber from '$lib/components/util/FormattedNumber.svelte'
  import { t } from '$lib/i18n/translations.js'
  import { resumables } from '$lib/lemmy/item.js'
  import { settings } from '$lib/settings.svelte.js'
  import { Button, toast } from 'mono-svelte'
  import { onMount } from 'svelte'
  import {
    ArrowRight,
    ChatBubbleLeftRight,
    ChevronDoubleUp,
    Icon,
  } from 'svelte-hero-icons'
  import { expoOut } from 'svelte/easing'
  import { fly } from 'svelte/transition'
  import CommentProvider from './CommentProvider.svelte'

  let { data } = $props()

  onMount(() => {
    resumables.add({
      name: data.post.post.name,
      type: 'post',
      url: page.url.toString(),
      avatar: data.post.post.thumbnail_url,
    })

    if (!(data.post.read && settings.markPostsAsRead) && profile.current?.jwt) {
      client()
        .markPostAsRead({
          read: true,
          post_ids: [data.post.post.id],
        })
        .then(() => (data.post.read = true))
    }
  })

  // $effect(() => {
  //   if (data.post && data.cachedFeed) {
  //     const { id, index } = data.cachedFeed
  //     updateFeed(id, (current) => ({
  //       ...current,
  //       data: {
  //         ...current.data,
  //         posts: current.data.posts.toSpliced(
  //           index,
  //           1,
  //           data.post,
  //         ),
  //       },
  //     }))
  //   }
  // })

  let loading = $state(false)

  async function reloadComments() {
    loading = true
    data.comments = client()
      .getComments({
        page: 1,
        limit: 25,
        type_: 'All',
        post_id: data.post.post.id,
        sort: settings.defaultSort.comments,
        max_depth: data.post.counts.comments > 100 ? 1 : 3,
      })
      .then((i) => i.comments)
    loading = false
    data.thread.singleThread = false
  }
</script>

<svelte:head>
  <title>
    {data.post.community.title} | {data.post.post.name}
  </title>
  <meta property="og:title" content={data.post.post.name} />
  {#if !data.post.post.local}
    <meta name="robots" content="noindex, follow" />
  {/if}
  <link rel="canonical" href={data.post.post.ap_id} />
  {#if data.post.post.body}
    <meta property="description" content={data.post.post.body.slice(0, 500)} />
    <meta
      property="og:description"
      content={data.post.post.body.slice(0, 500)}
    />
    <meta
      property="twitter:description"
      content={data.post.post.body.slice(0, 500)}
    />
  {/if}
  <meta property="og:url" content={page.url.toString()} />
  {#if mediaType(data.post.post.url) == 'image'}
    <meta property="og:image" content={data.post.post.url} />
    <meta property="twitter:card" content={data.post.post.url} />
  {:else if data.post.post.thumbnail_url}
    <meta property="og:image" content={data.post.post.thumbnail_url} />
    <meta property="twitter:card" content={data.post.post.thumbnail_url} />
  {/if}
</svelte:head>

<article class="flex flex-col gap-2">
  <header class="flex flex-col gap-2">
    <div class="flex flex-row items-center gap-2 flex-wrap">
      <PostMeta
        community={data.post.community}
        user={data.post.creator}
        subscribed={profile.current.user?.follows.find(
          (i) => i.community.id == data.post.community.id,
        )
          ? 'Subscribed'
          : 'NotSubscribed'}
        badges={{
          deleted: data.post.post.deleted,
          removed: data.post.post.removed,
          locked: data.post.post.locked,
          featured:
            data.post.post.featured_community || data.post.post.featured_local,
          nsfw: data.post.post.nsfw,
          saved: data.post.saved,
          admin: data.post.creator_is_admin,
          moderator: data.post.creator_is_moderator,
        }}
        published={publishedToDate(data.post.post.published)}
        edited={data.post.post.updated}
        title={data.post.post.name}
        style="width: max-content;"
        tags={parseTags(data.post.post.name).tags}
      />
    </div>
    <h1 class="font-medium text-xl leading-5">
      <Markdown
        source={parseTags(data.post.post.name).title ?? data.post.post.name}
        inline
      />
    </h1>
  </header>
  <PostMedia
    type={mediaType(data.post.post.url)}
    post={data.post.post}
    opened
    view="cozy"
  />
  {#if data.post.post.body}
    <div class="text-base text-slate-800 dark:text-zinc-300 leading-normal">
      <Markdown source={data.post.post.body} />
    </div>
  {/if}
  <div class="w-full relative">
    <PostActions
      bind:post={data.post}
      onedit={() =>
        toast({
          content: 'The post was edited successfully.',
          type: 'success',
        })}
    />
  </div>
  {#await data.meta then meta}
    {@const crossposts = meta.cross_posts}
    {#if crossposts?.length > 0}
      <Expandable class="text-base mt-2 w-full cursor-pointer">
        {#snippet title()}
          <EndPlaceholder size="md" color="none" class="w-full">
            {$t('routes.post.crosspostCount')}
            {#snippet action()}
              <span class="font-bold">
                <FormattedNumber number={crossposts.length} />
              </span>
            {/snippet}
          </EndPlaceholder>
        {/snippet}
        <div
          class="divide-y! divide-slate-200 dark:divide-zinc-800 flex flex-col"
        >
          {#key crossposts}
            {#each crossposts as crosspost (crosspost.post.id)}
              <Post view="compact" post={crosspost} />
            {/each}
          {/key}
        </div>
      </Expandable>
    {/if}
  {/await}
</article>
{#await data.comments then comments}
  {#if data.thread.showContext || data.thread.singleThread}
    <div
      class="sticky mx-auto z-50 max-w-md min-w-0 flex flex-col items-center overflow-auto gap-1
    bg-slate-50/50 dark:bg-zinc-900/50 backdrop-blur-xl border border-slate-200/50 dark:border-zinc-800/50
    p-1 rounded-full justify-between top-6 lg:top-22"
    >
      <Button
        color="none"
        rounding="pill"
        {loading}
        disabled={loading}
        href={data.thread.showContext
          ? `/comment/${
              // split first comment path to get 5 before
              comments[0].comment.path.split('.').slice(-5)[1]
            }`
          : data.thread.singleThread
            ? postLink(data.post.post)
            : undefined}
        class="hover:bg-white/50 dark:hover:bg-zinc-800/30"
      >
        {data.thread.showContext
          ? $t('routes.post.thread.context')
          : $t('routes.post.thread.allComments')}
        {#snippet suffix()}
          <Icon src={ArrowRight} size="16" micro />
        {/snippet}
      </Button>
    </div>
  {/if}
{/await}
<section class="flex flex-col gap-2 w-full" id="comments">
  <header class="mt-4">
    <EndPlaceholder size="md" color="none">
      {$t('routes.post.commentCount')}
      {#snippet action()}
        <span class="font-bold">
          <FormattedNumber number={data.post.counts.comments} />
        </span>
      {/snippet}
    </EndPlaceholder>
  </header>
  {#if !page.url.searchParams.get('noVirtualize')}
    <noscript>
      <Button href="?noVirtualize=true" class="block">
        {$t('routes.post.loadComments')}
      </Button>
    </noscript>
  {/if}
  {#await data.comments}
    <div class="flex flex-col gap-4">
      {#each new Array(10) as _, index}
        {_}
        <div
          in:fly|global={{
            duration: 500,
            easing: expoOut,
            y: 8,
            delay: index * 50,
          }}
          class="animate-pulse flex flex-col gap-2 w-full
        *:bg-slate-100 dark:*:bg-zinc-800 *:rounded-md"
        >
          <div class="w-96 h-3"></div>
          <div class="w-full h-12"></div>
          <div class="w-48 h-4"></div>
        </div>
      {/each}
    </div>
  {:then comments}
    <CommentProvider
      {comments}
      post={data.post}
      focus={data.thread.focus}
      onupdate={reloadComments}
      bind:sort={data.params.comments.sort}
      virtualize={!page.url.searchParams.get('noVirtualize')}
    />
    {#if comments.length == 0}
      <Placeholder
        icon={ChatBubbleLeftRight}
        title={$t('routes.post.emptyComments.title')}
        description={$t('routes.post.emptyComments.description')}
      ></Placeholder>
    {/if}
  {/await}
  {#if data.post.counts.comments > 5}
    <EndPlaceholder>
      <span class="text-black dark:text-white font-bold">
        {data.post.counts.comments}
      </span>
      {$t('routes.post.commentCount')}

      {#snippet action()}
        <Button
          color="tertiary"
          onclick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          icon={ChevronDoubleUp}
        >
          {$t('routes.post.scrollToTop')}
        </Button>
      {/snippet}
    </EndPlaceholder>
  {/if}
</section>
