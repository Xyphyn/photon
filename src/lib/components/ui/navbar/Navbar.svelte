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
  import { Menu, MenuButton, MenuDivider, Spinner } from 'mono-svelte'
  import {
    GlobeAlt,
    Home,
    Icon,
    MagnifyingGlass,
    Newspaper,
    PencilSquare,
    Plus,
    ServerStack,
  } from 'svelte-hero-icons'
  import { fly } from 'svelte/transition'
  import Profile from './Profile.svelte'
  import NavButton from './NavButton.svelte'
</script>

<nav
  class="flex flex-row gap-2 items-center w-full mx-auto p-1 z-50 box-border h-16
  {$$props.class}
  "
  style={$$props.style}
>
  <div class="flex flex-row gap-2 py-2 px-2 items-center w-full">
    <Profile
      placement="top"
      itemsClass="h-8 md:h-8 z-10"
      targetClass="z-10 h-8"
      containerClass="!max-h-[28rem] z-10"
      buttonClass=""
    />
    {#if $profile}
      <div
        class="px-2 border-r border-l border-slate-200 dark:border-zinc-900
    flex flex-row items-center gap-2 flex-shrink overflow-hidden max-[500px]:hidden"
      >
        {#each $profile.favorites ?? [] as favorite}
          <NavButton href={favorite.url.toString()} label="Community">
            <Avatar
              alt={favorite.name}
              url={favorite.avatar}
              res={64}
              width={28}
            />
          </NavButton>
        {/each}
      </div>
    {/if}
    <div class="ml-auto" />
    {#if amModOfAny($profile?.user)}
      <NavButton href="/moderation" label="Moderation" class="relative">
        {#if ($profile?.user?.notifications.reports ?? 0) > 0}
          <div
            class="rounded-full w-2 h-2 bg-red-500 absolute -top-1 -left-1"
          />
        {/if}
        <ShieldIcon let:isSelected slot="icon" filled={isSelected} width={18} />
      </NavButton>
    {/if}
    <NavButton
      href="/communities"
      label="Explore"
      icon={GlobeAlt}
    />{#if $profile?.user && isAdmin($profile.user)}
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
    <NavButton href="/search" label="Search" icon={MagnifyingGlass} />
    <NavButton href="/" label="Home" icon={Home} />
    <Menu placement="top" targetClass="h-8">
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
        <Icon src={PencilSquare} mini width={16} slot="prefix" />
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
        <Icon src={Newspaper} mini width={16} slot="prefix" />
        Community
      </MenuButton>
      {#if !$profile?.jwt}
        <span class="text-sm mx-4 my-1 py-1">
          <Link highlight href="/login">Log in</Link> to create content.
        </span>
      {/if}
    </Menu>
  </div>
</nav>
