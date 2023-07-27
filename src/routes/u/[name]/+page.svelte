<script lang="ts">
  import CommunityLink from '$lib/components/lemmy/community/CommunityLink.svelte'
  import Post from '$lib/components/lemmy/post/Post.svelte'
  import Comment from '$lib/components/lemmy/comment/Comment.svelte'
  import Markdown from '$lib/components/markdown/Markdown.svelte'
  import Avatar from '$lib/components/ui/Avatar.svelte'
  import Card from '$lib/components/ui/Card.svelte'
  import StickyCard from '$lib/components/ui/StickyCard.svelte'
  import FormattedNumber from '$lib/components/util/FormattedNumber.svelte'
  import RelativeDate from '$lib/components/util/RelativeDate.svelte'
  import type {
    CommentView,
    GetPersonDetailsResponse,
    PostView,
  } from 'lemmy-js-client'
  import {
    Calendar,
    ChatBubbleOvalLeftEllipsis,
    Icon,
    PencilSquare,
  } from 'svelte-hero-icons'
  import Button from '$lib/components/input/Button.svelte'

  export let data: {
    user: GetPersonDetailsResponse
  }

  const isComment = (item: CommentView | PostView): item is CommentView =>
    'comment' in item

  function getDateOfItem(item: CommentView | PostView): number {
    if (isComment(item)) {
      return Date.parse(item.comment.published)
    } else {
      return Date.parse(item.post.published)
    }
  }

  const items = [...data.user.comments, ...data.user.posts].sort(
    (a, b) => getDateOfItem(b) - getDateOfItem(a)
  )
</script>

<svelte:head>
  <title>{data.user.person_view.person.name}</title>
</svelte:head>

<div class="flex flex-col-reverse lg:flex-row gap-4 max-w-full w-full">
  <div class="flex flex-col gap-4 max-w-full w-full">
    {#each items as item}
      {#if isComment(item)}<Card
          class="flex flex-col bg-white rounded-md p-5 flex-1"
        >
          <div class="flex flex-row justify-between items-center">
            <div class="flex flex-col gap-1">
              <span class="text-xs dark:text-slate-400 text-zinc-600">
                <CommunityLink avatar community={item.community} />
              </span>
              <span class="flex flex-row items-center text-sm font-bold">
                {item.post.name}
              </span>
            </div>
            <Button
              color="secondary"
              href="/post/{item.post.id}#{item.comment.id}"
              size="sm"
              class="self-start"
            >
              Jump
            </Button>
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
    {/each}
  </div>

  <div class="max-w-sm w-full mx-auto">
    <StickyCard class="w-full">
      <Avatar
        width={64}
        url={data.user.person_view.person.avatar}
        alt={data.user.person_view.person.name}
      />
      <span class="flex flex-row items-center gap-1 text-sm">
        <Icon src={Calendar} width={16} height={16} mini />
        <span class="capitalize">
          <RelativeDate
            date={new Date(data.user.person_view.person.published)}
          />
        </span>
      </span>
      <div class="text-sm flex flex-row flex-wrap gap-3">
        <span class="flex flex-row items-center gap-1">
          <Icon src={PencilSquare} width={16} height={16} mini />
          <FormattedNumber number={data.user.person_view.counts.post_count} />
        </span>
        <span class="flex flex-row items-center gap-1">
          <Icon src={ChatBubbleOvalLeftEllipsis} width={16} height={16} mini />
          <FormattedNumber
            number={data.user.person_view.counts.comment_count}
          />
        </span>
      </div>
      <div>
        <h1 class="font-bold text-lg">
          {data.user.person_view.person.display_name ??
            data.user.person_view.person.name}
        </h1>
        <span class="text-sm opacity-80 flex flex-row gap-0">
          {#if data.user.person_view.person.display_name}
            {data.user.person_view.person.name}@
          {/if}
          {new URL(data.user.person_view.person.actor_id).hostname}
        </span>
      </div>
      {#if data.user.person_view.person.bio}
        <Markdown source={data.user.person_view.person.bio} />
      {/if}
    </StickyCard>
  </div>
</div>
