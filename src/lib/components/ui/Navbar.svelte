<script lang="ts">
  import { profile, profileData } from '$lib/auth.js'
  import Link from '$lib/components/input/Link.svelte'
  import ShieldIcon from '$lib/components/lemmy/moderation/ShieldIcon.svelte'
  import {
    amModOfAny,
    isAdmin,
  } from '$lib/components/lemmy/moderation/moderation.js'
  import Avatar from '$lib/components/ui/Avatar.svelte'
  import Logo from '$lib/components/ui/Logo.svelte'
  import { LINKED_INSTANCE_URL, instance } from '$lib/instance.js'
  import { site } from '$lib/lemmy.js'
  import { userSettings } from '$lib/settings.js'
  import { theme } from '$lib/ui/colors.js'
  import {
    Button,
    Menu,
    MenuButton,
    MenuDivider,
    Select,
    Spinner,
  } from 'mono-svelte'
  import {
    Bars3,
    Bookmark,
    BugAnt,
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
    ServerStack,
    Sun,
    UserCircle,
    UserGroup,
  } from 'svelte-hero-icons'
  import { fly } from 'svelte/transition'

  export let title: string | undefined = ''
</script>

<nav
  class="flex flex-row gap-2 items-center
   backdrop-blur-3xl w-full mx-auto px-4 py-2 z-50 box-border h-16
  {$$props.class}
  "
  style={$$props.style}
>
  <div class="flex flex-row gap-2 items-center mr-auto">
    <a href="/" class="flex flex-row items-center gap-2 logo group">
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
              {#if !$userSettings.hidePhoton}
                <span
                  class="text-xs flex items-center gap-1 text-slate-600 dark:text-zinc-400 font-normal"
                >
                  Powered by <a
                    href="https://github.com/Xyphyn/photon"
                    class="font-bold flex items-center gap-0.5 hover:underline text-black dark:text-white"
                  >
                    <Logo width={12} /> Photon
                  </a>
                </span>
              {/if}
            </div>
          </div>
        {:else}
          <Spinner width={32} />
        {/if}
      {:else}
        <Logo width={40} />
        <div class="flex flex-row items-center gap-2 max-[1000px]:hidden">
          <span class="opacity-30 text-xl">/</span>
          <span class="text-sm font-bold grid place-items-start">
            {#key title || $instance}
              <span
                in:fly={{ y: -12 }}
                out:fly={{ y: 12 }}
                style="grid-row: 1; grid-column: 1; max-width: 24ch;"
                class="overflow-hidden break-words overflow-ellipsis whitespace-nowrap"
              >
                {title || $instance}
              </span>
            {/key}
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
        class="max-md:w-9 max-md:h-8 max-md:!p-0 dark:text-zinc-300 text-slate-700"
      >
        <Icon src={ServerStack} mini size="18" slot="prefix" />
        <span class="hidden md:inline">Admin</span>
      </Button>
    {/if}
    {#if amModOfAny($profile?.user)}
      <Button
        href="/moderation"
        aria-label="Moderation"
        class="max-md:w-9 max-md:h-8 max-md:!p-0 dark:text-zinc-300 text-slate-700 relative"
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
      class="max-md:w-9 max-md:h-8 max-md:!p-0"
    >
      <Icon mini src={MagnifyingGlass} width={16} slot="prefix" />
      <span class="hidden md:inline">Search</span>
    </Button>
    <Button
      href="/communities"
      aria-label="Communities"
      class="max-md:w-9 max-md:h-8 max-md:!p-0"
    >
      <Icon mini src={GlobeAlt} size="16" slot="prefix" />
      <span class="hidden md:inline">Explore</span>
    </Button>
    <Menu placement="bottom-end" targetClass="h-8">
      <Button
        color="primary"
        slot="target"
        aria-label="Create"
        class="max-md:w-9 max-md:h-8 max-md:!p-0"
      >
        <Icon src={Plus} width={18} mini slot="prefix" />
        <span class="hidden md:inline">Create</span>
      </Button>
      <MenuDivider>Create</MenuDivider>
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
    placement="bottom-end"
    itemsClass="h-8 md:h-8 z-10"
    targetClass="z-10 h-8"
    containerClass="!max-h-[28rem] z-10"
  >
    <button
      class="w-8 h-8 rounded-full ring-1 ring-slate-300 bg-slate-100
      dark:bg-zinc-800 relative"
      aria-label="Profile"
      slot="target"
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
    <MenuDivider>
      {$profile?.user ? $profile.user.local_user_view.person.name : 'Profile'}
    </MenuDivider>
    {#if $profile?.user}
      <MenuButton link href="/profile">
        <Icon src={UserCircle} mini width={16} /> Profile
      </MenuButton>
      <MenuButton link href="/inbox">
        <Icon src={Inbox} mini width={16} />
        Inbox
        {#if $profile.user.unreads > 0}
          <div
            class="rounded-full w-auto flex items-center px-2 h-5 justify-center font-bold bg-red-500 ml-auto"
          >
            {$profile.user.unreads}
          </div>
        {/if}
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
    <MenuDivider>App</MenuDivider>
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
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div
        class="flex flex-row flex-wrap justify-between w-full items-center"
        on:click|stopPropagation
      >
        <span>Theme</span>
        <Select bind:value={$theme} class="ml-auto w-24" size="sm">
          <option value="system">System</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </Select>
      </div>
    </MenuButton>
    {#if $userSettings.debugInfo}
      <MenuButton link href="/util">
        <Icon src={BugAnt} mini width={16} />
        Debug
      </MenuButton>
    {/if}
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
