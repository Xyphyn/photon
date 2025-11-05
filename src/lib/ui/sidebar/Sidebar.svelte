<script lang="ts">
  import { env } from '$env/dynamic/public'
  import { profile } from '$lib/app/auth.svelte'
  import { t } from '$lib/app/i18n'
  import { LINKED_INSTANCE_URL } from '$lib/app/instance.svelte'
  import { settings } from '$lib/app/settings.svelte'
  import { theme } from '$lib/app/theme/theme.svelte'
  import { communityLink } from '$lib/app/util.svelte'
  import ProfileSelection from '$lib/feature/user/ProfileSelection.svelte'
  import { Badge, Expandable, Option, Select } from 'mono-svelte'
  import {
    ArrowLeftOnRectangle,
    Bookmark,
    ChevronUpDown,
    Cog6Tooth,
    ComputerDesktop,
    Icon,
    Identification,
    Inbox,
    Moon,
    Sun,
    Swatch,
    UserCircle,
    UserGroup,
  } from 'svelte-hero-icons/dist'
  import type { ClassValue } from 'svelte/elements'
  import ItemList from '../generic/ItemList.svelte'
  import Logo from '../generic/Logo.svelte'
  import EndPlaceholder from '../layout/EndPlaceholder.svelte'
  import SidebarButton from './SidebarButton.svelte'

  interface Props {
    style?: string
    class?: ClassValue
  }

  let { style = '', class: clazz = '' }: Props = $props()
</script>

<nav
  aria-label={$t('aria.sidebar.title')}
  class={['flex flex-col overflow-auto gap-1', clazz]}
  {style}
>
  <ProfileSelection
    selectable={!(
      LINKED_INSTANCE_URL &&
      !profile.current.jwt &&
      profile.meta.profiles.length == 1
    )}
    profiles={profile.meta.profiles}
  />
  <EndPlaceholder margin="sm" size="xs">{$t('profile.profile')}</EndPlaceholder>
  {#if profile.current?.jwt}
    {@const notifications = profile.inbox.notifications}
    <SidebarButton
      icon={UserCircle}
      href="/profile"
      label={$t('profile.profile')}
    />
    <SidebarButton icon={Inbox} href="/inbox" label={$t('profile.inbox')}>
      {#if notifications.inbox}
        <Badge
          class="min-w-5 h-5 p-0! px-0.5 grid place-items-center ml-auto"
          color="red-subtle"
        >
          {notifications.inbox > 99 ? '∞' : notifications.inbox}
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
      label={$t('account.accounts')}
      icon={UserGroup}
    />
  {/if}
  <EndPlaceholder margin="sm" size="xs">{$t('nav.menu.app')}</EndPlaceholder>
  <SidebarButton
    href="/settings"
    label={$t('nav.menu.settings')}
    icon={Cog6Tooth}
  />
  <Select bind:value={theme.colorScheme} size="sm">
    {#snippet target(attachment)}
      <SidebarButton
        {@attach attachment}
        label={$t('nav.menu.colorscheme.label')}
        icon={theme.colorScheme == 'system'
          ? ComputerDesktop
          : theme.colorScheme == 'light'
            ? Sun
            : Moon}
        class="w-full relative"
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
        <Icon micro size="16" src={ChevronUpDown} class="ml-auto" />
      </SidebarButton>
    {/snippet}
  </Select>
  <SidebarButton href="/theme" label={$t('nav.menu.theme')} icon={Swatch} />
  {#if profile.current?.user}
    <EndPlaceholder margin="sm" size="xs">
      {$t('content.communities')}
    </EndPlaceholder>

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
            items={profile.current.user.moderates.map((i) => ({
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
          items={profile.current.user.follows.map((i) => ({
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

  <footer
    class="flex gap-6 flex-col xl:flex-row text-sm text-slate-600 dark:text-zinc-300 flex-wrap"
  >
    <div class="flex items-center gap-2">
      <Logo width={16} />
      <span class="font-medium">
        {__VERSION__}
      </span>
    </div>
    {#if env.PUBLIC_XYLIGHT_MODE?.toLowerCase() == 'true'}
      <a
        class="text-blue-600 dark:text-blue-400"
        href="https://github.com/xyphyn/photon"
      >
        {$t('nav.menu.source')}
      </a>
      <a
        class="text-blue-600 dark:text-blue-400"
        href="https://buymeacoffee.com/xylight"
      >
        {$t('nav.menu.donate')}
      </a>
    {/if}
  </footer>
</nav>
