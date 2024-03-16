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
    ExclamationTriangle,
    Icon,
    InformationCircle,
    Plus,
  } from 'svelte-hero-icons'
  import PostLink from '$lib/components/lemmy/post/PostLink.svelte'
  import PostMeta from '$lib/components/lemmy/post/PostMeta.svelte'
  import {
    Badge,
    Disclosure,
    Material,
    Select,
    Spinner,
    removeToast,
    toast,
  } from 'mono-svelte'
  import type { CommentSortType } from 'lemmy-js-client'
  import MultiSelect from '$lib/components/input/Switch.svelte'
  import { profile } from '$lib/auth.js'
  import { instance } from '$lib/instance.js'
  import { afterNavigate, goto } from '$app/navigation'
  import CommunityLink from '$lib/components/lemmy/community/CommunityLink.svelte'
  import Link from '$lib/components/input/Link.svelte'
  import SectionTitle from '$lib/components/ui/SectionTitle.svelte'
  import FormattedNumber from '$lib/components/util/FormattedNumber.svelte'
  import { Button } from 'mono-svelte'
  import EndPlaceholder from '$lib/components/ui/EndPlaceholder.svelte'
  import { userSettings } from '$lib/settings.js'
  import { feature } from '$lib/version.js'
  import { publishedToDate } from '$lib/components/util/date.js'
  import PostMedia from '$lib/components/lemmy/post/media/PostMedia.svelte'
  import { mediaType } from '$lib/components/lemmy/post/helpers.js'
  import Post from '$lib/components/lemmy/post/Post.svelte'
  import Expandable from '$lib/components/ui/Expandable.svelte'

  export let data

  let post = data.post

  onMount(async () => {
    if (
      !(post.post_view.read && $userSettings.markPostsAsRead) &&
      $profile?.jwt
    ) {
      getClient().markPostAsRead({
        read: $userSettings.markPostsAsRead,
        post_id: post.post_view.post.id,
      })
    }
  })

  afterNavigate(async () => {
    // reactivity hack
    post = data.post

    if ($page.params.instance.toLowerCase() != $instance.toLowerCase()) {
      if (!$profile?.jwt) return
      toast({
        content: 'Do you want to open this post on your home instance?',
        action: () => {
          if ($profile?.jwt) fetchOnHome($profile.jwt)
        },
        duration: 9999 * 1000,
      })
    }
  })

  const fetchOnHome = async (jwt: string) => {
    const id = toast({
      content: 'Attempting to fetch this post on your home instance...',
      loading: true,
    })

    try {
      const res = await getClient().resolveObject({
        q: post.post_view.post.ap_id,
      })

      if (res.post) {
        removeToast(id)
        goto(`/post/${$instance}/${res.post.post.id}`, {}).then(() =>
          removeToast(id)
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
    data.singleThread = false
    commentsPage = 1
  }

  let showCreateComment = false
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
  {#if $page.params.instance?.toLowerCase() != $instance.toLowerCase()}
    <Material
      class="p-4 flex flex-row gap-1 border
    border-yellow-300 dark:bg-yellow-950/30 dark:border-yellow-900 bg-yellow-50"
    >
      <Icon
        src={ExclamationTriangle}
        width={24}
        solid
        class="text-yellow-500"
      />
      <p class="text-sm text-yellow-700 dark:text-yellow-300">
        This URL is for a different instance than you're logged into. You
        probably won't be able to vote or comment.
      </p>
    </Material>
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
      />
    </div>
    <Button on:click={() => history.back()} size="square-md">
      <Icon src={ArrowLeft} mini size="16" slot="prefix" />
    </Button>
  </div>
  <h1 class="font-bold text-lg">
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
        crossposts
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
{#if data.singleThread}
  <Material
    elevation="max"
    padding="none"
    color="distinct"
    class="py-2 px-4 text-sm flex flex-row justify-between items-center
    flex-wrap gap-4 sticky top-20 w-full box-border z-20 mt-4"
  >
    <p class="font-medium text-sm flex items-center gap-2">
      <Icon src={InformationCircle} mini size="20" />
      You're viewing a single thread.
    </p>
    <Button {loading} disabled={loading} on:click={reloadComments}>
      View all comments
    </Button>
  </Material>
{/if}
<div class="mt-4 flex flex-col gap-2 w-full">
  <div class="flex flex-row justify-between flex-wrap gap-2">
    <div class="text-base">
      <span class="font-bold">
        <FormattedNumber number={post.post_view.counts.comments} />
      </span>
      comments
    </div>
    <div class="gap-2 flex items-center h-8">
      <Select
        size="sm"
        class="!h-full"
        bind:value={commentSort}
        on:change={reloadComments}
      >
        <option value="Hot">Hot</option>
        <option value="Top">Top</option>
        <option value="New">New</option>
        <option value="Old">Old</option>
        {#if feature('controversialSort', $page.params.instance == $instance ? $site?.version : '0.0.0')}
          <option value="Controversial">Controversial</option>
        {/if}
      </Select>
      <Button size="square-md" on:click={reloadComments}>
        <Icon src={ArrowPath} size="16" mini slot="prefix" />
      </Button>
    </div>
  </div>
  {#if $profile?.user}
    {#if showCreateComment}
      <CommentForm
        postId={post.post_view.post.id}
        on:comment={(comment) =>
          (data.comments.comments = [
            comment.detail.comment_view,
            ...data.comments.comments,
          ])}
        locked={post.post_view.post.locked ||
          $page.params.instance.toLowerCase() != $instance.toLowerCase()}
      />
    {:else}
      <Button
        on:click={() => (showCreateComment = !showCreateComment)}
        size="lg"
        rounding="lg"
        class="mx-auto max-w-sm w-full"
      >
        <Icon src={Plus} size="16" mini slot="prefix" />
        Add a comment
      </Button>
    {/if}
  {/if}
  <Comments
    post={post.post_view.post}
    nodes={buildCommentsTree(
      data.comments.comments,
      undefined,
      (c) =>
        !(
          ($userSettings.hidePosts.deleted && c.comment.deleted) ||
          ($userSettings.hidePosts.removed && c.comment.removed)
        )
    )}
    isParent={true}
  />
  {#if post.post_view.counts.comments > 5}
    <EndPlaceholder>
      You've viewed {post.post_view.counts.comments} comments.

      <Button
        color="tertiary"
        on:click={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        slot="action"
      >
        <Icon src={ChevronDoubleUp} mini size="16" slot="prefix" />
        Scroll to top
      </Button>
    </EndPlaceholder>
  {/if}
</div>
