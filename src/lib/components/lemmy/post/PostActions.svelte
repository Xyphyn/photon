<script lang="ts">
  import type { PostView } from 'lemmy-js-client'
  import PostVote from './PostVote.svelte'
  import { getClient, getInstance } from '$lib/lemmy.js'
  import {
    Bookmark,
    BookmarkSlash,
    ChatBubbleOvalLeftEllipsis,
    EllipsisHorizontal,
    Flag,
    Icon,
    Newspaper,
    PencilSquare,
    Share,
    Trash,
    UserCircle,
  } from 'svelte-hero-icons'
  import FormattedNumber from '$lib/components/util/FormattedNumber.svelte'
  import Menu from '$lib/components/ui/menu/Menu.svelte'
  import Button from '$lib/components/input/Button.svelte'
  import MenuButton from '$lib/components/ui/menu/MenuButton.svelte'
  import { page } from '$app/stores'
  import { toast } from '$lib/components/ui/toasts/toasts.js'
  import { createEventDispatcher } from 'svelte'
  import Modal from '$lib/components/ui/modal/Modal.svelte'
  import PostForm from '$lib/components/lemmy/post/PostForm.svelte'
  import {
    amMod,
    isAdmin,
    report,
  } from '$lib/components/lemmy/moderation/moderation.js'
  import ModerationMenu from '$lib/components/lemmy/moderation/ModerationMenu.svelte'
  import { profile } from '$lib/auth.js'

  export let post: PostView

  async function deletePost() {
    if (!$profile?.jwt) return

    const deleted = post.post.deleted

    try {
      await getClient().deletePost({
        auth: $profile.jwt,
        deleted: !deleted,
        post_id: post.post.id,
      })
      post.post.deleted = !deleted
      toast({
        content: `That post was ${deleted ? 'restored' : 'deleted'}.`,
        type: 'success',
      })
    } catch (err) {
      toast({
        content: err as any,
        type: 'error',
      })
    }
  }

  async function save(post: PostView) {
    if (!$profile?.jwt) return false

    const saved = post.saved

    post.saved = !saved

    try {
      await getClient().savePost({
        auth: $profile.jwt,
        post_id: post.post.id,
        save: !saved,
      })
    } catch (error) {
      post.saved = saved

      toast({
        content: error as any,
        type: 'error',
      })
    }

    return post.saved
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
        post = e.detail
        dispatcher('edit', e.detail)
      }}
    >
      <svelte:fragment slot="formtitle">
        <!-- Have the title not exist at all -->
        {''}
      </svelte:fragment>
    </PostForm>
  </Modal>
{/if}

<div class="flex flex-row gap-2 items-center h-[30px]">
  <PostVote post={post.post} vote={post.my_vote} score={post.counts.score} />

  <Button
    color="secondary"
    size="sm"
    href="/post/{getInstance()}/{post.post.id}"
    class="px-3 h-full !text-inherit"
  >
    <Icon
      slot="icon"
      src={ChatBubbleOvalLeftEllipsis}
      mini
      width={16}
      height={16}
    />
    <FormattedNumber number={post.counts.comments} />
  </Button>
  <div class="ml-auto" />
  {#if $profile?.user && (amMod($profile.user, post.community) || isAdmin($profile.user))}
    <ModerationMenu bind:item={post} community={post.community} />
  {/if}
  <Menu alignment="bottom-right" class="overflow-auto" let:toggleOpen>
    <Button
      slot="button"
      aria-label="Post actions"
      on:click={toggleOpen}
      class="!p-1.5 dark:text-zinc-400 text-slate-500 hover:text-inherit h-full"
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
    {#if $profile?.user && $profile.user.local_user_view.person.id == post.creator.id}
      <MenuButton on:click={() => (editing = true)}>
        <Icon src={PencilSquare} width={16} mini />
        Edit
      </MenuButton>
    {/if}
    <MenuButton
      on:click={() =>
        navigator.clipboard.writeText(
          `https://${getInstance()}/post/${post.post.id}`
        )}
    >
      <Icon src={Share} width={16} mini />
      Copy Link
    </MenuButton>
    {#if $profile?.jwt}
      <MenuButton on:click={async () => (post.saved = await save(post))}>
        <Icon src={post.saved ? BookmarkSlash : Bookmark} width={16} mini />
        {post.saved ? 'Unsave' : 'Save'}
      </MenuButton>
      {#if $profile.user && post.creator.id == $profile.user.local_user_view.person.id}
        <MenuButton on:click={deletePost} color="dangerSecondary">
          <Icon src={Trash} width={16} mini />
          {post.post.deleted ? 'Restore' : 'Delete'}
        </MenuButton>
      {/if}
      {#if $profile.user?.local_user_view.person.id != post.creator.id}
        <MenuButton on:click={() => report(post)} color="dangerSecondary">
          <Icon src={Flag} width={16} mini />
          Report
        </MenuButton>
      {/if}
    {/if}
  </Menu>
</div>
