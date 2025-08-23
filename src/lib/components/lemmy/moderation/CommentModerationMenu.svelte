<script lang="ts">
  import { profile } from '$lib/auth.svelte.js'
  import ShieldIcon from '$lib/components/lemmy/moderation/ShieldIcon.svelte'
  import { t } from '$lib/i18n/translations'
  import { isCommentView } from '$lib/lemmy/item.js'
  import type { CommentView } from 'lemmy-js-client'
  import { Button, Menu, MenuButton, MenuDivider } from 'mono-svelte'
  import {
    ArrowsUpDown,
    Fire,
    Icon,
    Megaphone,
    Newspaper,
    ShieldExclamation,
    Trash,
  } from 'svelte-hero-icons'
  import { amMod, ban, feature, isAdmin, remove, viewVotes } from './moderation'

  interface Props {
    item: CommentView
  }

  let { item = $bindable(), ...rest }: Props = $props()
</script>

<Menu placement="bottom" class="top-0 h-[26px] w-[26px] ">
  {#snippet target()}
    <Button
      class="w-[26px] h-[26px] hover:text-green-500! dark:text-zinc-400 text-slate-600"
      size="square-md"
      color="tertiary"
      {...rest}
    >
      <ShieldIcon filled width={14} />
    </Button>
  {/snippet}
  {#if (profile.current?.user && amMod(profile.current.user, item.community)) || (profile.current?.user && isAdmin(profile.current.user))}
    <MenuDivider showLabel>
      {#if !item.community.local && !amMod(profile.current.user, item.community)}
        {$t('moderation.labelInstanceOnly')}
      {:else}
        {$t('moderation.label')}
      {/if}
    </MenuDivider>
    <MenuButton color="danger-subtle" onclick={() => remove(item)}>
      {#snippet prefix()}
        <Icon src={Trash} size="16" mini />
      {/snippet}
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
      >
        {#snippet prefix()}
          <Icon src={ShieldExclamation} size="16" mini />
        {/snippet}
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
      >
        {#snippet prefix()}
          <Icon src={Megaphone} size="16" micro />
        {/snippet}
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

  {#if profile.current?.user && isAdmin(profile.current.user)}
    <MenuDivider showLabel>{$t('admin.label')}</MenuDivider>
    <MenuButton color="danger-subtle" onclick={() => remove(item, true)}>
      {#snippet prefix()}
        <Icon src={Fire} size="16" mini />
      {/snippet}
      {$t('admin.purge')}
    </MenuButton>
  {/if}
</Menu>
