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
    Badge,
    Button,
    Menu,
    MenuButton,
    MenuDivider,
    Select,
    Spinner,
    toast,
  } from 'mono-svelte'
  import {
    Bars3,
    Bookmark,
    BugAnt,
    CodeBracket,
    CodeBracketSquare,
    Cog6Tooth,
    CommandLine,
    ComputerDesktop,
    GlobeAlt,
    Heart,
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
  import Profile from './Profile.svelte'
  import NavButton from './NavButton.svelte'

  export let title: string | undefined = ''
</script>

<nav
  class="flex flex-row gap-2 items-center
   backdrop-blur-lg w-full mx-auto px-4 py-2 z-50 box-border h-16
  {$$props.class}
  "
  style={$$props.style}
>
  <div class="flex flex-row gap-2 items-center mr-auto">
    <a
      href="/"
      class="flex flex-row items-center gap-2 logo group"
      title="Home"
    >
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
            {$site.site_view.site.name}
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
  <div class="flex flex-row gap-2 py-2 px-2 items-center">
    {#if $profile?.user && isAdmin($profile.user)}
      <NavButton
        href="/admin"
        label="Admin"
        icon={ServerStack}
        class="relative"
      >
        {#if ($profile?.user?.notifications.applications ?? 0) > 0}
          <div
            class="rounded-full w-2 h-2 bg-red-500 absolute -top-1 -left-1"
          />
        {/if}
      </NavButton>
    {/if}
    {#if amModOfAny($profile?.user)}
      <NavButton href="/moderation" label="Moderation" class="relative">
        {#if ($profile?.user?.notifications.reports ?? 0) > 0}
          <div
            class="rounded-full w-2 h-2 bg-red-500 absolute -top-1 -left-1"
          />
        {/if}
        <ShieldIcon slot="icon" filled width={15} />
      </NavButton>
    {/if}
    <NavButton href="/search" label="Search" icon={MagnifyingGlass} />
    <NavButton href="/communities" label="Explore" icon={GlobeAlt} />
    <Menu placement="bottom-end" targetClass="h-8">
      <NavButton
        class="relative"
        color="primary"
        slot="target"
        label="Create"
        icon={Plus}
      />
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
    <Profile
      placement="bottom-end"
      itemsClass="h-8 md:h-8 z-10"
      targetClass="z-10 h-8"
      containerClass="!max-h-[28rem] z-10"
    />
  </div>
</nav>
