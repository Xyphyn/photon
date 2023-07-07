<script lang="ts">
  import type { PostView } from 'lemmy-js-client'
  import {
    ChatBubbleOvalLeft,
    EllipsisHorizontal,
    Icon,
    Square2Stack,
    Trash,
  } from 'svelte-hero-icons'
  import RelativeDate from '$lib/components/util/RelativeDate.svelte'
  import CommunityLink from '$lib/components/community/CommunityLink.svelte'
  import { isImage, isVideo } from '$lib/ui/image.js'
  import PostVote from '$lib/components/lemmy/PostVote.svelte'
  import FormattedNumber from '$lib/components/util/FormattedNumber.svelte'
  import UserLink from '$lib/components/user/UserLink.svelte'
  import Card from '$lib/components/ui/Card.svelte'
  import {
    DEFAULT_INSTANCE_URL,
    authData,
    getClient,
    user,
  } from '$lib/lemmy.js'
  import Menu from '$lib/components/ui/menu/Menu.svelte'
  import Button from '$lib/components/input/Button.svelte'
  import MenuButton from '$lib/components/ui/menu/MenuButton.svelte'
  import { Color } from '$lib/ui/colors.js'
  import { page } from '$app/stores'
  import Avatar from '$lib/components/ui/Avatar.svelte'

  let postRes: PostView
  export { postRes as post }

  let deleting = false

  async function deletePost() {
    if (!$authData) return

    deleting = true

    await getClient().deletePost({
      auth: $authData.token,
      deleted: true,
      post_id: postRes.post.id,
    })

    deleting = false
  }
</script>

<Card class="bg-white flex flex-col overflow-hidden w-full relative">
  <div class="flex flex-col gap-2 bg-white dark:bg-zinc-900 p-4 rounded-md">
    <span class="flex flex-row gap-2 text-xs items-center">
      <Avatar
        url={postRes.community.icon}
        alt={postRes.community.title}
        width={24}
      />
      <div class="flex flex-col">
        <CommunityLink community={postRes.community} />
        <span class="opacity-60 flex flex-row gap-1">
          <UserLink user={postRes.creator} />
          <span>•</span>
          <RelativeDate date={new Date(postRes.post.published)} />
          <span>•</span>
          <span>
            {Math.floor(
              (postRes.counts.upvotes /
                (postRes.counts.upvotes + postRes.counts.downvotes || 1)) *
                100
            )}%
          </span>
        </span>
      </div>
      <div class="ml-auto" />
      <span class="opacity-50 capitalize" />
    </span>
    <a
      href="/post/{postRes.post.id}"
      class="font-bold {postRes.read ? 'opacity-50' : ''}"
    >
      {postRes.post.name}
    </a>
    {#if postRes.post.url}
      <a
        href={postRes.post.url}
        class="text-sky-400 max-w-[24ch] overflow-hidden
                whitespace-nowrap text-ellipsis text-xs hover:underline"
      >
        {postRes.post.url}
      </a>
    {/if}
    {#if isImage(postRes.post.url)}
      <a href="/post/{postRes.post.id}" class="inline self-start">
        <img
          src={postRes.post.url}
          alt={postRes.post.name}
          class="rounded-md max-h-[32rem] w-full max-w-full"
          loading="lazy"
        />
      </a>
    {:else if isVideo(postRes.post.url)}
      <!-- svelte-ignore a11y-media-has-caption -->
      <a href="/post/{postRes.post.id}" class="inline self-start">
        <video class="rounded-md max-h-64 max-w-full" preload="metadata">
          <source src={postRes.post.url} />
        </video>
      </a>
    {/if}
    {#if postRes.post.body}
      <p
        class="text-sm max-h-[74px] line-clamp-3 bg-slate-100 dark:bg-zinc-800 border
      border-slate200 dark:border-zinc-700 rounded-md p-2 mt-2"
      >
        {postRes.post.body}
      </p>
    {/if}
  </div>
  <div class="flex flex-row gap-2 pb-4 px-4">
    <PostVote
      post={postRes.post}
      vote={postRes.my_vote}
      score={postRes.counts.score}
    />

    <a
      class="flex flex-row items-center gap-1 p-1 px-3 rounded-md
            bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200
            dark:hover:bg-zinc-700 transition-colors border border-slate-200
            dark:border-zinc-700"
      href="/post/{postRes.post.id}"
    >
      <Icon src={ChatBubbleOvalLeft} mini width={16} height={16} />
      <span class="text-sm">
        <FormattedNumber number={postRes.counts.comments} />
      </span>
    </a>
    <Menu top absolute class="bottom-0 right-0 m-5 z-10">
      <Button slot="button">
        <Icon src={EllipsisHorizontal} width={16} mini />
      </Button>
      <span class="mx-4 text-xs opacity-80 text-left my-2">Post Actions</span>
      <MenuButton
        on:click={() => {
          if (typeof navigator != 'undefined') {
            navigator.clipboard.writeText(
              `${$page.url.origin}/post/${
                $authData?.instance ?? DEFAULT_INSTANCE_URL
              }/${postRes.post.id}`
            )
          }
        }}
      >
        <Icon src={Square2Stack} width={16} mini />
        Copy Link
      </MenuButton>
      {#if $user?.person_view.person.id == postRes.post.creator_id}
        <MenuButton on:click={deletePost} color={Color.dangerSecondary}>
          <Icon src={Trash} width={16} mini />
          Delete
        </MenuButton>
      {/if}
    </Menu>
  </div>
</Card>
