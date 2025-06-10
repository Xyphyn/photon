<script lang="ts">
  import { page } from '$app/state'
  import { profile } from '$lib/auth.svelte.js'
  import { mediaType } from '$lib/components/lemmy/post/helpers.js'
  import PostMedia from '$lib/components/lemmy/post/media/PostMedia.svelte'
  import Post from '$lib/components/lemmy/post/Post.svelte'
  import PostActions from '$lib/components/lemmy/post/PostActions.svelte'
  import PostMeta, {
    parseTags,
  } from '$lib/components/lemmy/post/PostMeta.svelte'
  import Markdown from '$lib/components/markdown/Markdown.svelte'
  import EndPlaceholder from '$lib/components/ui/EndPlaceholder.svelte'
  import Expandable from '$lib/components/ui/Expandable.svelte'
  import Placeholder from '$lib/components/ui/Placeholder.svelte'
  import { publishedToDate } from '$lib/components/util/date.js'
  import FormattedNumber from '$lib/components/util/FormattedNumber.svelte'
  import { t } from '$lib/i18n/translations.js'
  import { getClient } from '$lib/lemmy.svelte.js'
  import { resumables } from '$lib/lemmy/item.js'
  import { settings } from '$lib/settings.svelte.js'
  import { isImage } from '$lib/ui/image.js'
  import { Button, toast } from 'mono-svelte'
  import { onMount } from 'svelte'
  import {
    ArrowLeft,
    ArrowRight,
    ChatBubbleLeftRight,
    ChevronDoubleUp,
    Icon,
  } from 'svelte-hero-icons'
  import { expoOut } from 'svelte/easing'
  import { fly } from 'svelte/transition'
  import CommentProvider from './CommentProvider.svelte'

  let { data } = $props()

  onMount(async () => {
    if (
      !(data.post.value.post_view.read && settings.markPostsAsRead) &&
      profile.data?.jwt
    ) {
      getClient().markPostAsRead({
        read: settings.markPostsAsRead,
        post_ids: [data.post.value.post_view.post.id],
      })
    }

    resumables.add({
      name: data.post.value.post_view.post.name,
      type: 'post',
      url: page.url.toString(),
      avatar: data.post.value.post_view.post.thumbnail_url,
    })
  })

  let loading = $state(false)

  async function reloadComments() {
    loading = true
    data.comments.value = getClient().getComments({
      page: 1,
      limit: 25,
      type_: 'All',
      post_id: data.post.value.post_view.post.id,
      sort: data.commentSort.value,
      max_depth: data.post.value.post_view.counts.comments > 100 ? 1 : 3,
    })
    loading = false
    data.thread.value.singleThread = false
  }
</script>

<svelte:head>
  <title>{data.post.value.post_view.post.name}</title>
  <meta property="og:title" content={data.post.value.post_view.post.name} />
  <meta
    property="twitter:title"
    content={data.post.value.post_view.post.name}
  />
  <meta property="og:url" content={page.url.toString()} />
  {#if isImage(data.post.value.post_view.post.url)}
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
</svelte:head>

<article class="flex flex-col gap-2">
  <header class="flex flex-col gap-2">
    <div class="flex flex-row justify-between items-center gap-2 flex-wrap">
      <PostMeta
        community={data.post.value.post_view.community}
        user={data.post.value.post_view.creator}
        bind:subscribed={data.post.value.community_view.subscribed}
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
      <Button onclick={() => history.back()} size="square-md">
        {#snippet prefix()}
          <Icon src={ArrowLeft} micro size="16" />
        {/snippet}
      </Button>
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
      bind:post={data.post.value.post_view}
      onedit={() =>
        toast({
          content: 'The post was edited successfully.',
          type: 'success',
        })}
    />
  </div>
  {#if data.post.value.cross_posts?.length > 0}
    {@const crossposts = data.post.value.cross_posts}
    <Expandable
      class="text-base mt-2 w-full cursor-pointer"
      open={crossposts?.length <= 3}
    >
      {#snippet title()}
        <div
          class="flex items-center gap-1 w-full text-left text-base font-normal"
        >
          <span class="font-bold">{crossposts.length}</span>
          {$t('routes.post.crosspostCount')}
          <hr
            class="flex-1 inline-block w-full border-slate-200 dark:border-zinc-800 mx-3"
          />
        </div>
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
</article>
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
        ? `/comment/${page.params.instance}/${data.thread.value.showContext}`
        : undefined}
      class="hover:bg-white/50 dark:hover:bg-zinc-800/30"
      onclick={data.thread.value.singleThread ? reloadComments : undefined}
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
<section class="mt-4 flex flex-col gap-2 w-full" id="comments">
  <header>
    <div class="text-base">
      <span class="font-bold">
        <FormattedNumber number={data.post.value.post_view.counts.comments} />
      </span>
      {$t('routes.post.commentCount')}
    </div>
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
  {:then comments}
    <CommentProvider
      {comments}
      post={data.post.value}
      focus={data.thread.value.focus}
      onupdate={reloadComments}
      bind:sort={data.commentSort.value}
      virtualize={!page.url.searchParams.get('noVirtualize')}
    />
    {#if comments.comments.length == 0}
      <Placeholder
        icon={ChatBubbleLeftRight}
        title={$t('routes.post.emptyComments.title')}
        description={$t('routes.post.emptyComments.description')}
      ></Placeholder>
    {/if}
  {/await}
  {#if data.post.value.post_view.counts.comments > 5}
    <EndPlaceholder>
      <span class="text-black dark:text-white font-bold">
        {data.post.value.post_view.counts.comments}
      </span>
      {$t('routes.post.commentCount')}

      {#snippet action()}
        <Button
          color="tertiary"
          onclick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          {#snippet prefix()}
            <Icon src={ChevronDoubleUp} mini size="16" />
          {/snippet}
          {$t('routes.post.scrollToTop')}
        </Button>
      {/snippet}
    </EndPlaceholder>
  {/if}
</section>
