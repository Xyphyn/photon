<script lang="ts">
  import { profile } from '$lib/auth.svelte.js'
  import { t } from '$lib/i18n/translations'
  import { getClient } from '$lib/lemmy.svelte'
  import { errorMessage } from '$lib/lemmy/error'
  import { isCommentView, isPostView } from '$lib/lemmy/item.js'
  import type { CommentView, PostView } from 'lemmy-js-client'
  import { Menu, MenuButton, MenuDivider, toast } from 'mono-svelte'
  import type { Snippet } from 'svelte'
  import {
    ArrowsUpDown,
    Fire,
    Icon,
    LockClosed,
    LockOpen,
    Megaphone,
    Newspaper,
    ShieldExclamation,
    Trash,
  } from 'svelte-hero-icons'
  import { amMod, ban, isAdmin, remove, viewVotes } from './moderation'

  interface Props {
    item: PostView | CommentView
    target: Snippet<[boolean]>
  }

  let { item = $bindable(), target: passedTarget }: Props = $props()

  let acting = $state(false)

  async function lock(lock: boolean) {
    if (!profile.current?.jwt || !isPostView(item)) return
    acting = true

    try {
      await getClient().lockPost({
        locked: lock,
        post_id: item.post.id,
      })

      item.post.locked = lock
    } catch (err) {
      toast({
        content: errorMessage(err),
        type: 'error',
      })
    }

    acting = false
  }

  async function pin(pinned: boolean, toInstance: boolean = false) {
    if (!profile.current?.jwt || !isPostView(item)) return

    acting = true

    try {
      await getClient().featurePost({
        feature_type: toInstance ? 'Local' : 'Community',
        featured: pinned,
        post_id: item.post.id,
      })

      item.post.featured_community = pinned
    } catch (err) {
      toast({
        content: errorMessage(err),
        type: 'error',
      })
    }

    acting = false
  }
</script>

<Menu placement="bottom-end">
  {#snippet target()}
    {@render passedTarget(acting)}
  {/snippet}
  {#if (profile.current?.user && amMod(profile.current.user, item.community)) || (profile.current?.user && isAdmin(profile.current.user))}
    <MenuDivider>
      {#if !item.community.local && !amMod(profile.current.user, item.community)}
        {$t('moderation.labelInstanceOnly')}
      {:else}
        {$t('moderation.label')}
      {/if}
    </MenuDivider>
    <MenuButton
      color="warning-subtle"
      onclick={() => lock(!item.post.locked)}
      loading={acting}
    >
      {#snippet prefix()}
        <Icon src={item.post.locked ? LockOpen : LockClosed} size="16" mini />
      {/snippet}
      {item.post.locked ? $t('moderation.unlock') : $t('moderation.lock')}
    </MenuButton>

    <MenuButton
      color="success-subtle"
      onclick={() =>
        pin(isPostView(item) ? !item.post.featured_community : false)}
      loading={acting}
    >
      <Icon src={Megaphone} size="16" mini />
      <div
        class="flex flex-row gap-2 text-left items-center justify-between w-full"
      >
        <span>
          {item.post.featured_community
            ? $t('moderation.unfeature')
            : $t('moderation.feature')}
        </span>
        {#if isAdmin(profile.current.user)}
          <span class="text-xs opacity-80">{$t('form.post.community')}</span>
        {/if}
      </div>
    </MenuButton>
    <MenuButton color="danger-subtle" onclick={() => remove(item)}>
      <Icon src={Trash} size="16" mini />
      {#if isCommentView(item)}
        {item.comment.removed
          ? $t('moderation.restore')
          : $t('moderation.remove')}
      {:else}
        {item.post.removed ? $t('moderation.restore') : $t('moderation.remove')}
      {/if}
    </MenuButton>
    {#if profile.current?.user && profile.current.user.local_user_view.person.id != item.creator.id}
      <MenuButton
        color="danger-subtle"
        onclick={() =>
          ban(item.creator_banned_from_community, item.creator, item.community)}
      >
        <Icon src={ShieldExclamation} size="16" mini />
        {item.creator_banned_from_community
          ? $t('moderation.ban.unbanFromCommunity')
          : $t('moderation.ban.banFromCommunity')}
      </MenuButton>
    {/if}
    <MenuButton color="success-subtle" href="/modlog?user={item.creator.id}">
      <Icon src={Newspaper} size="16" micro />
      {$t('moderation.modlog.user')}
    </MenuButton>
    <MenuButton color="success-subtle" href="/modlog?post={item.post.id}">
      <Icon src={Newspaper} size="16" micro />
      {$t('moderation.modlog.post')}
    </MenuButton>
    <MenuButton color="blue-subtle" onclick={() => viewVotes(item)}>
      <Icon src={ArrowsUpDown} size="16" micro />
      {$t('moderation.votes')}
    </MenuButton>
  {/if}
  {#if profile.current?.user && isAdmin(profile.current.user)}
    <MenuDivider>{$t('admin.label')}</MenuDivider>
    <MenuButton
      color="success-subtle"
      onclick={() =>
        pin(isPostView(item) ? !item.post.featured_local : false, true)}
    >
      <Icon src={Megaphone} size="16" mini />
      <div
        class="flex flex-row gap-2 text-left items-center justify-between w-full"
      >
        <span>
          {item.post.featured_local
            ? $t('moderation.unfeature')
            : $t('moderation.feature')}
        </span>
        <span class="text-xs opacity-80">{$t('admin.instance')}</span>
      </div>
    </MenuButton>
    <MenuButton color="danger-subtle" onclick={() => remove(item, true)}>
      <Icon src={Fire} size="16" mini />
      {$t('admin.purge')}
    </MenuButton>
  {/if}
</Menu>
