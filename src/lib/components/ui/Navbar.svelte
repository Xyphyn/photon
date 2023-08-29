<script lang="ts">
  import { profile, profileData, setUserID } from '$lib/auth.js'
  import Button from '$lib/components/input/Button.svelte'
  import Link from '$lib/components/input/Link.svelte'
  import ShieldIcon from '$lib/components/lemmy/moderation/ShieldIcon.svelte'
  import {
    amModOfAny,
    isAdmin,
  } from '$lib/components/lemmy/moderation/moderation.js'
  import Avatar from '$lib/components/ui/Avatar.svelte'
  import Logo from '$lib/components/ui/Logo.svelte'
  import Spinner from '$lib/components/ui/loader/Spinner.svelte'
  import Menu from '$lib/components/ui/menu/Menu.svelte'
  import MenuButton from '$lib/components/ui/menu/MenuButton.svelte'
  import { LINKED_INSTANCE_URL, instance } from '$lib/instance.js'
  import { site } from '$lib/lemmy.js'
  import { theme } from '$lib/ui/colors.js'
  import {
    ArrowLeftOnRectangle,
    Bars3,
    Bookmark,
    Cog6Tooth,
    CommandLine,
    ComputerDesktop,
    GlobeAlt,
    Icon,
    Inbox,
    InformationCircle,
    MagnifyingGlass,
    Moon,
    Newspaper,
    PencilSquare,
    Plus,
    Sun,
    UserCircle,
    UserGroup,
  } from 'svelte-hero-icons'

  let scrollY = 0
</script>

<svelte:window bind:scrollY />

<nav
  class="flex flex-row gap-2 items-center sticky top-0 bg-slate-100/80
  dark:bg-black/80 backdrop-blur-3xl w-full mx-auto px-4 py-2 z-50 box-border h-16"
