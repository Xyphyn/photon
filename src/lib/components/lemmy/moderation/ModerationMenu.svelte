<script lang="ts">
  import { authData, getClient, user } from '$lib/lemmy'
  import type {
    CommentView,
    Community,
    CommunityView,
    PostView,
  } from 'lemmy-js-client'
  import { isMod, remove } from './moderation'
  import Menu from '$lib/components/ui/menu/Menu.svelte'
  import Button from '$lib/components/input/Button.svelte'
  import MenuButton from '$lib/components/ui/menu/MenuButton.svelte'
  import { Icon, LockClosed, LockOpen, Trash } from 'svelte-hero-icons'
  import { Color } from '$lib/ui/colors.js'
  import { isComment, isPost } from '$lib/lemmy/item.js'
  import { ToastType, toast } from '$lib/components/ui/toasts/toasts.js'

  export let item: PostView | CommentView

  let locking = false
  $: acting = locking
  async function lock(lock: boolean) {
    if (!$authData || !isPost(item)) return
    locking = true

    try {
      await getClient().lockPost({
        auth: $authData.token,
        locked: lock,
        post_id: item.post.id,
      })

      item.post.locked = lock

      toast({
        content: `Successfully ${
          lock ? 'locked' : 'unlocked'
        } that post. You must refresh to see changes.`,
        type: ToastType.success,
      })
    } catch (err) {
      toast({
        content: err as any,
        type: ToastType.error,
      })
    }

    locking = false
  }
</script>

<Menu let:toggleOpen alignment="bottom-right">
  <Button
    class="!p-1.5 hover:text-green-500 text-zinc-400"
    on:click={toggleOpen}
    slot="button"
    size="sm"
    loading={acting}
    {...$$restProps}
  >
    <svg
      width="16"
      height="16"
      viewBox="0 0 20 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      slot="icon"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M10.516 1.17C10.3767 1.03791 10.192 0.964283 10 0.964283C9.80801 0.964283 9.62333 1.03791 9.484 1.17C7.36127 3.18588 4.53412 4.29133 1.607 4.25C1.44753 4.24793 1.29156 4.29674 1.16172 4.38935C1.03189 4.48196 0.934957 4.61355 0.885 4.765C0.462973 6.05116 0.248618 7.39637 0.25 8.75C0.25 14.692 4.314 19.683 9.813 21.098C9.93566 21.1296 10.0643 21.1296 10.187 21.098C15.686 19.683 19.75 14.692 19.75 8.75C19.75 7.36 19.527 6.02 19.115 4.765C19.0652 4.61336 18.9684 4.48156 18.8385 4.38875C18.7087 4.29595 18.5526 4.247 18.393 4.249L18.25 4.25C15.254 4.25 12.533 3.08 10.516 1.17Z"
        fill="currentColor"
      />
    </svg>
  </Button>
  <span class="px-4 py-1 my-1 text-xs text-slate-600 dark:text-zinc-400">
    Moderation
  </span>
  <MenuButton color="success" on:click={() => remove(item)}>
    <Icon src={Trash} size="16" mini />
    {#if isComment(item)}
      {item.comment.removed ? 'Restore' : 'Remove'}
    {:else}
      {item.post.removed ? 'Restore' : 'Remove'}
    {/if}
  </MenuButton>
  <MenuButton
    color="warning"
    on:click={() => lock(!item.post.locked)}
    loading={locking}
    disabled={locking}
  >
    <Icon
      src={item.post.locked ? LockOpen : LockClosed}
      size="16"
      mini
      slot="icon"
    />
    {item.post.locked ? 'Unlock' : 'Lock'}
  </MenuButton>
</Menu>
