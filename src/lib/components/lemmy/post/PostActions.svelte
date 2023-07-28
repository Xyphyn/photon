<script lang="ts">
  import type { PostView } from 'lemmy-js-client'
  import PostVote from './PostVote.svelte'
  import { getClient, getInstance } from '$lib/lemmy.js'
  import { Color } from '$lib/ui/colors.js'
  import Link from '$lib/components/input/Link.svelte'
  import {
    Bookmark,
    BookmarkSlash,
    ChatBubbleOvalLeft,
    EllipsisHorizontal,
    Flag,
    Icon,
    Newspaper,
    PencilSquare,
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
  import { ToastType, toast } from '$lib/components/ui/toasts/toasts.js'
  import { isMutable } from '$lib/components/lemmy/post/helpers.js'
  import { createEventDispatcher } from 'svelte'
  import Modal from '$lib/components/ui/modal/Modal.svelte'
  import PostForm from '$lib/components/lemmy/post/PostForm.svelte'
  import { isMod, report } from '$lib/components/lemmy/moderation/moderation.js'
  import ModerationMenu from '$lib/components/lemmy/moderation/ModerationMenu.svelte'

  export let post: PostView

  async function deletePost() {
    if (!$authData) return

    await getClient().deletePost({
      auth: $authData.token,
      deleted: true,
      post_id: post.post.id,
    })
  }

  async function save(post: PostView) {
    if (!$authData) return

    const saved = post.saved

    post.saved = !saved

    try {
      await getClient().savePost({
        auth: $authData.token,
        post_id: post.post.id,
        save: !saved,
      })
    } catch (error) {
      post.saved = saved

      toast({
        content: error as any,
        type: ToastType.error,
      })
    }
  }

  const dispatcher = createEventDispatcher<{ edit: PostView }>()

  let editing = false
</script>

{#if editing}
  <Modal bind:open={editing}>
    <h1 slot="title" class="text-2xl font-bold">Editing post</h1>
    <PostForm
      edit
      editingPost={post.post}
      on:submit={(e) => {
        editing = false
        dispatcher('edit', e.detail)
      }}
    >
      <span slot="formtitle" />
    </PostForm>
  </Modal>
{/if}

<div class="flex flex-row gap-2 items-center">
  <PostVote post={post.post} vote={post.my_vote} score={post.counts.score} />

  <Button
    color="elevated"
    size="sm"
    href="/post/{getInstance()}/{post.post.id}"
    class="px-3"
  >
    <Icon slot="icon" src={ChatBubbleOvalLeft} mini width={16} height={16} />
    <FormattedNumber number={post.counts.comments} />
  </Button>
  <div class="ml-auto" />
  {#if $user && isMod($user, post.community)}
    <ModerationMenu item={post} community={post.community} />
  {/if}
  <Menu alignment="bottom-right" class="overflow-auto" let:toggleOpen>
    <Button
      slot="button"
      label="Post actions"
      on:click={toggleOpen}
      class="!p-1.5 text-zinc-400 hover:text-inherit"
      color="secondary"
    >
      <Icon slot="icon" src={EllipsisHorizontal} width={16} mini />
    </Button>
    <li class="mx-4 text-xs opacity-80 text-left my-1 py-1">Creator</li>
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
    <li class="mx-4 text-xs opacity-80 text-left my-1 py-1">Actions</li>
    {#if $user && $user.local_user_view.person.id == post.creator.id}
      <MenuButton on:click={() => (editing = true)}>
        <Icon src={PencilSquare} width={16} mini />
        Edit
      </MenuButton>
    {/if}
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
    {#if $authData?.token}
      <MenuButton on:click={() => save(post)}>
        <Icon src={post.saved ? BookmarkSlash : Bookmark} width={16} mini />
        {post.saved ? 'Unsave' : 'Save'}
      </MenuButton>
      {#if $user && isMutable(post, $user.local_user_view)}
        <MenuButton on:click={deletePost} color="dangerSecondary">
          <Icon src={Trash} width={16} mini />
          Delete
        </MenuButton>
      {/if}
      {#if $user?.local_user_view.person.id != post.creator.id}
        <MenuButton on:click={() => report(post)} color="dangerSecondary">
          <Icon src={Flag} width={16} mini />
          Report
        </MenuButton>
      {/if}
    {/if}
  </Menu>
</div>
