<script lang="ts">
  import { page } from '$app/state'
  import { profile } from '$lib/auth.svelte.js'
  import Markdown from '$lib/components/markdown/Markdown.svelte'
  import EndPlaceholder from '$lib/components/ui/EndPlaceholder.svelte'
  import Expandable from '$lib/components/ui/Expandable.svelte'
  import Placeholder from '$lib/components/ui/Placeholder.svelte'
  import { publishedToDate } from '$lib/components/util/date.js'
  import FormattedNumber from '$lib/components/util/FormattedNumber.svelte'
  import { t } from '$lib/i18n/translations.js'
  import { client } from '$lib/client/lemmy.svelte'
  import { resumables } from '$lib/lemmy/item.js'
  import { postFeeds } from '$lib/lemmy/postfeed.svelte'
  import { ReactiveState } from '$lib/util.svelte'
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
  import {
    mediaType,
    parseTags,
    Post,
    PostActions,
    postLink,
    PostMedia,
    PostMeta,
  } from '$lib/components/lemmy/post'

  let { data } = $props()

  onMount(() => {
    resumables.add({
      name: data.post.value.post_view.post.name,
      type: 'post',
      url: page.url.toString(),
      avatar: data.post.value.post_view.post.thumbnail_url,
    })

    if (
      !(data.post.value.post_view.read && settings.markPostsAsRead) &&
      profile.current?.jwt
    ) {
      client()
        .markPostAsRead({
          read: true,
          post_ids: [data.post.value.post_view.post.id],
        })
        .then(() => (data.post.value.post_view.read = true))
    }
  })

  $effect(() => {
    data.post.value.meta.then(
      (res) => (data.post.value.post_view = res.post_view),
    )
  })

  $effect(() => {
    if (data.cachedFeed && data.post.value.post_view) {
      const { id, index } = data.cachedFeed!
      postFeeds.value[id].data.posts.posts[index] = data.post.value.post_view
    }
  })

  let loading = $state(false)

  async function reloadComments() {
    loading = true
    data.comments.value = client().getComments({
      page: 1,
      limit: 25,
      type_: 'All',
      post_id: data.post.value.post_view.post.id,
      sort: settings.defaultSort.comments,
      max_depth: data.post.value.post_view.counts.comments > 100 ? 1 : 3,
    })
    loading = false
    data.thread.value.singleThread = false
  }
</script>

<svelte:head>
  <title>
    {data.post.value.post_view.community.title} | {data.post.value.post_view
      .post.name}
  </title>
  <meta property="og:title" content={data.post.value.post_view.post.name} />
  {#if !data.post.value.post_view.post.local}
    <meta name="robots" content="noindex, follow" />
  {/if}
  <link rel="canonical" href={data.post.value.post_view.post.ap_id} />
  {#if data.post.value.post_view.post.body}
    <meta
      property="description"
      content={data.post.value.post_view.post.body.slice(0, 500)}
    />
    <meta
      property="og:description"
      content={data.post.value.post_view.post.body.slice(0, 500)}
    />
    <meta
      property="twitter:description"
      content={data.post.value.post_view.post.body.slice(0, 500)}
    />
  {/if}
  <meta property="og:url" content={page.url.toString()} />
  {#if mediaType(data.post.value.post_view.post.url) == 'image'}
    <meta property="og:image" content={data.post.value.post_view.post.url} />
    <meta
      property="twitter:card"
      content={data.post.value.post_view.post.url}
    />
  {:else if data.post.value.post_view.post.thumbnail_url}
    <meta
      property="og:image"
      content={data.post.value.post_view.post.thumbnail_url}
    />
    <meta
      property="twitter:card"
      content={data.post.value.post_view.post.thumbnail_url}
    />
  {/if}
</svelte:head>

<article class="flex flex-col gap-2">
  <header class="flex flex-col gap-2">
    <div class="flex flex-row items-center gap-2 flex-wrap">
      <PostMeta
        community={data.post.value.post_view.community}
        user={data.post.value.post_view.creator}
        subscribed={profile.current.user?.follows.find(
          (i) => i.community.id == data.post.value.post_view.community.id,
        )
          ? 'Subscribed'
          : 'NotSubscribed'}
        badges={{
          deleted: data.post.value.post_view.post.deleted,
          removed: data.post.value.post_view.post.removed,
          locked: data.post.value.post_view.post.locked,
          featured:
            data.post.value.post_view.post.featured_community ||
            data.post.value.post_view.post.featured_local,
          nsfw: data.post.value.post_view.post.nsfw,
          saved: data.post.value.post_view.saved,
          admin: data.post.value.post_view.creator_is_admin,
          moderator: data.post.value.post_view.creator_is_moderator,
        }}
        published={publishedToDate(data.post.value.post_view.post.published)}
        edited={data.post.value.post_view.post.updated}
        title={data.post.value.post_view.post.name}
        style="width: max-content;"
        tags={parseTags(data.post.value.post_view.post.name).tags}
      />
    </div>
    <h1 class="font-medium text-xl leading-5">
      <Markdown
        source={parseTags(data.post.value.post_view.post.name).title ??
          data.post.value.post_view.post.name}
        inline
      />
    </h1>
  </header>
  <PostMedia
    type={mediaType(data.post.value.post_view.post.url)}
    post={data.post.value.post_view.post}
    opened
    view="cozy"
  />
  {#if data.post.value.post_view.post.body}
    <div class="text-base text-slate-800 dark:text-zinc-300 leading-normal">
      <Markdown source={data.post.value.post_view.post.body} />
    </div>
  {/if}
  <div class="w-full relative">
    <PostActions
      post={data.post.value.post_view}
      onedit={() =>
        toast({
          content: 'The post was edited successfully.',
          type: 'success',
        })}
    />
  </div>
  {#await data.post.value.meta then meta}
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
{#await data.comments.value then comments}
  {#if data.thread.value.showContext || data.thread.value.singleThread}
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
        href={data.thread.value.showContext
          ? `/comment/${
              // split first comment path to get 5 before
              comments.comments[0].comment.path.split('.').slice(-5)[1]
            }`
          : data.thread.value.singleThread
            ? postLink(data.post.value.post_view.post)
            : undefined}
        class="hover:bg-white/50 dark:hover:bg-zinc-800/30"
      >
        {data.thread.value.showContext
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
          <FormattedNumber number={data.post.value.post_view.counts.comments} />
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
  {#await data.comments.value}
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
  {:then passedComments}
    {@const comments = new ReactiveState(passedComments)}
    <CommentProvider
      comments={comments.value}
      post={data.post.value.post_view}
      focus={data.thread.value.focus}
      onupdate={reloadComments}
      bind:sort={data.commentSort.value}
      virtualize={!page.url.searchParams.get('noVirtualize')}
    />
    {#if comments.value.comments.length == 0}
      <Placeholder
        icon={ChatBubbleLeftRight}
        title={$t('routes.post.emptyComments.title')}
        description={$t('routes.post.emptyComments.description')}
      ></Placeholder>
    {/if}
  {/await}
  {#if data.post.value.post_view.counts.comments > 5}
    <EndPlaceholder>
      {$t('routes.post.commentCount')}

      {#snippet action()}
        <span class="text-black dark:text-white font-bold">
          {data.post.value.post_view.counts.comments}
        </span>
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