>
  <div class="flex flex-row gap-2 items-center mr-auto">
    <a href="/" class="flex flex-row items-center gap-2">
      {#if LINKED_INSTANCE_URL}
        {#if $site}
          <Avatar
            url={$site.site_view.site.icon}
            alt={$site.site_view.site.name}
            width={32}
            res={64}
            circle={false}
            class="rounded-md"
          />
          <div class="flex flex-row items-center gap-2 max-[500px]:hidden">
            <span class="opacity-30 text-xl">/</span>
            <div class="text-sm font-bold inline-flex flex-col">
              <span>{$site.site_view.site.name}</span>
              <span
                class="font-normal text-xs flex items-center gap-1 text-slate-600 dark:text-zinc-400"
              >
                Powered by <Link
                  href="https://github.com/Xyphyn/photon"
                  highlight={false}
                  class="font-bold flex items-center gap-0.5 hover:underline text-black dark:text-white"
                >
                  <Logo width={12} /> Photon
                </Link>
              </span>
            </div>
          </div>
        {:else}
          <Spinner width={32} />
        {/if}
      {:else}
        <Logo width={40} />
        <div class="flex flex-row items-center gap-2 max-[1000px]:hidden">
          <span class="opacity-30 text-xl">/</span>
          <span class="text-sm font-bold">
            {$instance}
          </span>
        </div>
      {/if}
    </a>
  </div>
  <div class="flex flex-row gap-2 py-2 px-2">
    {#if $profile?.user && isAdmin($profile.user)}
      <Button
        href="/admin"
        aria-label="Admin"
        class="max-md:w-9 max-md:h-8 max-md:!p-0
        dark:text-zinc-300 text-slate-700 hover:text-inherit hover:dark:text-inherit
      hover:bg-slate-200 relative hover:border-slate-300"
      >
        <Icon src={CommandLine} mini size="16" slot="icon" />
        <span class="hidden md:inline">Admin</span>
      </Button>
    {/if}
    {#if amModOfAny($profile?.user)}
      <Button
        href="/moderation"
        aria-label="Moderation"
        class="max-md:w-9 max-md:h-8 max-md:!p-0 dark:text-zinc-300 text-slate-700
        hover:text-inherit hover:bg-slate-200 hover:dark:text-inherit relative hover:border-slate-300"
      >
        {#if $profile?.user?.reports ?? 0 > 0}
          <div
            class="rounded-full w-2 h-2 bg-red-500 absolute -top-1 -left-1"
          />
        {/if}
        <ShieldIcon filled width={15} />
        <span class="hidden md:inline">Reports</span>
      </Button>
    {/if}
    <Button
      href="/search"
      aria-label="Search"
      class="max-md:w-9 max-md:h-8 max-md:!p-0
      dark:text-zinc-300 text-slate-700 hover:text-inherit hover:dark:text-inherit hover:bg-slate-200 hover:border-slate-300"
    >
      <Icon mini src={MagnifyingGlass} width={16} slot="icon" />
      <span class="hidden md:inline">Search</span>
    </Button>
    <Button
      href="/communities"
      aria-label="Communities"
      class="max-md:w-9 max-md:h-8 max-md:!p-0
      dark:text-zinc-300 text-slate-700 hover:text-inherit
      hover:dark:text-inherit hover:bg-slate-200 hover:border-slate-300"
    >
      <Icon mini src={GlobeAlt} size="16" slot="icon" />
      <span class="hidden md:inline">Explore</span>
    </Button>
    <Menu let:toggleOpen alignment="bottom-right">
      <Button
        color="primary"
        slot="button"
        aria-label="Create"
        on:click={toggleOpen}
        class="max-md:w-9 max-md:h-8 max-md:!p-0"
      >
        <Icon src={Plus} width={18} mini slot="icon" />
        <span class="hidden md:inline">Create</span>
      </Button>
      <li class="text-xs opacity-80 text-left mx-4 my-1 py-1">Create</li>
      <MenuButton
        link
        href="/create/post"
        disabled={$profile?.jwt == undefined}
      >
        <Icon src={PencilSquare} mini width={16} />
        Post
      </MenuButton>
      <MenuButton
        link
        href="/create/community"
        disabled={!$profile?.jwt ||
          !$profile?.user ||
          ($site?.site_view.local_site.community_creation_admin_only &&
            !isAdmin($profile.user))}
      >
        <Icon src={Newspaper} mini width={16} />
        Community
      </MenuButton>
      {#if !$profile?.jwt}
        <span class="text-sm mx-4 my-1 py-1">
          <Link highlight href="/login">Log in</Link> to create content.
        </span>
      {/if}
    </Menu>
  </div>
  <Menu
    let:toggleOpen
    alignment="bottom-right"
    itemsClass="h-8 md:h-8"
    containerClass="!max-h-[28rem]"
  >
    <button
      class="w-8 h-8 rounded-full ring-1 ring-slate-300 bg-slate-100
      dark:bg-zinc-800 relative"
      aria-label="Profile"
      slot="button"
      on:click={toggleOpen}
    >
      {#if $profile?.user}
        <div class="w-8 h-8 aspect-square object-cover rounded-full">
          <Avatar
            url={$profile.user.local_user_view.person.avatar}
            width={32}
            alt={$profile.user.local_user_view.person.name}
          />
        </div>
        {#if $profile.user.unreads > 0}
          <div
            class="rounded-full w-2 h-2 bg-red-500 absolute top-0 left-0 z-10"
          />
        {/if}
      {:else}
        <div class="w-full h-full grid place-items-center">
          <Icon src={Bars3} mini size="18" />
        </div>
      {/if}
    </button>
    <li class="text-xs opacity-80 text-left mx-4 my-1 py-1">
      {$profile?.user ? $profile.user.local_user_view.person.name : 'Profile'}
    </li>
    {#if $profile?.user}
      <MenuButton link href="/profile">
        <Icon src={UserCircle} mini width={16} /> Profile
      </MenuButton>
      <MenuButton link href="/inbox">
        <div class="relative">
          {#if $profile.user.unreads > 0}
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
    {/if}
    <MenuButton link href="/accounts">
      <Icon src={UserGroup} mini width={16} />
      Accounts
      <span
        class="text-xs font-bold bg-slate-100 dark:bg-zinc-700 px-2 py-0.5 rounded-md ml-auto"
      >
        {$profileData.profiles.length}
      </span>
    </MenuButton>
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
    <MenuButton>
      <Icon
        src={$theme == 'system'
          ? ComputerDesktop
          : $theme == 'light'
          ? Sun
          : $theme == 'dark'
          ? Moon
          : Moon}
        mini
        size="16"
      />
      <div class="flex flex-row flex-wrap justify-between w-full">
        <span>Theme</span>
        <select
          bind:value={$theme}
          on:click|stopPropagation
          class="ml-auto w-max px-1 rounded-sm cursor-pointer bg-transparent border dark:border-zinc-700"
        >
          <option value="system">System</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>
    </MenuButton>
    <hr class="dark:opacity-10 w-[90%] my-2 mx-auto" />
    <li class="flex flex-col px-4 py-1 mx-auto my-1 text-xs w-full">
      <div class="flex flex-row gap-2 w-full">
        <!-- svelte-ignore missing-declaration -->
        <span class="mr-auto">v{__VERSION__}</span>
        <div class="ml-auto" />
        <a href="https://buymeacoffee.com/xylight" class="hover:underline">
          Donate
        </a>
        <a href="https://github.com/Xyphyn/photon" class="hover:underline">
          GitHub
        </a>
      </div>
      <span class="opacity-70 ml-auto w-max">
        Made by <Link href="https://xylight.dev">Xylight</Link>
      </span>
    </li>
  </Menu>
</nav>
