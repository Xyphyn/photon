<script lang="ts">
  import { page } from '$app/state'
  import { client } from '$lib/api/client.svelte'
  import { profile } from '$lib/app/auth'
  import { t } from '$lib/app/i18n'
  import Markdown from '$lib/app/markdown/Markdown.svelte'
  import { settings } from '$lib/app/settings.svelte'
  import { repos } from '$lib/feature/feeds/repo.svelte'
  import { resumables } from '$lib/feature/legacy/item'
  import { mediaType, PostActions, PostItem, PostMedia, PostMeta } from '$lib/feature/post'
  import Skeleton from '$lib/ui/generic/Skeleton.svelte'
  import Placeholder from '$lib/ui/info/Placeholder.svelte'
  import { CommonList } from '$lib/ui/layout'
  import EndPlaceholder from '$lib/ui/layout/EndPlaceholder.svelte'
  import { publishedToDate } from '$lib/ui/util/date'
  import FormattedNumber from '$lib/ui/util/FormattedNumber.svelte'
  import { Button, Expandable, toast } from 'mono-svelte'
  import { onMount } from 'svelte'
  import { ChatBubbleLeftRight, ChevronDoubleUp } from 'svelte-hero-icons/dist'
  import CommentProvider from './CommentProvider.svelte'

  let { data } = $props()

  let post = $derived(repos.posts.get(data.post))

  onMount(() => {
    resumables.add({
      name: post.post.name,
      type: 'post',
      url: page.url.toString(),
      avatar: post.post.thumbnail_url,
    })

    if (!(post.read && settings.markPostsAsRead) && profile.current?.jwt) {
      post.markRead()
    }
  })

  async function reloadComments() {
    data.comments = client()
      .getComments({
        type_: 'all',
        post_id: post.post.id,
        sort: settings.defaultSort.comments,
        max_depth: post.post.comments > 100 ? 1 : 3,
      })
      .then((i) => i.items)
    data.params.thread.singleThread = false
  }
</script>

<svelte:head>
  <title>
    {post.community.title} | {post.post.name}
  </title>
  <meta property="og:title" content={post.post.name} />
  {#if !post.post.local}
    <meta name="robots" content="noindex, follow" />
  {/if}
  <link rel="canonical" href={post.post.ap_id} />
  {#if post.post.body}
    <meta property="description" content={post.post.body.slice(0, 500)} />
    <meta property="og:description" content={post.post.body.slice(0, 500)} />
    <meta property="twitter:description" content={post.post.body.slice(0, 500)} />
  {/if}
  <meta property="og:url" content={page.url.toString()} />
  {#if mediaType(post.post.url) == 'image'}
    <meta property="og:image" content={post.post.url} />
    <meta property="twitter:card" content={post.post.url} />
  {:else if post.post.thumbnail_url}
    <meta property="og:image" content={post.post.thumbnail_url} />
    <meta property="twitter:card" content={post.post.thumbnail_url} />
  {/if}
</svelte:head>

<article class="flex flex-col gap-2">
  <header class="flex flex-col gap-2">
    <div class="flex flex-row items-center gap-2 flex-wrap">
      <PostMeta
        community={post.community}
        user={post.creator}
        subscribed={profile.current.user?.follows?.find(
          (i) => i.community.id == post.community.id,
        ) != null}
        badges={post.badges}
        published={publishedToDate(post.post.published_at)}
        edited={post.post.updated_at}
        title={post.post.name}
        tags={post.tags}
        style="width: max-content;"
      />
    </div>
    <h1 class="font-medium font-display text-xl leading-5 tracking-tight">
      <Markdown inline source={post.post.name} />
    </h1>
  </header>
  <PostMedia {post} opened view="cozy" autoplay={false} />
  {#if post.post.body}
    <div class="text-base text-slate-800 dark:text-zinc-300 leading-normal">
      <Markdown source={post.post.body} />
    </div>
  {/if}
  <div class="w-full relative">
    <PostActions
      bind:post
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
          <EndPlaceholder size="md" color="none" class="w-full ">
            {$t('routes.post.crosspostCount')}
            {#snippet action()}
              <span class="font-bold">
                <FormattedNumber number={crossposts.length} />
              </span>
            {/snippet}
          </EndPlaceholder>
        {/snippet}
        <CommonList items={crossposts}>
          {#snippet item(item)}
            <PostItem post={item} />
          {/snippet}
        </CommonList>
      </Expandable>
    {/if}
  {/await}
</article>
<section class="flex flex-col gap-2 w-full" id="comments">
  <header class="mt-4">
    <EndPlaceholder size="md" color="none">
      {$t('routes.post.commentCount')}
      {#snippet action()}
        <span class="font-bold">
          <FormattedNumber number={post.post.comments} />
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
          class="animate-pop-in"
          style="animation-delay: {index * 50}ms; opacity: 0; width: {(1 / ((index + 1) % 3)) *
            100}%"
        >
          <Skeleton size="sm" />
        </div>
      {/each}
    </div>
  {:then comments}
    <CommentProvider
      {comments}
      post={post.data}
      focus={data.params.thread.focus}
      onupdate={reloadComments}
      bind:sort={data.params.comments.sort}
      virtualize={!page.url.searchParams.get('noVirtualize')}
      showContext={data.params.thread.showContext}
      singleThread={data.params.thread.singleThread}
    />
    {#if comments.length == 0}
      <Placeholder
        icon={ChatBubbleLeftRight}
        title={$t('routes.post.emptyComments.title')}
        description={$t('routes.post.emptyComments.description')}
      ></Placeholder>
    {/if}
  {/await}
  {#if post.post.comments > 5}
    <EndPlaceholder>
      {$t('routes.post.commentCount')}
      {#snippet action()}
        <span class="text-black dark:text-white font-bold">
          {post.post.comments}
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
