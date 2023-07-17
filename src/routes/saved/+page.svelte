<script lang="ts">
  import type { CommentView, PostView } from 'lemmy-js-client'
  import InboxItem from '../inbox/InboxItem.svelte'
  import Card from '$lib/components/ui/Card.svelte'
  import Post from '$lib/components/lemmy/Post.svelte'
  import CommunityLink from '$lib/components/community/CommunityLink.svelte'
  import Link from '$lib/components/input/Link.svelte'
  import Comment from '$lib/components/lemmy/comment/Comment.svelte'
  import { fly } from 'svelte/transition'

  export let data

  const isComment = (item: CommentView | PostView): item is CommentView =>
    'comment' in item
</script>

<svelte:head>
  <title>Saved posts</title>
</svelte:head>

<h1 class="text-xl font-bold">Saved Posts</h1>
<div class="flex flex-col gap-4 list-none my-4">
  {#if !data.data || (data.data?.length ?? 0) == 0}
    <p class="text-center opacity-60 text-lg mx-4">
      Wow, it's quite empty in here.
    </p>
  {:else}
    {#each data.data as item, index}
      <div in:fly={{ opacity: 0, y: -4, delay: index * 50 }}>
        {#if isComment(item)}
          <Card class="flex flex-col bg-white rounded-md p-4 flex-1">
            <div class="flex flex-row justify-between items-center">
              <div class="flex flex-col gap-1">
                <span class="text-xs dark:text-slate-400 text-zinc-600">
                  <CommunityLink avatar community={item.community} />
                </span>
                <span class="flex flex-row items-center text-sm font-bold">
                  {item.post.name}
                </span>
              </div>
              <Link href="/post/{item.post.id}#{item.comment.id}">Jump</Link>
            </div>
            <div class="list-none">
              <Comment
                postId={item.post.id}
                node={{ children: [], comment_view: item, depth: 1 }}
                replying={false}
              />
            </div>
          </Card>
        {:else}
          <Post post={item} />
        {/if}
      </div>
    {/each}
  {/if}
</div>
