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
  import { isImage } from '$lib/ui/image.js'
  import PostVote from '$lib/components/lemmy/PostVote.svelte'
  import FormattedNumber from '$lib/components/util/FormattedNumber.svelte'
  import UserLink from '$lib/components/user/UserLink.svelte'
  import Card from '$lib/components/ui/Card.svelte'
  import { authData, getClient, getInstance, user } from '$lib/lemmy.js'
  import Menu from '$lib/components/ui/menu/Menu.svelte'
  import Button from '$lib/components/input/Button.svelte'
  import MenuButton from '$lib/components/ui/menu/MenuButton.svelte'
  import { Color } from '$lib/ui/colors.js'
  import { page } from '$app/stores'
  import Avatar from '$lib/components/ui/Avatar.svelte'
  import Link from '$lib/components/input/Link.svelte'

  let postRes: PostView
  export { postRes as post }

  async function deletePost() {
    if (!$authData) return

    await getClient().deletePost({
      auth: $authData.token,
      deleted: true,
      post_id: postRes.post.id,
    })
  }
</script>

<Card class="bg-white flex flex-col overflow-hidden w-full relative p-5 gap-2">
  <span class="flex flex-row gap-2 text-xs items-center">
    <Avatar
      url={postRes.community.icon}
      alt={postRes.community.title}
      width={24}
    />
    <div class="flex flex-col">
      <CommunityLink community={postRes.community} />
      <span class="text-slate-500 dark:text-zinc-400 flex flex-row gap-1">
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
    {#if postRes.post.nsfw}
      <span class="bg-red-600 px-1 py-0.5 rounded-md text-xs ml-auto font-bold">
        NSFW
      </span>
    {/if}
  </span>
  <a
    href="/post/{getInstance()}/{postRes.post.id}"
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
    <div class="self-start" class:blur-3xl={postRes.post.nsfw}>
      <img
        src="{postRes.post.url}?thumbnail=1024&format=webp"
        alt={postRes.post.name}
        class="rounded-md max-h-[32rem] w-full max-w-full"
      />
    </div>
  {:else if postRes.post.embed_video_url}
    <div class="self-start" class:blur-3xl={postRes.post.nsfw}>
      <!-- svelte-ignore a11y-media-has-caption -->
      <video class="rounded-md max-h-[32rem] w-full max-w-full" controls>
        <source src={postRes.post.embed_video_url} />
      </video>
    </div>
  {:else if postRes.post.thumbnail_url}
    <div class="self-start" class:blur-3xl={postRes.post.nsfw}>
      <img
        src={postRes.post.thumbnail_url}
        alt={postRes.post.name}
        class="rounded-md max-h-[32rem] w-full max-w-full"
      />
    </div>
  {/if}
  {#if postRes.post.body && !postRes.post.nsfw}
    <p
      class="text-sm max-h-[74px] line-clamp-3 bg-slate-100 dark:bg-zinc-800
        border border-slate-200 dark:border-zinc-700 rounded-md p-2 mt-2"
    >
      {postRes.post.body}
    </p>
  {/if}
  <div class="flex flex-row gap-2 items-center pt-2">
    <PostVote
      post={postRes.post}
      vote={postRes.my_vote}
      score={postRes.counts.score}
    />

    <Link color={Color.border} href="/post/{getInstance()}/{postRes.post.id}">
      <Icon slot="icon" src={ChatBubbleOvalLeft} mini width={16} height={16} />
      <FormattedNumber number={postRes.counts.comments} />
    </Link>
    <Menu top absolute class="bottom-0 right-0 m-5 z-10">
      <Button slot="button" label="Post actions">
        <Icon src={EllipsisHorizontal} width={16} mini />
      </Button>
      <span class="mx-4 text-xs opacity-80 text-left my-2">Post Actions</span>
      <MenuButton
        on:click={() => {
          navigator.clipboard.writeText(
            `${$page.url.origin}/post/${getInstance()}/${postRes.post.id}`
          )
        }}
      >
        <Icon src={Square2Stack} width={16} mini />
        Copy Link
      </MenuButton>
      {#if $user?.person.id == postRes.post.creator_id}
        <MenuButton on:click={deletePost} color={Color.dangerSecondary}>
          <Icon src={Trash} width={16} mini />
          Delete
        </MenuButton>
      {/if}
    </Menu>
  </div>
</Card>
