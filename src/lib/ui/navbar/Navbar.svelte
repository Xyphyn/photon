<script lang="ts">
  import { site } from '$lib/api/client.svelte'
  import { notifications, profile } from '$lib/app/auth.svelte'
  import { t } from '$lib/app/i18n'
  import { LINKED_INSTANCE_URL } from '$lib/app/instance.svelte'
  import { Menu, Spinner } from 'mono-svelte'
  import {
    Bars3,
    GlobeAlt,
    Home,
    Icon,
    MagnifyingGlass,
    PencilSquare,
    ServerStack,
    ShieldCheck,
  } from 'svelte-hero-icons/dist'
  import type { ClassValue } from 'svelte/elements'
  import Avatar from '../generic/Avatar.svelte'
  import Logo from '../generic/Logo.svelte'
  import CommandsWrapper from './commands/CommandsWrapper.svelte'
  import NavButton from './NavButton.svelte'

  let promptOpen: boolean = $state(false)
  interface Props {
    style?: string
    class?: ClassValue
  }

  let { style = '', class: clazz = '' }: Props = $props()
</script>

<CommandsWrapper bind:open={promptOpen} />
<nav
  class={[
    'w-full mx-auto z-50',
    'md:gap-5 gap-2 flex flex-row items-center justify-between p-2',
    'box-border p-0.5 duration-150 @container *:max-md:flex-1',
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
    icon={Home}
    href="/"
    label={$t('nav.home')}
    class="logo border-0 md:rounded-full! md:w-10! md:h-10 md:px-0! -order-1"
    adaptive={false}
  >
    {#snippet customIcon({ isSelected })}
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
        <div class="hidden md:block text-primary-900! dark:text-primary-100!">
          <Logo width={32} />
        </div>
        <div class={['block md:hidden text-inherit!']}>
          <div class="prefix">
            <Icon src={Home} size="20" mini />
          </div>
        </div>
      {/if}
    {/snippet}
  </NavButton>
  <div class="hidden md:block md:flex-1"></div>
  <div class="sr-only md:not-sr-only md:contents">
    {#if profile.isAdmin}
      <NavButton
        href="/admin"
        label={$t('nav.admin')}
        icon={ServerStack}
        class="relative order-0"
        isSelectedFilter={(path) => path.startsWith('/admin')}
      />
    {/if}
    {#if profile.isMod()}
      <NavButton
        href="/moderation"
        label={$t('nav.moderation')}
        class="relative order-0"
        icon={ShieldCheck}
      />
    {/if}
  </div>
  <NavButton
    href="/explore/communities"
    label={$t('routes.explore.title')}
    icon={GlobeAlt}
    isSelectedFilter={(path) => path.startsWith('/explore')}
    class="order-1"
  />
  <NavButton
    href="/search"
    label={$t('nav.search')}
    icon={MagnifyingGlass}
    class="order-3 md:order-2"
  />
  <NavButton
    label={$t('nav.create.label')}
    href="/create"
    isSelectedFilter={(path) => path.startsWith('/create')}
    icon={PencilSquare}
    class="order-2 md:order-3 nav-btn-sm-primary"
  />
  <Menu placement="bottom">
    {#snippet target(attachment)}
      <button
        {@attach attachment}
        class={[
          'w-10 h-10 rounded-full',
          'transition-all relative grid place-items-center',
          ' group cursor-pointer order-4',
        ]}
        title={$t('profile.profile')}
      >
        {#if profile.current?.user}
          <div
            class={[
              'h-full aspect-square object-cover rounded-full grid place-items-center',
              'border-slate-200 dark:border-zinc-700 hover:bg-slate-200 dark:hover:bg-zinc-700 bg-slate-50 dark:bg-zinc-900',
            ]}
          >
            <Avatar
              url={profile.current.user.local_user_view.person.avatar}
              width={36}
              alt={profile.current.user.local_user_view.person.name}
              class="group-hover:scale-90 transition-transform group-active:scale-85"
            />
          </div>
        {:else}
          <div class="w-full h-full grid place-items-center">
            <Icon src={Bars3} micro size="18" />
          </div>
        {/if}
        {#if Math.max(...Object.values($notifications)) > 0}
          <div
            class="w-2 h-2 absolute top-0.5 right-0.5 bg-red-500 rounded-full"
          ></div>
        {/if}
      </button>
    {/snippet}
    {#snippet children(open)}
      {#if open}
        {#await import('./Profile.svelte')}
          <div class="p-8 w-full h-full grid place-items-center">
            <Spinner width={20} />
          </div>
        {:then { default: Profile }}
          <Profile />
        {/await}
      {/if}
    {/snippet}
  </Menu>
</nav>
