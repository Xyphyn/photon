<script lang="ts">
  import MultiSelect from '$lib/components/MultiSelect.svelte'
  import type {
    GetCommentsResponse,
    GetPostResponse,
    Comment,
    CommentView,
  } from 'lemmy-js-client'
  import type { CommentNodeI } from './comments.js'
  import Comments from './Comments.svelte'
  import SvelteMarkdown from 'svelte-markdown'
  import CommunityLink from '$lib/components/CommunityLink.svelte'

  export let data: { post: GetPostResponse; comments: GetCommentsResponse }

  const postData = data.post.post_view
  const post = postData.post

  const comments = data.comments.comments

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

<title>{data.post.post_view.post.name}</title>
<div class="flex flex-col gap-2">
  <span class="flex flex-row gap-2 text-sm opacity-70">
    <CommunityLink community={postData.community} />
    <span class="opacity-50">{postData.creator.name}</span>
  </span>
  <h1 class="font-bold text-lg">{post.name}</h1>
  {#if post.thumbnail_url}
    <img
      src={post.thumbnail_url}
      alt={post.name}
      class="rounded-md max-w-screen max-h-[80vh] mx-auto"
    />
  {/if}
  {#if post.body}
    <p
      class="bg-slate-100 border border-slate-200 dark:border-zinc-800
    dark:bg-zinc-900 p-2 text-sm rounded-md"
    >
      <SvelteMarkdown source={post.body} />
    </p>
  {/if}
</div>
<div class="mt-4 flex flex-col gap-2">
  <div class="font-bold text-lg">
    Comments <span class="text-sm font-normal ml-2 opacity-80">
      {postData.counts.comments}
    </span>
  </div>
  <MultiSelect
    options={['hot', 'new', 'top']}
    optionNames={['Hot', 'New', 'Top']}
    selected="hot"
  />
</div>
<Comments nodes={buildCommentsTree(comments, false)} isParent={true} />
