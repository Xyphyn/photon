<script lang="ts">
  import { notifications, profile } from '$lib/auth.svelte.js'
  import {
    amModOfAny,
    isAdmin,
  } from '$lib/components/lemmy/moderation/moderation.js'
  import Avatar from '$lib/components/ui/Avatar.svelte'
  import { t } from '$lib/i18n/translations'
  import { LINKED_INSTANCE_URL } from '$lib/instance.svelte'
  import { site } from '$lib/lemmy.svelte.js'
  import { Badge, Menu, MenuButton, MenuDivider, Spinner } from 'mono-svelte'
  import {
    Bars3,
    Bell,
    GlobeAlt,
    Icon,
    Inbox,
    MagnifyingGlass,
    Newspaper,
    PencilSquare,
    Plus,
    ServerStack,
    ShieldCheck,
  } from 'svelte-hero-icons'
  import type { ClassValue } from 'svelte/elements'
  import Logo from '../Logo.svelte'
  import CommandsWrapper from './commands/CommandsWrapper.svelte'
  import NavButton from './NavButton.svelte'

  let promptOpen: boolean = $state(false)
  interface Props {
    style?: string
    class?: ClassValue
  }

  let { style = '', class: clazz = '' }: Props = $props()
</script>

{#snippet notifBadge(number: number)}
  <Badge
    color={number > 0 ? 'red-subtle' : 'gray-subtle'}
    class="min-w-5 h-5 p-0! px-0.5 grid place-items-center ml-auto"
  >
    {number > 99 ? '∞' : number}
  </Badge>
{/snippet}

<CommandsWrapper bind:open={promptOpen} />
<nav
  class={[
    'flex flex-row gap-2 items-center w-full mx-auto z-50 box-border p-0.5 duration-150 @container',
    clazz,
  ]}
  {style}
>
  <NavButton
    oncontextmenu={(e: Event) => {
      e.preventDefault()
      promptOpen = true
      return true
    }}
    href="/"
    label={$t('nav.home')}
    class="ml-2 lg:ml-2 logo border-0 lg:rounded-full! lg:w-10! lg:h-10 lg:px-0!"
    adaptive={false}
  >
    {#snippet customIcon()}
      {#if LINKED_INSTANCE_URL}
        {#if site.data}
          <Avatar
            alt={site.data.site_view.site.name}
            url={site.data.site_view.site.icon}
            width={32}
            circle={false}
          />
        {:else}
          <Spinner width={32} />
        {/if}
      {:else}
        <Logo width={32} />
      {/if}
    {/snippet}
  </NavButton>
  <div
    class="flex flex-row gap-2 lg:gap-5 py-2 px-2 items-center w-full overflow-auto"
    style="border-radius: inherit;"
  >
    <div class="ml-auto"></div>
    {#if profile.current?.user && isAdmin(profile.current.user)}
      <NavButton
        href="/admin"
        label={$t('nav.admin')}
        icon={ServerStack}
        class="relative"
        isSelectedFilter={path => path.startsWith('/admin')}
      />
    {/if}
    {#if amModOfAny(profile.current?.user)}
      <NavButton
        href="/moderation"
        label={$t('nav.moderation')}
        class="relative"
        icon={ShieldCheck}
      />
    {/if}
    <NavButton
      href="/communities"
      label={$t('nav.communities')}
      icon={GlobeAlt}
    />
    <NavButton href="/search" label={$t('nav.search')} icon={MagnifyingGlass} />
    {#if profile.current.jwt}
      {@const linkOnly =
        !profile.current.user ||
        !(isAdmin(profile.current.user) || amModOfAny(profile.current.user))}
      <Menu manual={linkOnly} placement="top">
        {#snippet target()}
          <NavButton
            label={$t('nav.notifications')}
            icon={Bell}
            class="relative"
            adaptive={false}
            href={linkOnly ? '/inbox' : undefined}
          >
            {#if Math.max(...Object.values($notifications)) > 0}
              <div
                class="rounded-full w-2 h-2 bg-red-500 absolute top-1 left-3 z-10"
              ></div>
            {/if}
          </NavButton>
        {/snippet}
        <MenuDivider>{$t('nav.notifications')}</MenuDivider>
        <MenuButton href="/inbox" icon={Inbox}>
          {$t('profile.inbox')}
          {#snippet suffix()}
            {@render notifBadge($notifications.inbox)}
          {/snippet}
        </MenuButton>
        {#if amModOfAny(profile.current.user)}
          <MenuButton href="/moderation" icon={ShieldCheck}>
            {$t('routes.moderation.feed')}
            {#snippet suffix()}
              {@render notifBadge($notifications.reports)}
            {/snippet}
          </MenuButton>
        {/if}
        {#if profile.current.user && isAdmin(profile.current.user)}
          <MenuButton href="/admin/applications" icon={ServerStack}>
            {$t('routes.admin.applications.title')}
            {#snippet suffix()}
              {@render notifBadge($notifications.applications)}
            {/snippet}
          </MenuButton>
        {/if}
      </Menu>
    {/if}
    <Menu
      manual={site.data?.site_view.local_site.community_creation_admin_only &&
        !(profile.current.user && isAdmin(profile.current.user))}
      placement="top"
    >
      {#snippet target()}
        <NavButton
          class="relative"
          label={$t('nav.create.label')}
          icon={Plus}
          adaptive={false}
          href={site.data?.site_view.local_site.community_creation_admin_only &&
          !(profile.current.user && isAdmin(profile.current.user))
            ? '/create/post'
            : undefined}
        />
      {/snippet}
      <MenuDivider>{$t('nav.create.label')}</MenuDivider>
      <MenuButton link href="/create/post" disabled={!profile.current?.jwt}>
        {#snippet prefix()}
          <Icon src={PencilSquare} size="16" micro />
        {/snippet}
        {$t('nav.create.post')}
      </MenuButton>
      <MenuButton
        link
        href="/create/community"
        disabled={!profile.current?.jwt ||
          !profile.current?.user ||
          (site.data?.site_view.local_site.community_creation_admin_only &&
            !isAdmin(profile.current.user))}
      >
        {#snippet prefix()}
          <Icon src={Newspaper} size="16" micro />
        {/snippet}
        {$t('nav.create.community')}
      </MenuButton>
      {#if !profile.current?.jwt}
        <span class="text-sm mx-4 my-1 py-1">
          {$t('nav.create.logingate')}
        </span>
      {/if}
    </Menu>
    <Menu>
      {#snippet target()}
        <button
          class="w-10 h-10 rounded-full border-slate-200 dark:border-zinc-700
      transition-all bg-slate-50 dark:bg-zinc-900 relative
      hover:bg-slate-200 dark:hover:bg-zinc-700 group cursor-pointer"
          title={$t('profile.profile')}
        >
          {#if profile.current?.user}
            <div
              class="w-full h-full aspect-square object-cover rounded-full grid place-items-center group-hover:scale-90 transition-transform group-active:scale-[85%]"
            >
              <Avatar
                url={profile.current.user.local_user_view.person.avatar}
                width={36}
                alt={profile.current.user.local_user_view.person.name}
              />
            </div>
          {:else}
            <div class="w-full h-full grid place-items-center">
              <Icon src={Bars3} micro size="18" />
            </div>
          {/if}
        </button>
      {/snippet}
      {#snippet children(open)}
        {#if open}
          {#await import('./Profile.svelte') then { default: Profile }}
            <Profile />
          {/await}
        {/if}
      {/snippet}
    </Menu>
  </div>
</nav>
