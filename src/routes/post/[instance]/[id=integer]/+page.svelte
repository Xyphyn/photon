<script lang="ts">
  import { page } from '$app/state'
  import { client } from '$lib/api/client.svelte'
  import { profile } from '$lib/app/auth'
  import { t } from '$lib/app/i18n'
  import Markdown from '$lib/app/markdown/Markdown.svelte'
  import { settings } from '$lib/app/settings.svelte'
  import { resumables } from '$lib/feature/legacy/item'
  import {
    mediaType,
    parseTags,
    PostActions,
    PostItem,
    PostMedia,
    PostMeta,
    type Tag,
  } from '$lib/feature/post'
  import Placeholder from '$lib/ui/info/Placeholder.svelte'
  import { CommonList } from '$lib/ui/layout'
  import EndPlaceholder from '$lib/ui/layout/EndPlaceholder.svelte'
  import { publishedToDate } from '$lib/ui/util/date'
  import FormattedNumber from '$lib/ui/util/FormattedNumber.svelte'
  import { Button, Expandable, toast } from 'mono-svelte'
  import { onMount } from 'svelte'
  import { ChatBubbleLeftRight, ChevronDoubleUp } from 'svelte-hero-icons/dist'
  import { expoOut } from 'svelte/easing'
  import { fly } from 'svelte/transition'
  import CommentProvider from './CommentProvider.svelte'

  let { data } = $props()

  onMount(() => {
    data.data.value.meta.then((i) => data.data.value.post == i.post_view)

    resumables.add({
      name: data.data.value.post.post.name,
      type: 'post',
      url: page.url.toString(),
      avatar: data.data.value.post.post.thumbnail_url,
    })

    if (
      !(data.data.value.post.read && settings.markPostsAsRead) &&
      profile.current?.jwt
    ) {
      client()
        .markPostAsRead({
          read: true,
          post_ids: [data.data.value.post.post.id],
        })
        .then(() => (data.data.value.post.read = true))
    }
  })

  async function reloadComments() {
    data.data.value.comments = client()
      .getComments({
        page: 1,
        limit: 25,
        type_: 'All',
        post_id: data.data.value.post.post.id,
        sort: settings.defaultSort.comments,
        max_depth: data.data.value.post.counts.comments > 100 ? 1 : 3,
      })
      .then((i) => i.comments)
    data.data.value.params.thread.singleThread = false
  }

  let tags = $derived.by<{ title?: string; tags: Tag[] }>(() => {
    const parsed = parseTags(data.data.value.post.post.name)

    return {
      title: parsed.title,
      tags: [
        ...parsed.tags,
        ...(data.data.value.post.flair_list?.map((i) => ({
          content: i.flair_title,
          color: i.background_color,
          icon: null,
          textColor: i.text_color,
          type: 'flair' as 'flair' | 'custom',
        })) ?? []),
      ],
    }
  })
</script>

<svelte:head>
  <title>
    {data.data.value.post.community.title} | {data.data.value.post.post.name}
  </title>
  <meta property="og:title" content={data.data.value.post.post.name} />
  {#if !data.data.value.post.post.local}
    <meta name="robots" content="noindex, follow" />
  {/if}
  <link rel="canonical" href={data.data.value.post.post.ap_id} />
  {#if data.data.value.post.post.body}
    <meta
      property="description"
      content={data.data.value.post.post.body.slice(0, 500)}
    />
    <meta
      property="og:description"
      content={data.data.value.post.post.body.slice(0, 500)}
    />
    <meta
      property="twitter:description"
      content={data.data.value.post.post.body.slice(0, 500)}
    />
  {/if}
  <meta property="og:url" content={page.url.toString()} />
  {#if mediaType(data.data.value.post.post.url) == 'image'}
    <meta property="og:image" content={data.data.value.post.post.url} />
    <meta property="twitter:card" content={data.data.value.post.post.url} />
  {:else if data.data.value.post.post.thumbnail_url}
    <meta
      property="og:image"
      content={data.data.value.post.post.thumbnail_url}
    />
    <meta
      property="twitter:card"
      content={data.data.value.post.post.thumbnail_url}
    />
  {/if}
</svelte:head>

<article class="flex flex-col gap-2">
  <header class="flex flex-col gap-2">
    <div class="flex flex-row items-center gap-2 flex-wrap">
      <PostMeta
        community={data.data.value.post.community}
        user={data.data.value.post.creator}
        subscribed={profile.current.user?.follows.find(
          (i) => i.community.id == data.data.value.post.community.id,
        )
          ? 'Subscribed'
          : 'NotSubscribed'}
        badges={{
          deleted: data.data.value.post.post.deleted,
          removed: data.data.value.post.post.removed,
          locked: data.data.value.post.post.locked,
          featured:
            data.data.value.post.post.featured_community ||
            data.data.value.post.post.featured_local,
          nsfw: data.data.value.post.post.nsfw,
          saved: data.data.value.post.saved,
          admin: data.data.value.post.creator_is_admin,
          moderator: data.data.value.post.creator_is_moderator,
        }}
        published={publishedToDate(data.data.value.post.post.published)}
        edited={data.data.value.post.post.updated}
        title={data.data.value.post.post.name}
        style="width: max-content;"
        tags={tags.tags}
      />
    </div>
    <h1 class="font-medium font-display text-xl leading-5 tracking-tight">
      <Markdown inline source={tags.title ?? data.data.value.post.post.name} />
    </h1>
  </header>
  <PostMedia
    type={mediaType(data.data.value.post.post)}
    post={data.data.value.post.post}
    opened
    view="cozy"
    autoplay={false}
  />
  {#if data.data.value.post.post.body}
    <div class="text-base text-slate-800 dark:text-zinc-300 leading-normal">
      <Markdown source={data.data.value.post.post.body} />
    </div>
  {/if}
  <div class="w-full relative">
    <PostActions
      bind:post={data.data.value.post}
      onedit={() =>
        toast({
          content: 'The post was edited successfully.',
          type: 'success',
        })}
    />
  </div>
  {#await data.data.value.meta then meta}
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
          <FormattedNumber number={data.data.value.post.counts.comments} />
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
  {#await data.data.value.comments}
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
      post={data.data.value.post}
      focus={data.data.value.params.thread.focus}
      onupdate={reloadComments}
      bind:sort={data.data.value.params.comments.sort}
      virtualize={!page.url.searchParams.get('noVirtualize')}
      showContext={data.data.value.params.thread.showContext}
      singleThread={data.data.value.params.thread.singleThread}
    />
    {#if comments.length == 0}
      <Placeholder
        icon={ChatBubbleLeftRight}
        title={$t('routes.post.emptyComments.title')}
        description={$t('routes.post.emptyComments.description')}
      ></Placeholder>
    {/if}
  {/await}
  {#if data.data.value.post.counts.comments > 5}
    <EndPlaceholder>
      {$t('routes.post.commentCount')}
      {#snippet action()}
        <span class="text-black dark:text-white font-bold">
          {data.data.value.post.counts.comments}
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
