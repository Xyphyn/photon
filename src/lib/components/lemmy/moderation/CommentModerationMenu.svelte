<script lang="ts">
  import type { CommentView, PostView } from 'lemmy-js-client'
  import { amMod, ban, isAdmin, remove } from './moderation'
  import { Fire, Icon, ShieldExclamation, Trash } from 'svelte-hero-icons'
  import { isCommentView } from '$lib/lemmy/item.js'
  import { profile } from '$lib/auth.js'
  import ShieldIcon from '$lib/components/lemmy/moderation/ShieldIcon.svelte'
  import { Button, Menu, MenuButton, MenuDivider } from 'mono-svelte'

  export let item: PostView | CommentView
</script>

<Menu placement="bottom" class="top-0 h-[26px] w-[26px] ">
  <Button
    class="w-[26px] h-[26px] hover:!text-green-500 dark:text-zinc-400 text-slate-600"
    size="square-md"
    slot="target"
    color="ghost"
    {...$$restProps}
  >
    <ShieldIcon filled width={14} />
  </Button>
  {#if ($profile?.user && amMod($profile.user, item.community)) || ($profile?.user && isAdmin($profile.user))}
    <MenuDivider>
      Moderation {#if !item.community.local && !amMod($profile.user, item.community)}
        (Instance Only)
      {/if}
    </MenuDivider>
    <MenuButton color="success-subtle" on:click={() => remove(item)}>
      <Icon src={Trash} size="16" mini />
      {#if isCommentView(item)}
        {item.comment.removed ? 'Restore' : 'Remove'}
      {:else}
        {item.post.removed ? 'Restore' : 'Remove'}
      {/if}
    </MenuButton>
    {#if $profile?.user && $profile.user?.local_user_view.person.id != item.creator.id}
      <MenuButton
        color="danger-subtle"
        on:click={() =>
          ban(item.creator_banned_from_community, item.creator, item.community)}
      >
        <Icon src={ShieldExclamation} size="16" mini />
        {item.creator_banned_from_community
          ? 'Unban from community'
          : 'Ban from community'}
      </MenuButton>
    {/if}
  {/if}

  {#if $profile?.user && isAdmin($profile.user)}
    <MenuDivider>Admin</MenuDivider>
    <MenuButton color="danger-subtle" on:click={() => remove(item, true)}>
      <Icon src={Fire} size="16" mini slot="prefix" />
      Purge
    </MenuButton>
  {/if}
</Menu>
