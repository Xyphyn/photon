<script lang="ts">
  import type { PostView } from 'lemmy-js-client'
  import PostVote from './PostVote.svelte'
  import { getClient, getInstance } from '$lib/lemmy.js'
  import { Color } from '$lib/ui/colors.js'
  import Link from '$lib/components/input/Link.svelte'
  import {
    ChatBubbleOvalLeft,
    EllipsisHorizontal,
    Icon,
    Newspaper,
    Square2Stack,
    Trash,
    UserCircle,
  } from 'svelte-hero-icons'
  import FormattedNumber from '$lib/components/util/FormattedNumber.svelte'
  import Menu from '$lib/components/ui/menu/Menu.svelte'
  import Button from '$lib/components/input/Button.svelte'
  import MenuButton from '$lib/components/ui/menu/MenuButton.svelte'
  import { page } from '$app/stores'
  import { user, authData } from '$lib/lemmy.js'

  export let post: PostView

  async function deletePost() {
    if (!$authData) return

    await getClient().deletePost({
      auth: $authData.token,
      deleted: true,
      post_id: post.post.id,
    })
  }

  function youtubeToPiped(url: string): string {
    const youtubeDomainsRegex =
      /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i

    if (youtubeDomainsRegex.test(url)) {
      return url
        .replace(youtubeDomainsRegex, '$1$2invidious.io.lol/')
        .replace('www.', '')
    }

    return url
  }
</script>

<div class="flex flex-row gap-2 items-center pt-2">
  <PostVote post={post.post} vote={post.my_vote} score={post.counts.score} />

  <Link color={Color.border} href="/post/{getInstance()}/{post.post.id}">
    <Icon slot="icon" src={ChatBubbleOvalLeft} mini width={16} height={16} />
    <FormattedNumber number={post.counts.comments} />
  </Link>
  <Menu top class="ml-auto overflow-auto" let:toggleOpen>
    <Button slot="button" label="Post actions" on:click={toggleOpen}>
      <Icon src={EllipsisHorizontal} width={16} mini />
    </Button>
    <span class="mx-4 text-xs opacity-80 text-left my-2">Creator</span>
    <MenuButton
      link
      href="/u/{post.creator.name}@{new URL(post.creator.actor_id).hostname}"
    >
      <Icon src={UserCircle} width={16} mini />
      <span>{post.creator.name}</span>
    </MenuButton>
    <MenuButton
      link
      href="/c/{post.community.name}@{new URL(post.community.actor_id)
        .hostname}"
    >
      <Icon src={Newspaper} width={16} mini />
      <span>{post.community.title}</span>
    </MenuButton>
    <hr class="w-[90%] mx-auto opacity-100 dark:opacity-10 my-2" />
    <span class="mx-4 text-xs opacity-80 text-left my-2">Actions</span>
    <MenuButton
      on:click={() => {
        navigator.clipboard.writeText(
          `${$page.url.origin}/post/${getInstance()}/${post.post.id}`
        )
      }}
    >
      <Icon src={Square2Stack} width={16} mini />
      Copy Link
    </MenuButton>
    {#if $user?.person.id == post.post.creator_id}
      <MenuButton on:click={deletePost} color={Color.dangerSecondary}>
        <Icon src={Trash} width={16} mini />
        Delete
      </MenuButton>
    {/if}
  </Menu>
</div>
