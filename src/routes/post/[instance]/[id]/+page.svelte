<script lang="ts">
  import MultiSelect from '$lib/components/input/MultiSelect.svelte'
  import type { Comment, CommentView } from 'lemmy-js-client'
  import {
    buildCommentsTree,
    type CommentNodeI,
  } from '$lib/components/lemmy/comment/comments.js'
  import Comments from '$lib/components/lemmy/comment/Comments.svelte'
  import CommunityLink from '$lib/components/community/CommunityLink.svelte'
  import { isImage, isVideo } from '$lib/ui/image.js'
  import { authData, getClient, user } from '$lib/lemmy.js'
  import CommentForm from '$lib/components/lemmy/comment/CommentForm.svelte'
  import PostVote from '$lib/components/lemmy/PostVote.svelte'
  import { onMount } from 'svelte'
  import UserLink from '$lib/components/user/UserLink.svelte'
  import Markdown from '$lib/components/markdown/Markdown.svelte'
  import Avatar from '$lib/components/ui/Avatar.svelte'
  import RelativeDate from '$lib/components/util/RelativeDate.svelte'
  import CommunityCard from '$lib/components/community/CommunityCard.svelte'
  import Button from '$lib/components/input/Button.svelte'
  import { page } from '$app/stores'
  import PostActions from '$lib/components/lemmy/PostActions.svelte'
  import Loading from '$lib/components/ui/loader/Loading.svelte'
  import Badge from '$lib/components/ui/Badge.svelte'
  import { Bookmark, Icon, InformationCircle, Trash } from 'svelte-hero-icons'
  import Link from '$lib/components/input/Link.svelte'

  export let data

  const postData = data.post.post_view
  const post = postData.post

  onMount(async () => {
    if (!postData.read && $authData) {
      getClient().markPostAsRead({
        auth: $authData.token,
        read: true,
        post_id: post.id,
      })
    }
  })

  let commentsPage = 1
  let loading = false
  let moreComments = true
</script>

<svelte:head>
  <title>{data.post.post_view.post.name}</title>
  <meta property="og:title" content={data.post.post_view.post.name} />
  <meta property="og:url" content={$page.url.toString()} />
  {#if isImage(post.url)}
    <meta property="og:image" content={post.url} />
  {/if}
  {#if post.body}
    <meta property="og:description" content={post.body} />
  {/if}
</svelte:head>

<div class="flex flex-col gap-2">
  <span class="flex flex-row gap-2 text-sm items-center">
    <Avatar
      url={postData.community.icon}
      width={24}
      alt={postData.community.name}
    />
    <div class="flex flex-col text-xs">
      <CommunityLink community={postData.community} />
      <span class="opacity-50 flex flex-row gap-1">
        <UserLink user={postData.creator} />
        <span>•</span>
        <RelativeDate date={new Date(postData.post.published)} />
        <span>•</span>
        <span>
          {Math.floor(
            (data.post.post_view.counts.upvotes /
              (data.post.post_view.counts.upvotes +
                data.post.post_view.counts.downvotes || 1)) *
              100
          )}%
        </span>
      </span>
    </div>

    {#if data.post.post_view.post.nsfw}
      <Badge class="bg-red-600 text-white">NSFW</Badge>
    {/if}
    {#if data.post.post_view.saved}
      <Badge class="bg-yellow-500 text-white py-1" label="Saved">
        <Icon src={Bookmark} mini width={16} />
      </Badge>
    {/if}
    {#if data.post.post_view.post.deleted || data.post.post_view.post.removed}
      <Badge class="bg-red-600 text-white py-1" label="Deleted">
        <Icon src={Trash} mini width={16} />
      </Badge>
    {/if}
    {#if data.post.post_view.post.featured_community || data.post.post_view.post.featured_local}
      <Badge class="bg-green-500 text-white py-1" label="Pinned">
        <Icon src={InformationCircle} mini width={16} />
      </Badge>
    {/if}
  </span>
  <h1 class="font-bold text-lg">{post.name}</h1>
  {#if isImage(post.url)}
    <img
      src={post.url}
      alt={post.name}
      class="rounded-md max-w-screen max-h-[80vh] mx-auto"
    />
  {:else if post.thumbnail_url && post.url}
    <a
      href={post.url}
      class="self-start relative group"
      class:blur-3xl={post.nsfw}
    >
      <img
        src={post.thumbnail_url}
        alt={post.name}
        class="rounded-md max-h-[16rem] w-full max-w-full"
      />
      <span
        class="w-full px-4 py-2 overflow-hidden
        whitespace-nowrap text-ellipsis text-sm group-hover:underline bg-slate-100 border
        absolute bottom-0 rounded-b-md flex flex-row gap-1 items-center h-10"
      >
        <Icon src={Link} width={16} mini />
        {new URL(post.url).hostname}
      </span>
    </a>
  {:else if post.embed_video_url}
    <!-- svelte-ignore a11y-media-has-caption -->
    <video class="rounded-md max-w-screen max-h-[80vh] mx-auto">
      <source src={post.embed_video_url} />
    </video>
  {/if}
  {#if post.body}
    <p
      class="bg-slate-100 border border-slate-200 dark:border-zinc-800
    dark:bg-zinc-900 p-2 text-sm rounded-md leading-[22px]"
    >
      <Markdown source={post.body} />
    </p>
  {/if}
  <div class="w-full relative">
    <PostActions post={data.post.post_view} />
  </div>
</div>
<div class="mt-4 flex flex-col gap-2">
  <div class="font-bold text-lg">
    Comments <span class="text-sm font-normal ml-2 opacity-80">
      {postData.counts.comments}
    </span>
  </div>
  {#await data.streamed.comments}
    <Loading />
  {:then comments}
    {#if $user}
      <CommentForm
        postId={post.id}
        on:comment={(comment) =>
          (comments.comments = [
            comment.detail.comment_view,
            ...comments.comments,
          ])}
      />
    {/if}
    <Comments
      {post}
      nodes={buildCommentsTree(comments.comments, false)}
      isParent={true}
    />
    {#if moreComments}
      <Button
        {loading}
        disabled={loading}
        on:click={async () => {
          if (!moreComments) return
          loading = true

          const loadedComments = await getClient().getComments({
            auth: $authData?.token,
            max_depth: 3,
            page: ++commentsPage,
            limit: 25,
            post_id: data.post.post_view.post.id,
          })

          if (comments.comments == loadedComments.comments) {
            comments.comments = [
              ...comments.comments,
              ...loadedComments.comments.filter(
                (comment) => !comments.comments.includes(comment)
              ),
            ]
          } else {
            moreComments = false
          }

          loading = false
        }}
      >
        Load more
      </Button>
    {/if}
  {:catch}
    <div class="bg-red-500/10 border border-red-500 rounded-md p-4">
      Failed to load comments.
    </div>
  {/await}
</div>
