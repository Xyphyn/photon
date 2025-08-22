<script lang="ts">
  import { notifications, profile } from '$lib/auth.svelte.js'
  import Expandable from '$lib/components/ui/Expandable.svelte'
  import CommunityList from '$lib/components/ui/sidebar/CommunityList.svelte'
  import ProfileButton from '$lib/components/ui/sidebar/ProfileButton.svelte'
  import SidebarButton from '$lib/components/ui/sidebar/SidebarButton.svelte'
  import { t } from '$lib/i18n/translations'
  import { settings } from '$lib/settings.svelte.js'
  import { Badge } from 'mono-svelte'
  import {
    ArrowLeftOnRectangle,
    Bookmark,
    Cog6Tooth,
    Identification,
    Inbox,
    UserCircle,
    UserGroup,
  } from 'svelte-hero-icons'
  import EndPlaceholder from '../EndPlaceholder.svelte'
  import type { ClassValue } from 'svelte/elements'
  import CommonList from '../layout/CommonList.svelte'
  import { communityLink } from '$lib/lemmy/generic'
  import Avatar from '../Avatar.svelte'

  interface Props {
    style?: string
    class?: ClassValue
  }

  let { style = '', class: clazz = '' }: Props = $props()
</script>

<nav class={['flex flex-col overflow-auto gap-1', clazz]} {style}>
  {#if profile.current?.jwt}
    <SidebarButton icon={UserCircle} href="/profile">
      {#snippet label()}
        <span>
          {$t('profile.profile')}
        </span>
      {/snippet}
    </SidebarButton>
    <SidebarButton icon={Inbox} href="/inbox">
      {#snippet label()}
        <span class="flex items-center gap-2">
          {$t('profile.inbox')}
          {#if $notifications.inbox}
            <Badge
              class="min-w-5 h-5 p-0! px-0.5 grid place-items-center ml-auto"
              color="red-subtle"
            >
              {$notifications.inbox > 99 ? '∞' : $notifications.inbox}
            </Badge>
          {/if}
        </span>
      {/snippet}
    </SidebarButton>
    <SidebarButton icon={Bookmark} href="/saved">
      {#snippet label()}
        <span>{$t('profile.saved')}</span>
      {/snippet}
    </SidebarButton>
  {:else}
    <SidebarButton
      href="/login"
      title={$t('account.login')}
      icon={ArrowLeftOnRectangle}
    >
      {#snippet label()}
        <span>{$t('account.login')}</span>
      {/snippet}
    </SidebarButton>
    <SidebarButton
      href="/signup"
      title={$t('account.signup')}
      icon={Identification}
    >
      {#snippet label()}
        <span>{$t('account.signup')}</span>
      {/snippet}
    </SidebarButton>
    <SidebarButton
      href="/settings"
      title={$t('nav.menu.settings')}
      icon={Cog6Tooth}
    >
      {#snippet label()}
        <span>{$t('nav.menu.settings')}</span>
      {/snippet}
    </SidebarButton>
  {/if}
  {#if profile.meta.profiles.length >= 1}
    <hr class="border-slate-200 dark:border-zinc-900 my-1" />

    <Expandable
      class="max-w-full min-w-0 w-full"
      bind:open={settings.expand.accounts}
    >
      {#snippet title()}
        <span class="px-2 py-1 w-full">
          <EndPlaceholder border={false}>
            {$t('account.accounts')}
            {#snippet action()}
              <span class="dark:text-white text-black">
                {profile.meta.profiles.length}
              </span>
            {/snippet}
          </EndPlaceholder>
        </span>
      {/snippet}
      <CommonList
        size="xs"
        animate={false}
        items={profile.meta.profiles}
        class="px-1 py-0.5"
        selected={prof => prof.id == profile.meta.profile}
      >
        {#snippet item(prof, index)}
          <ProfileButton {index} {prof} />
        {/snippet}
        <li class="xs px-1 py-0.5">
          <SidebarButton href="/accounts" icon={UserGroup}>
            {$t('account.accounts')}
          </SidebarButton>
        </li>
      </CommonList>
    </Expandable>
  {/if}
  <hr class="border-slate-200 dark:border-zinc-900 my-1" />
  {#if profile.current?.user}
    {#if profile.current?.user.moderates.length > 0}
      <Expandable
        class="max-w-full min-w-0 w-full"
        bind:open={settings.expand.moderates}
      >
        {#snippet title()}
          <span class="px-2 py-1 w-full">
            <EndPlaceholder border={false}>
              {$t('routes.profile.moderates')}
              {#snippet action()}
                <span class="dark:text-white text-black">
                  {profile.current.user?.moderates.length}
                </span>
              {/snippet}
            </EndPlaceholder>
          </span>
        {/snippet}
        <CommonList
          animate={false}
          size="xs"
          items={profile.current.user.moderates}
          class="px-1 py-0.5"
        >
          {#snippet item(moderate)}
            <SidebarButton
              class="font-normal w-full h-max"
              color="none"
              alignment="left"
              href={communityLink(moderate.community)}
            >
              {#snippet customIcon()}
                <Avatar
                  url={moderate.community.icon}
                  alt={moderate.community.name}
                  title={moderate.community.title}
                  width={28}
                />{/snippet}
              {#snippet label()}
                <div class="flex flex-col max-w-full break-words">
                  <span>{moderate.community.title}</span>
                  <span class="text-xs text-slate-600 dark:text-zinc-400">
                    {new URL(moderate.community.actor_id).hostname}
                  </span>
                </div>
              {/snippet}
            </SidebarButton>
          {/snippet}
        </CommonList>
      </Expandable>
      <hr class="border-slate-200 dark:border-zinc-900 my-1" />
    {/if}

    <Expandable
      class="max-w-full min-w-0 w-full"
      bind:open={settings.expand.communities}
    >
      {#snippet title()}
        <span class="px-2 py-1 w-full">
          <EndPlaceholder border={false}>
            {$t('profile.subscribed')}
            {#snippet action()}
              <span class="dark:text-white text-black">
                {profile.current.user?.follows.length}
              </span>
            {/snippet}
          </EndPlaceholder>
        </span>
      {/snippet}
      <CommonList
        animate={false}
        size="xs"
        items={profile.current.user.follows}
        class="px-1 py-0.5"
      >
        {#snippet item(follow)}
          <SidebarButton
            class="font-normal w-full h-max"
            color="none"
            alignment="left"
            href={communityLink(follow.community)}
          >
            {#snippet customIcon()}
              <Avatar
                url={follow.community.icon}
                alt={follow.community.name}
                title={follow.community.title}
                width={28}
              />{/snippet}
            {#snippet label()}
              <div class="flex flex-col max-w-full break-words">
                <span>{follow.community.title}</span>
                <span class="text-xs text-slate-600 dark:text-zinc-400">
                  {new URL(follow.community.actor_id).hostname}
                </span>
              </div>
            {/snippet}
          </SidebarButton>
        {/snippet}
      </CommonList>
    </Expandable>
  {/if}
</nav>
