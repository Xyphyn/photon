<script lang="ts">
  import { profile, profileData } from '$lib/auth.js'
  import Link from '$lib/components/input/Link.svelte'
  import ShieldIcon from '$lib/components/lemmy/moderation/ShieldIcon.svelte'
  import {
    amModOfAny,
    isAdmin,
  } from '$lib/components/lemmy/moderation/moderation.js'
  import Avatar from '$lib/components/ui/Avatar.svelte'
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
  import Profile from './Profile.svelte'
  import NavButton from './NavButton.svelte'
  import { scale } from 'svelte/transition'
  import { expoOut, backOut } from 'svelte/easing'
  import { flip } from 'svelte/animate'
</script>

<nav
  class="flex flex-row gap-2 items-center w-full mx-auto z-50 box-border h-16
  p-1 duration-150 overflow-x-auto overflow-y-hidden
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
    flex flex-row items-center gap-2 [&>*]:flex-shrink-0 overflow-x-auto overflow-y-hidden
    md:max-w-64 sm:max-w-48 max-w-36 w-full"
      >
        {#each $profile.favorites ?? [] as favorite (favorite.id)}
          <div
            class="h-10 w-10 flex"
            transition:scale|global={{
              start: 0.7,
              easing: backOut,
              duration: 400,
              delay: 200,
            }}
            animate:flip={{
              easing: backOut,
              duration: 400,
              delay: 100,
            }}
          >
            <NavButton
              class="w-full h-full bg-slate-100 dark:bg-zinc-900 relative"
              title={favorite.name}
              href={favorite.url.toString()}
              label={favorite.name}
            >
              {#if favorite.type == 'post'}
                <div
                  class="relative w-full h-full grid place-items-center overflow-visible"
                >
                  {#if favorite.subdivision}
                    <Avatar
                      alt={favorite.subdivision.name}
                      url={favorite.subdivision.avatar}
                      width={28}
                      res={64}
                      class=""
                    />
                    <Icon
                      src={PencilSquare}
                      mini
                      size="20"
                      class="absolute -bottom-1 -right-1 rounded-full bg-zinc-900 p-0.5"
                    />
                  {/if}
                </div>
              {:else}
                <Avatar
                  alt={favorite.name}
                  url={favorite.avatar}
                  res={64}
                  width={28}
                  class="w-full"
                />
                <Icon
                  src={Newspaper}
                  mini
                  size="20"
                  class="absolute -bottom-1 -right-1 rounded-full bg-zinc-900 p-0.5"
                />
              {/if}
            </NavButton>
          </div>
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
