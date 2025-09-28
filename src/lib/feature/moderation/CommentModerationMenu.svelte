<script lang="ts">
  import type { CommentView } from '$lib/api/types'
  import { profile } from '$lib/app/auth.svelte'
  import { t } from '$lib/app/i18n'
  import { Menu, MenuButton, MenuDivider } from 'mono-svelte'
  import type { Snippet } from 'svelte'
  import {
    ArrowsUpDown,
    Fire,
    Icon,
    Megaphone,
    Newspaper,
    ShieldExclamation,
    Trash,
  } from 'svelte-hero-icons/dist'
  import type { Attachment } from 'svelte/attachments'
  import { isCommentView } from '../legacy/item'
  import { ban, feature, remove, viewVotes } from './moderation'

  interface Props {
    item: CommentView
    target: Snippet<[Attachment]>
  }

  let { item = $bindable(), target, ...rest }: Props = $props()
</script>

<Menu {...rest} placement="bottom" {target}>
  {#if profile.isMod(item.community) || profile.isAdmin}
    <MenuDivider hidden>
      {#if !item.community.local && !profile.isMod(item.community)}
        {$t('moderation.labelInstanceOnly')}
      {:else}
        {$t('moderation.label')}
      {/if}
    </MenuDivider>
    <MenuButton color="danger-subtle" onclick={() => remove(item)} icon={Trash}>
      {#if isCommentView(item)}
        {item.comment.removed
          ? $t('moderation.restore')
          : $t('moderation.remove')}
      {/if}
    </MenuButton>
    {#if profile.current?.user && profile.current.user?.local_user_view.person.id != item.creator.id}
      <!--Comment made by someone else-->
      <MenuButton
        color="danger-subtle"
        onclick={() =>
          ban(item.creator_banned_from_community, item.creator, item.community)}
        icon={ShieldExclamation}
      >
        {item.creator_banned_from_community
          ? $t('moderation.ban.unbanFromCommunity')
          : $t('moderation.ban.banFromCommunity')}
      </MenuButton>
    {:else}
      <!--Comment made by self-->
      <MenuButton
        color="success-subtle"
        onclick={async () => {
          if (!profile.current.jwt) return
          item.comment = (
            await feature(
              !item.comment.distinguished,
              item.comment,
              profile.current.jwt,
            )
          ).comment_view.comment
        }}
        icon={Megaphone}
      >
        {item.comment.distinguished
          ? $t('moderation.unfeature')
          : $t('moderation.feature')}
      </MenuButton>
    {/if}

    <MenuButton color="success-subtle" href="/modlog?comment={item.comment.id}">
      <Icon src={Newspaper} size="16" micro />
      {$t('moderation.modlog.comment')}
    </MenuButton>
    <MenuButton color="success-subtle" href="/modlog?user={item.creator.id}">
      <Icon src={Newspaper} size="16" micro />
      {$t('moderation.modlog.user')}
    </MenuButton>
    <MenuButton color="blue-subtle" onclick={() => viewVotes(item)}>
      <Icon src={ArrowsUpDown} size="16" micro />
      {$t('moderation.votes')}
    </MenuButton>
  {/if}

  {#if profile.isAdmin}
    <MenuDivider showLabel>{$t('admin.label')}</MenuDivider>
    <MenuButton
      color="danger-subtle"
      onclick={() => remove(item, true)}
      icon={Fire}
    >
      {$t('admin.purge')}
    </MenuButton>
  {/if}
</Menu>
