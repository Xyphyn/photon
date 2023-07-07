<script lang="ts">
  import MultiSelect from '$lib/components/input/MultiSelect.svelte'
  import type { Comment, CommentView } from 'lemmy-js-client'
  import type { CommentNodeI } from '$lib/components/lemmy/comment/comments.js'
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

  function getCommentParentId(comment?: Comment): number | undefined {
    const split = comment?.path.split('.')
    // remove the 0
    split?.shift()

    return split && split.length > 1
      ? Number(split.at(split.length - 2))
      : undefined
  }

  function getDepthFromComment(comment?: Comment): number | undefined {
    const len = comment?.path.split('.').length
    return len ? len - 2 : undefined
  }

  export function buildCommentsTree(
    comments: CommentView[],
    parentComment: boolean
  ): CommentNodeI[] {
    const map = new Map<number, CommentNodeI>()
    const depthOffset = !parentComment
      ? 0
      : getDepthFromComment(comments[0].comment) ?? 0

    for (const comment_view of comments) {
      const depthI = getDepthFromComment(comment_view.comment) ?? 0
      const depth = depthI ? depthI - depthOffset : 0
      const node: CommentNodeI = {
        comment_view,
        children: [],
        depth,
      }
      map.set(comment_view.comment.id, { ...node })
    }

    const tree: CommentNodeI[] = []

    // if its a parent comment fetch, then push the first comment to the top node.
    if (parentComment) {
      const cNode = map.get(comments[0].comment.id)
      if (cNode) {
        tree.push(cNode)
      }
    }

    for (const comment_view of comments) {
      const child = map.get(comment_view.comment.id)
      if (child) {
        const parent_id = getCommentParentId(comment_view.comment)
        if (parent_id) {
          const parent = map.get(parent_id)
          // Necessary because blocked comment might not exist
          if (parent) {
            parent.children.push(child)
          }
        } else {
          if (!parentComment) {
            tree.push(child)
          }
        }
      }
    }

    return tree
  }
</script>

<svelte:head>
  <title>{data.post.post_view.post.name}</title>
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
  </span>
  <h1 class="font-bold text-lg">{post.name}</h1>
  {#if post.url}
    <a
      href={post.url}
      class="text-sky-400 max-w-[48ch] overflow-hidden
                whitespace-nowrap text-ellipsis text-xs hover:underline"
    >
      {post.url}
    </a>
  {/if}
  {#if isImage(post.url)}
    <img
      src={post.url}
      alt={post.name}
      class="rounded-md max-w-screen max-h-[80vh] mx-auto"
    />
  {:else if isVideo(post.url)}
    <!-- svelte-ignore a11y-media-has-caption -->
    <video class="rounded-md max-w-screen max-h-[80vh] mx-auto">
      <source src={post.url} />
    </video>
  {/if}
  {#if post.body}
    <p
      class="bg-slate-100 border border-slate-200 dark:border-zinc-800
    dark:bg-zinc-900 p-2 text-sm rounded-md leading-5"
    >
      <Markdown source={post.body} />
    </p>
  {/if}
  <div class="w-max">
    <PostVote
      post={data.post.post_view.post}
      score={data.post.post_view.counts.score}
      vote={data.post.post_view.my_vote}
    />
  </div>
</div>
<div class="mt-4 flex flex-col gap-2">
  <div class="font-bold text-lg">
    Comments <span class="text-sm font-normal ml-2 opacity-80">
      {postData.counts.comments}
    </span>
  </div>
  {#await data.streamed.comments}
    <div class="flex flex-col gap-8">
      {#each new Array(10) as comment}
        <div class="flex flex-col gap-2">
          <div
            class="dark:bg-zinc-700 bg-slate-200 animate-pulse w-64 h-3 rounded-md"
          />
          <div
            class="dark:bg-zinc-700 bg-slate-200 animate-pulse w-128 h-4 rounded-md"
          />
        </div>
      {/each}
    </div>
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
    <MultiSelect
      options={['hot', 'new', 'top']}
      optionNames={['Hot', 'New', 'Top']}
      selected="hot"
    />
    <Comments
      {post}
      nodes={buildCommentsTree(comments.comments, false)}
      isParent={true}
    />
  {:catch}
    <div class="bg-red-500/10 border border-red-500 rounded-md p-4">
      Failed to load comments.
    </div>
  {/await}
</div>
