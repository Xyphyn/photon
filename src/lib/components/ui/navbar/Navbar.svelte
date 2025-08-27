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
  import { Menu, Spinner } from 'mono-svelte'
  import {
    Bars3,
    GlobeAlt,
    Icon,
    MagnifyingGlass,
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
    class="ml-2 lg:ml-2 logo border-0 lg:rounded-full! lg:w-10! lg:h-10 lg:px-0! text-primary-900! dark:text-primary-100!"
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
    <NavButton
      class="relative"
      label={$t('nav.create.label')}
      icon={Plus}
      adaptive={false}
      color="primary"
      href="/create"
    />
    <Menu placement="bottom">
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
  </div>
</nav>
