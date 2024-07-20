<script lang="ts">
  import {
    buildCommentsTree,
    buildCommentsTreeAsync,
  } from '$lib/components/lemmy/comment/comments.js'
  import Comments from '$lib/components/lemmy/comment/Comments.svelte'
  import { isImage, isVideo } from '$lib/ui/image.js'
  import { getClient, site } from '$lib/lemmy.js'
  import CommentForm from '$lib/components/lemmy/comment/CommentForm.svelte'
  import { onMount } from 'svelte'
  import Markdown from '$lib/components/markdown/Markdown.svelte'
  import { page } from '$app/stores'
  import PostActions from '$lib/components/lemmy/post/PostActions.svelte'
  import {
    ArrowLeft,
    ArrowPath,
    ChevronDoubleUp,
    Icon,
    InformationCircle,
    Home,
  } from 'svelte-hero-icons'
  import PostLink from '$lib/components/lemmy/post/PostLink.svelte'
  import PostMeta from '$lib/components/lemmy/post/PostMeta.svelte'
  import { Material, Select, Spinner, removeToast, toast } from 'mono-svelte'
  import type { CommentSortType } from 'lemmy-js-client'
  import { profile } from '$lib/auth.js'
  import { instance } from '$lib/instance.js'
  import { afterNavigate, goto } from '$app/navigation'
  import FormattedNumber from '$lib/components/util/FormattedNumber.svelte'
  import { Button } from 'mono-svelte'
  import EndPlaceholder from '$lib/components/ui/EndPlaceholder.svelte'
  import { userSettings } from '$lib/settings.js'
  import { feature } from '$lib/version.js'
  import { publishedToDate } from '$lib/components/util/date.js'
  import PostMedia from '$lib/components/lemmy/post/media/PostMedia.svelte'
  import {
    bestImageURL,
    mediaType,
    optimizeImageURL,
  } from '$lib/components/lemmy/post/helpers.js'
  import Post from '$lib/components/lemmy/post/Post.svelte'
  import Expandable from '$lib/components/ui/Expandable.svelte'
  import { Popover } from 'mono-svelte'
  import { t } from '$lib/translations.js'
  import { createWindowVirtualizer } from '@tanstack/svelte-virtual'
  import { resumables } from '$lib/lemmy/item.js'

  export let data

  let post = data.post

  $: type = mediaType(post.post_view.post.url, 'cozy')

  onMount(async () => {
    if (
      !(post.post_view.read && $userSettings.markPostsAsRead) &&
      $profile?.jwt
    ) {
      getClient().markPostAsRead({
        read: $userSettings.markPostsAsRead,
        post_ids: [post.post_view.post.id],
        // @ts-ignore
        post_id: post.post_view.post.id,
      })
    }

    if (!$resumables.find((r) => r.url == $page.url.toString()))
      $resumables = [
        ...$resumables,
        {
          id: Math.floor(Math.random() * 1000000),
          name: post.post_view.post.name,
          type: 'post',
          url: $page.url.toString(),
          avatar: post.post_view.post.thumbnail_url,
        },
      ]
  })

  afterNavigate(async () => {
    // reactivity hack
    post = data.post
  })

  const fetchOnHome = async (jwt: string) => {
    const id = toast({
      content: $t('toast.fetchPostOnHome'),
      loading: true,
    })

    try {
      const res = await getClient().resolveObject({
        q: post.post_view.post.ap_id,
      })

      if (res.post) {
        removeToast(id)
        goto(`/post/${$instance}/${res.post.post.id}`, {}).then(() =>
          removeToast(id),
        )
      }
    } catch (err) {
      removeToast(id)
    }
  }

  let commentsPage = 1
  let commentSort: CommentSortType = data.commentSort
  let loading = false

  async function reloadComments() {
    loading = true
    data.comments = await getClient().getComments({
      page: 1,
      limit: 25,
      type_: 'All',
      post_id: post.post_view.post.id,
      sort: commentSort,
      max_depth: data.post.post_view.counts.comments > 100 ? 1 : 3,
    })
    loading = false
    data.thread.singleThread = false
    commentsPage = 1
  }

  let commenting = false

  $: remoteView =
    $page.params.instance?.toLowerCase() != $instance.toLowerCase()

  const virtualizer = createWindowVirtualizer({
    count: 0,
    estimateSize: () => 50,
  })

  onMount(async () => {
    const comments = await data.comments

    $virtualizer.setOptions({ count: comments.comments.length })
  })

  let virtualItemEls: HTMLElement[] = []

  $: items = $virtualizer.getVirtualItems()
  $: {
    if (virtualItemEls.length)
      virtualItemEls.forEach((el) => $virtualizer.measureElement(el))
  }
