<script lang="ts">
  import CommunityLink from '$lib/components/community/CommunityLink.svelte'
  import Link from '$lib/components/input/Link.svelte'
  import Comment from '$lib/components/lemmy/comment/Comment.svelte'
  import Markdown from '$lib/components/markdown/Markdown.svelte'
  import Avatar from '$lib/components/ui/Avatar.svelte'
  import Card from '$lib/components/ui/Card.svelte'
  import StickyCard from '$lib/components/ui/StickyCard.svelte'
  import FormattedNumber from '$lib/components/util/FormattedNumber.svelte'
  import RelativeDate from '$lib/components/util/RelativeDate.svelte'
  import type { GetPersonDetailsResponse } from 'lemmy-js-client'
  import {
    Calendar,
    ChatBubbleOvalLeftEllipsis,
    Icon,
    PencilSquare,
  } from 'svelte-hero-icons'
  import SvelteMarkdown from 'svelte-markdown'

  export let data: {
    user: GetPersonDetailsResponse
  }
</script>

<svelte:head>
  {data.user.person_view.person.name}
</svelte:head>

<div class="flex flex-row gap-4 max-w-full">
  <div class="flex flex-col gap-4 max-w-full">
    {#each data.user.comments as item}
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
    {/each}
  </div>

  <div class="max-w-sm w-full hidden xl:block">
    <StickyCard>
      <Avatar
        width={64}
        url={data.user.person_view.person.name ??
          `https://api.dicebear.com/6.x/initials/svg?seed=${data.user.person_view.person.name}`}
        alt=""
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
      <h1 class="font-bold text-lg">
        {data.user.person_view.person.name}
      </h1>
      {#if data.user.person_view.person.bio}
        <Markdown source={data.user.person_view.person.bio} />
      {/if}
    </StickyCard>
  </div>
</div>
