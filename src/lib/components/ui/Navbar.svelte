<script lang="ts">
  import Button from '$lib/components/input/Button.svelte'
  import Link from '$lib/components/input/Link.svelte'
  import ShieldIcon from '$lib/components/lemmy/moderation/ShieldIcon.svelte'
  import { amModOfAny } from '$lib/components/lemmy/moderation/moderation.js'
  import Avatar from '$lib/components/ui/Avatar.svelte'
  import Logo from '$lib/components/ui/Logo.svelte'
  import Spinner from '$lib/components/ui/loader/Spinner.svelte'
  import Menu from '$lib/components/ui/menu/Menu.svelte'
  import MenuButton from '$lib/components/ui/menu/MenuButton.svelte'
  import { authData, instance, user } from '$lib/lemmy.js'
  import {
    ArrowLeftOnRectangle,
    ArrowRightOnRectangle,
    Bookmark,
    Cog6Tooth,
    GlobeAlt,
    Icon,
    Inbox,
    InformationCircle,
    MagnifyingGlass,
    PencilSquare,
    Plus,
    UserCircle,
  } from 'svelte-hero-icons'

  let scrollY = 0
</script>

<svelte:window bind:scrollY />

<nav
  class="flex flex-row gap-2 items-center sticky top-0 bg-slate-100
  dark:bg-black {scrollY > 0
    ? 'bg-slate-100/80 dark:bg-black/80'
    : ''} backdrop-blur-3xl
  w-full mx-auto px-4 py-2 z-50 border-b transition-all
  border-slate-200 dark:border-zinc-900 box-border h-16"
>
  <div class="flex flex-row gap-2 items-center mr-auto">
    <a href="/" class="flex flex-row items-center gap-2">
      <Logo width={40} />
      <div class="flex flex-row items-center gap-2 max-[500px]:hidden">
        <span class="opacity-30 text-xl">/</span>
        <span class="text-sm font-bold">
          {$instance}
        </span>
      </div>
    </a>
  </div>
  <div class="flex flex-row gap-2 py-2 px-2">
    {#if $user && amModOfAny($user)}
      <Button
        href="/moderation"
        label="Search"
        class="max-md:w-9 max-md:h-8 max-md:!p-0 items-center justify-center
      dark:text-zinc-300 text-slate-700 hover:text-inherit
      hover:bg-slate-200 hover:dark:bg-zinc-900 relative"
      >
        {#if $user.reports ?? 0 > 0}
          <div
            class="rounded-full w-2 h-2 bg-red-500 absolute -top-1 -left-1"
          />
        {/if}
        <ShieldIcon width={15} />
        <span class="hidden md:inline">Reports</span>
      </Button>
    {/if}
    <Button
      href="/search"
      label="Search"
      class="max-md:w-9 max-md:h-8 max-md:!p-0 items-center justify-center
      dark:text-zinc-300 text-slate-700 hover:text-inherit hover:bg-slate-200 hover:dark:bg-zinc-900"
    >
      <Icon src={MagnifyingGlass} width={16} slot="icon" />
      <span class="hidden md:inline">Search</span>
    </Button>
    <Button
      href="/communities"
      label="Communities"
      class="max-md:w-9 max-md:h-8 max-md:!p-0 items-center justify-center
      dark:text-zinc-300 text-slate-700 hover:text-inherit hover:bg-slate-200 hover:dark:bg-zinc-900"
    >
      <Icon src={GlobeAlt} width={16} slot="icon" />
      <span class="hidden md:inline">Explore</span>
    </Button>
    <Menu let:toggleOpen alignment="bottom-right">
      <Button
        color="primary"
        slot="button"
        label="Create"
        on:click={toggleOpen}
        class="max-md:w-9 max-md:h-8 max-md:!p-0"
      >
        <Icon src={Plus} width={18} mini slot="icon" />
        <span class="hidden md:inline">Create</span>
      </Button>
      <li class="text-xs opacity-80 text-left mx-4 my-1 py-1">Create</li>
      <MenuButton link href="/create/post" disabled={$authData == undefined}>
        <Icon src={PencilSquare} mini width={16} />
        Post
      </MenuButton>
      {#if !$authData}
        <span class="text-sm mx-4 my-1 py-1">
          <Link highlight href="/login">Log in</Link> to create content.
        </span>
      {/if}
    </Menu>
  </div>
  <Menu let:toggleOpen alignment="bottom-right" itemsClass="!h-8">
    <button
      class="w-8 h-8 rounded-full ring-1 ring-slate-300 bg-slate-100
      dark:bg-zinc-800 relative"
      aria-label="Profile"
      slot="button"
      on:click={toggleOpen}
    >
      {#if $user === undefined}
        <div class="w-full h-full grid place-items-center">
          <Spinner width={20} />
        </div>
      {/if}
      {#if $user}
        <div class="w-8 h-8 aspect-square object-cover rounded-full">
          <Avatar
            url={$user.local_user_view.person.avatar}
            width={32}
            alt={$user.local_user_view.person.name}
          />
        </div>
        {#if $user.unreads > 0}
          <div
            class="rounded-full w-2 h-2 bg-red-500 absolute top-0 left-0 z-10"
          />
        {/if}
      {/if}
    </button>
    <li class="text-xs opacity-80 text-left mx-4 my-1 py-1">
      {$user ? $user.local_user_view.person.name : 'Profile'}
    </li>
    {#if $user && $authData}
      <MenuButton
        link
        href="/u/{$user.local_user_view.person.name}@{$authData.instance}"
      >
        <Icon src={UserCircle} mini width={16} /> Profile
      </MenuButton>
      <MenuButton link href="/inbox">
        <div class="relative">
          {#if $user.unreads > 0}
            <div
              class="rounded-full w-2 h-2 bg-red-500 absolute -top-1 -left-1"
            />
          {/if}<Icon src={Inbox} mini width={16} />
        </div>
        Inbox
      </MenuButton>
      <MenuButton link href="/saved">
        <Icon src={Bookmark} mini width={16} /> Saved
      </MenuButton>
      <MenuButton
        on:click={() => {
          localStorage.removeItem('user')
          user.set(undefined)
          authData.set(undefined)
        }}
        color="dangerSecondary"
      >
        <Icon src={ArrowRightOnRectangle} mini width={16} />Log out
      </MenuButton>
    {/if}
    {#if !$user || !$authData}
      <MenuButton link href="/login">
        <Icon src={ArrowLeftOnRectangle} mini width={16} />
        Log in
      </MenuButton>
    {/if}
    <hr class="dark:opacity-10 w-[90%] my-2 mx-auto" />
    <li class="text-xs px-4 py-1 my-1 opacity-80">App</li>
    <MenuButton link href="/settings">
      <Icon src={Cog6Tooth} mini width={16} />
      Settings
    </MenuButton>
    <MenuButton link href="/about">
      <Icon src={InformationCircle} mini width={16} />
      About
    </MenuButton>
    <hr class="dark:opacity-10 w-[90%] my-2 mx-auto" />
    <li class="flex flex-col px-4 py-1 mx-auto my-1 text-xs w-full">
      <div class="flex flex-row justify-center gap-2 w-full">
        <!-- svelte-ignore missing-declaration -->
        <span class="mr-auto">v{__VERSION__}</span>
        <a href="https://github.com/Xyphyn/photon" class="hover:underline">
          GitHub
        </a>
      </div>
      <span class="opacity-70 ml-auto w-max">Made with ❤️ by Xylight</span>
    </li>
  </Menu>
</nav>
