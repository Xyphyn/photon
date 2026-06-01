<script lang="ts">
  import { profile } from '$lib/app/auth'
  import { errorMessage } from '$lib/app/error'
  import { t } from '$lib/app/i18n'
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
  } from 'svelte-hero-icons/dist'
  import type { Attachment } from 'svelte/attachments'
  import { PostModel } from '../post/post.svelte'
  import { ban, remove, viewVotes } from './moderation'

  interface Props {
    post: PostModel
    target: Snippet<[Attachment, boolean]>
  }

  let { post: item, target: passedTarget }: Props = $props()

  let acting = $state(false)

  async function lock(lock: boolean) {
    acting = true

    // TODO add reason prompt
    await item
      .lock(lock, 'Reason not given')
      .catch((e) => toast({ content: errorMessage(e), type: 'error' }))

    acting = false
  }

  async function pin(pinned: boolean, toInstance: boolean = false) {
    acting = true

    await item
      .feature(pinned, toInstance ? 'local' : 'community')
      .catch((e) => toast({ content: errorMessage(e), type: 'error' }))

    acting = false
  }
</script>

<Menu placement="bottom-end">
  {#snippet target(attachment)}
    {@render passedTarget(attachment, acting)}
  {/snippet}
  {#if profile.isMod(item.community) || profile.isAdmin}
    <MenuDivider showLabel>
      {#if !item.community.local && !profile.isMod(item.community)}
        {$t('moderation.labelInstanceOnly')}
      {:else}
        {$t('moderation.label')}
      {/if}
    </MenuDivider>
    <MenuButton
      color="warning-subtle"
      onclick={() => lock(!item.post.locked)}
      loading={acting}
      icon={item.post.locked ? LockOpen : LockClosed}
    >
      {item.post.locked ? $t('moderation.unlock') : $t('moderation.lock')}
    </MenuButton>

    <MenuButton
      color="success-subtle"
      onclick={() => pin(!item.post.featured_community)}
      loading={acting}
    >
      <Icon src={Megaphone} size="16" mini />
      <div class="flex flex-row gap-2 text-left items-center justify-between w-full">
        <span>
          {item.post.featured_community ? $t('moderation.unfeature') : $t('moderation.feature')}
        </span>
        {#if profile.isAdmin}
          <span class="text-xs opacity-80">{$t('form.post.community')}</span>
        {/if}
      </div>
    </MenuButton>
    <MenuButton color="danger-subtle" onclick={() => remove(item)}>
      <Icon src={Trash} size="16" mini />
      {item.post.removed ? $t('moderation.restore') : $t('moderation.remove')}
    </MenuButton>
    {#if profile.current?.user && profile.current.user.local_user_view.person.id != item.creator.id}
      <MenuButton
        color="danger-subtle"
        onclick={() => ban(item.data.creator_banned_from_community, item.creator, item.community)}
      >
        <Icon src={ShieldExclamation} size="16" mini />
        {item.data.creator_banned_from_community
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
  {#if profile.isAdmin}
    <MenuDivider showLabel>{$t('admin.label')}</MenuDivider>
    <MenuButton color="success-subtle" onclick={() => pin(!item.post.featured_local)}>
      <Icon src={Megaphone} size="16" mini />
      <div class="flex flex-row gap-2 text-left items-center justify-between w-full">
        <span>
          {item.post.featured_local ? $t('moderation.unfeature') : $t('moderation.feature')}
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