</script>

<svelte:head>
  <title>{post.post_view.post.name}</title>
  <meta property="og:title" content={post.post_view.post.name} />
  <meta property="twitter:title" content={post.post_view.post.name} />
  <meta property="og:url" content={$page.url.toString()} />
  {#if isImage(post.post_view.post.url)}
    <meta property="og:image" content={post.post_view.post.url} />
    <meta property="twitter:card" content={post.post_view.post.url} />
  {:else if post.post_view.post.thumbnail_url}
    <meta property="og:image" content={post.post_view.post.thumbnail_url} />
    <meta property="twitter:card" content={post.post_view.post.thumbnail_url} />
  {/if}
  {#if post.post_view.post.body}
    <meta property="og:description" content={post.post_view.post.body} />
    <meta property="twitter:description" content={post.post_view.post.body} />
  {/if}
</svelte:head>

<div class="flex flex-col gap-2">
  {#if remoteView}
    <div
      class="sticky top-0 bg-slate-50 dark:bg-zinc-950 z-20
      border-b dark:border-zinc-800 border-slate-300
      -mx-4 -mt-4 md:-mt-6 md:-mx-6 sticky-header px-4 py-2
      flex items-center gap-2 mb-4 h-12
      "
    >
      <Popover openOnHover>
        <Icon
          src={InformationCircle}
          size="24"
          solid
          slot="target"
          class="bg-slate-200 dark:bg-zinc-700 p-0.5 rounded-full text-primary-900 dark:text-primary-100"
        />
        {$t('routes.post.instanceWarning')}
      </Popover>
      <span class="text-primary-900 dark:text-primary-100 font-bold">
        {$t('routes.post.remoteView')}
      </span>
      {#if $profile?.jwt}
        <Button
          class="ml-auto"
          on:click={() => {
            if ($profile?.jwt) {
              fetchOnHome($profile?.jwt)
            }
          }}
        >
          <Icon src={Home} mini size="16" />
          {$t('routes.post.localView')}
        </Button>
      {/if}
    </div>
  {/if}

  <div class="flex flex-row justify-between items-center gap-2 flex-wrap">
    <div class="w-max">
      <PostMeta
        community={post.post_view.community}
        user={post.post_view.creator}
        bind:subscribed={post.community_view.subscribed}
        badges={{
          deleted: post.post_view.post.deleted,
          removed: post.post_view.post.removed,
          locked: post.post_view.post.locked,
          featured:
            post.post_view.post.featured_community ||
            post.post_view.post.featured_local,
          nsfw: post.post_view.post.nsfw,
          saved: post.post_view.saved,
          admin: post.post_view.creator_is_admin,
          moderator: post.post_view.creator_is_moderator,
        }}
        published={publishedToDate(post.post_view.post.published)}
        bind:title={post.post_view.post.name}
      />
    </div>
    <Button on:click={() => history.back()} size="square-md">
      <Icon src={ArrowLeft} mini size="16" slot="prefix" />
    </Button>
  </div>
  <h1 class="font-bold text-lg font-display leading-5">
    <Markdown source={post.post_view.post.name} inline />
  </h1>
  <PostMedia
    type={mediaType(post.post_view.post.url)}
    post={post.post_view.post}
    opened
  />
  {#if post.post_view.post.body}
    <div
      class="text-sm text-slate-800 dark:text-zinc-300 rounded-md leading-[22px]"
    >
      <Markdown source={post.post_view.post.body} />
    </div>
  {/if}
  <div class="w-full relative">
    <PostActions
      bind:post={post.post_view}
      on:edit={() =>
        toast({
          content: 'The post was edited successfully.',
          type: 'success',
        })}
      {type}
    />
  </div>
  {#if post.cross_posts?.length > 0}
    <Expandable
      class="text-base mt-2 w-full cursor-pointer"
      open={post.cross_posts?.length <= 3}
    >
      <div
        slot="title"
        class="inline-block w-full text-left text-base font-normal"
      >
        <span class="font-bold">{post.cross_posts.length}</span>
        {$t('routes.post.crosspostCount')}
      </div>
      <div
        class="!divide-y divide-slate-200 dark:divide-zinc-800 flex flex-col"
      >
        {#each post.cross_posts as crosspost}
          <Post view="compact" actions={false} post={crosspost} />
        {/each}
      </div>
    </Expandable>
  {/if}
</div>
{#if data.thread.showContext}
  <Material
    elevation="max"
    padding="none"
    color="distinct"
    class="py-2 px-4 text-sm flex flex-row justify-between items-center
flex-wrap gap-4 sticky top-20 w-full box-border z-20 mt-4"
  >
    <p class="font-medium text-sm flex items-center gap-2">
      <Icon src={InformationCircle} mini size="20" />
      {$t('routes.post.thread.part')}
    </p>
    <Button
      {loading}
      disabled={loading}
      href="/comment/{$page.params.instance}/{data.thread.showContext}"
    >
      {$t('routes.post.thread.context')}
    </Button>
  </Material>
{:else if data.thread.singleThread}
  <Material
    elevation="max"
    padding="none"
    color="distinct"
    class="py-2 px-4 text-sm flex sm:flex-row justify-between items-center
    sm:gap-4 sticky top-20 w-full box-border z-20 mt-4 flex-col gap-2"
  >
    <p class="font-medium text-sm flex items-center gap-2">
      <Icon src={InformationCircle} mini size="20" />
      {$t('routes.post.thread.single')}
    </p>
    <Button {loading} disabled={loading} on:click={reloadComments}>
      {$t('routes.post.thread.allComments')}
    </Button>
  </Material>
{/if}
<div class="mt-4 flex flex-col gap-2 w-full">
  <div class="flex flex-row justify-between flex-wrap gap-2">
    <div class="text-base">
      <span class="font-bold">
        <FormattedNumber number={post.post_view.counts.comments} />
      </span>
      {$t('routes.post.commentCount')}
    </div>
    <div class="gap-2 flex items-center h-8">
      <Select
        size="sm"
        class="!h-full"
        bind:value={commentSort}
        on:change={reloadComments}
      >
        <option value="Hot">{$t('filter.sort.hot')}</option>
        <option value="Top">{$t('filter.sort.top.label')}</option>
        <option value="New">{$t('filter.sort.new')}</option>
        <option value="Old">{$t('filter.sort.old')}</option>
        <option value="Controversial">{$t('filter.sort.controversial')}</option>
      </Select>
      <Button size="square-md" on:click={reloadComments}>
        <Icon src={ArrowPath} size="16" mini slot="prefix" />
      </Button>
    </div>
  </div>
  {#await data.comments}
    <div class="flex flex-col gap-4">
      {#each new Array(10) as empty}
        <div class="animate-pulse flex flex-col gap-2 skeleton w-full">
          <div class="w-96 h-4" />
          <div class="w-full h-12" />
          <div class="w-48 h-4" />
        </div>
      {/each}
    </div>
  {:then comments}
    {#if $profile?.jwt}
      <CommentForm
        postId={post.post_view.post.id}
        on:comment={(comment) =>
          (comments.comments = [
            comment.detail.comment_view,
            ...comments.comments,
          ])}
        locked={(post.post_view.post.locked &&
          !(
            $profile?.user?.local_user_view.local_user.admin ||
            $profile?.user?.moderates
              .map((c) => c.community.id)
              .includes(data.post.community_view.community.id)
          )) ||
          $page.params.instance.toLowerCase() != $instance.toLowerCase()}
        banned={data.post.community_view.banned_from_community}
        on:focus={() => (commenting = true)}
        tools={commenting}
        preview={commenting}
        placeholder={commenting ? undefined : $t('routes.post.addComment')}
        rows={commenting ? 7 : 1}
      />
    {/if}
    <Comments
      post={post.post_view.post}
      nodes={buildCommentsTree(
        comments.comments,
        undefined,
        (c) =>
          !(
            ($userSettings.hidePosts.deleted && c.comment.deleted) ||
            ($userSettings.hidePosts.removed && c.comment.removed)
          ),
      )}
      isParent={true}
    />
  {/await}
  {#if post.post_view.counts.comments > 5}
    <EndPlaceholder>
      <span class="text-black dark:text-white font-bold">
        {post.post_view.counts.comments}
      </span>
      {$t('routes.post.commentCount')}

      <Button
        color="tertiary"
        on:click={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        slot="action"
      >
        <Icon src={ChevronDoubleUp} mini size="16" slot="prefix" />
        {$t('routes.post.scrollToTop')}
      </Button>
    </EndPlaceholder>
  {/if}
</div>

<style lang="postcss">
  .skeleton * {
    @apply bg-slate-100 dark:bg-zinc-800 rounded-md;
  }
</style>
