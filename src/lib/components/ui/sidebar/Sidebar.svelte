<script lang="ts">
  import { goto } from '$app/navigation'
  import { page } from '$app/state'
  import { notifications, profile } from '$lib/auth.svelte.js'
  import ItemList from '$lib/components/lemmy/generic/ItemList.svelte'
  import Expandable from '$lib/components/ui/Expandable.svelte'
  import SidebarButton from '$lib/components/ui/sidebar/SidebarButton.svelte'
  import { t } from '$lib/i18n/translations'
  import { communityLink } from '$lib/lemmy/generic'
  import { settings } from '$lib/settings.svelte.js'
  import { Badge, Button, Menu, MenuButton, Option, Select } from 'mono-svelte'
  import {
    ArrowLeftOnRectangle,
    Bookmark,
    CheckCircle,
    ChevronUpDown,
    Cog6Tooth,
    ComputerDesktop,
    Icon,
    Identification,
    Inbox,
    Moon,
    QuestionMarkCircle,
    Sun,
    Swatch,
    UserCircle,
    UserGroup,
  } from 'svelte-hero-icons'
  import type { ClassValue } from 'svelte/elements'
  import Avatar from '../Avatar.svelte'
  import EndPlaceholder from '../EndPlaceholder.svelte'
  import { theme } from '$lib/ui/colors.svelte'

  interface Props {
    style?: string
    class?: ClassValue
  }

  let { style = '', class: clazz = '' }: Props = $props()
</script>

<nav class={['flex flex-col overflow-auto gap-1', clazz]} {style}>
  <Menu placement="bottom">
    {#snippet target()}
      <Button
        color="tertiary"
        alignment="left"
        size="md"
        class="flex flex-row gap-2 items-center"
      >
        {#snippet prefix()}
          <Avatar
            url={profile.current.avatar}
            alt={profile.current.username}
            width={24}
          />
        {/snippet}
        <div class="flex-1">
          <div class="font-medium">{profile.current.username}</div>
          <div class="text-xs text-slate-500 dark:text-zinc-500">
            {profile.current.instance}
          </div>
        </div>
        {#snippet suffix()}
          <Icon
            src={ChevronUpDown}
            size="16"
            micro
            class="block justify-self-end"
          />
        {/snippet}
      </Button>
    {/snippet}
    {#each profile.meta.profiles as p}
      <MenuButton
        onclick={() => {
          profile.meta.profile = p.id

          goto(page.url, {
            invalidateAll: true,
          })
        }}
      >
        {#snippet prefix()}
          <Avatar url={p.avatar} alt={p.username} width={24} />
        {/snippet}
        <div>
          <div class="font-medium text-sm">{p.username}</div>
          <div class="text-xs text-slate-500 dark:text-zinc-500">
            {p.instance}
          </div>
        </div>
        {#if profile.meta.profile == p.id}
          <Icon
            src={CheckCircle}
            class="text-primary-900 dark:text-primary-100 ml-auto"
            size="16"
            micro
          />
        {/if}
        {#if !p.jwt}
          <Badge color="gray-subtle" class="ml-auto p-1!">
            <Icon src={QuestionMarkCircle} size="16" micro />
          </Badge>
        {/if}
      </MenuButton>
    {/each}
    <MenuButton href="/accounts">
      {#snippet prefix()}
        <Icon src={UserGroup} size="16" micro />
      {/snippet}
      {$t('account.accounts')}
    </MenuButton>
  </Menu>
  <EndPlaceholder size="xs">{$t('profile.profile')}</EndPlaceholder>
  {#if profile.current?.jwt}
    <SidebarButton
      icon={UserCircle}
      href="/profile"
      label={$t('profile.profile')}
    />
    <SidebarButton icon={Inbox} href="/inbox" label={$t('profile.inbox')}>
      {#if $notifications.inbox}
        <Badge
          class="min-w-5 h-5 p-0! px-0.5 grid place-items-center ml-auto"
          color="red-subtle"
        >
          {$notifications.inbox > 99 ? '∞' : $notifications.inbox}
        </Badge>
      {/if}
    </SidebarButton>
    <SidebarButton icon={Bookmark} href="/saved" label={$t('profile.saved')} />
  {:else}
    <SidebarButton
      href="/login"
      label={$t('account.login')}
      icon={ArrowLeftOnRectangle}
    />
    <SidebarButton
      href="/signup"
      label={$t('account.signup')}
      icon={Identification}
    />
    <SidebarButton
      href="/accounts"
      title={$t('accounts.accounts')}
      icon={UserGroup}
    />
  {/if}
  <EndPlaceholder size="xs">{$t('nav.menu.app')}</EndPlaceholder>
  <SidebarButton
    href="/settings"
    label={$t('nav.menu.settings')}
    icon={Cog6Tooth}
  />
  <Select bind:value={theme.colorScheme} size="sm">
    {#snippet target()}
      <SidebarButton
        label={$t('nav.menu.colorscheme.label')}
        icon={theme.colorScheme == 'system'
          ? ComputerDesktop
          : theme.colorScheme == 'light'
            ? Sun
            : Moon}
        class=" w-full"
      >
        <Option value="system" class="hidden" icon={ComputerDesktop}>
          {$t('nav.menu.colorscheme.system')}
        </Option>
        <Option value="light" class="hidden" icon={Sun}>
          {$t('nav.menu.colorscheme.light')}
        </Option>
        <Option value="dark" class="hidden" icon={Moon}>
          {$t('nav.menu.colorscheme.dark')}
        </Option>
      </SidebarButton>
    {/snippet}
  </Select>
  <SidebarButton href="/theme" label={$t('nav.menu.theme')} icon={Swatch} />
  {#if profile.current?.user}
    <EndPlaceholder size="xs">{$t('content.communities')}</EndPlaceholder>

    <div class="space-y-3">
      {#if profile.current?.user.moderates.length > 0}
        <Expandable class="px-1.5" bind:open={settings.expand.moderates}>
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
          <ItemList
            items={profile.current.user.moderates.map(i => ({
              id: i.community.id,
              name: i.community.title,
              url: communityLink(i.community),
              avatar: i.community.icon,
              instance: new URL(i.community.actor_id).hostname,
            }))}
          />
        </Expandable>
      {/if}

      <Expandable class="px-1.5" bind:open={settings.expand.communities}>
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

        <ItemList
          items={profile.current.user.follows.map(i => ({
            id: i.community.id,
            name: i.community.title,
            url: communityLink(i.community),
            avatar: i.community.icon,
            instance: new URL(i.community.actor_id).hostname,
          }))}
        />
      </Expandable>
    </div>
  {/if}

  <div class="flex-1 h-full mt-auto"></div>
</nav>
