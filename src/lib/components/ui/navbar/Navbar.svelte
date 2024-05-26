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
  import { Button, Menu, MenuButton, MenuDivider, Spinner } from 'mono-svelte'
  import {
    GlobeAlt,
    Home,
    Icon,
    MagnifyingGlass,
    Newspaper,
    PencilSquare,
    Plus,
    ServerStack,
    XMark,
  } from 'svelte-hero-icons'
  import Profile from './Profile.svelte'
  import NavButton from './NavButton.svelte'
  import { fly, scale } from 'svelte/transition'
  import { expoOut, backOut } from 'svelte/easing'
  import { flip } from 'svelte/animate'
  import SearchBar from '$lib/components/lemmy/util/SearchBar.svelte'
  import { swipeGesture } from '$lib/input/swipe'
  import Logo from '../Logo.svelte'
  import { LINKED_INSTANCE_URL } from '$lib/instance'

  let searching = false
</script>

<nav
  class="flex flex-row gap-2 items-center w-full mx-auto z-50 box-border p-0.5
  duration-150
  {$$props.class}
  "
  style={$$props.style}
>
  <NavButton href="/" label="Home" class="ml-2 logo">
    <svelte:fragment slot="icon">
      {#if LINKED_INSTANCE_URL}
        {#if $site}
          <Avatar
            alt={$site.site_view.site.name}
            url={$site.site_view.site.icon}
            width={32}
            circle={false}
          />
        {:else}
          <Spinner width={32} />
        {/if}
      {:else}
        <Logo width={32} />
      {/if}
    </svelte:fragment>
  </NavButton>
  {#if searching}
    <div
      class="w-full h-full absolute z-20 p-2 flex items-center gap-2 bg-white dark:bg-zinc-950
      rounded-full"
      transition:scale={{
        start: 0.96,
        duration: 250,
        easing: backOut,
      }}
    >
      <Button
        size="custom"
        rounding="pill"
        class="w-11 h-11 flex-shrink-0"
        on:click={() => (searching = false)}
      >
        <Icon src={XMark} size="18" mini />
      </Button>
      <SearchBar let:search let:loading class="!rounded-full z-20">
        <Button
          size="custom"
          rounding="pill"
          class="w-11 h-11 flex-shrink-0"
          on:click={search}
          color="primary"
          type="submit"
          {loading}
        >
          <Icon src={MagnifyingGlass} size="18" mini slot="prefix" />
        </Button>
      </SearchBar>
    </div>
  {/if}
  <div class="flex flex-row gap-2 py-2 px-2 items-center w-full">
    {#if $profile}
      <div
        class="px-2 border-r border-l border-slate-200 dark:border-zinc-900
    flex flex-row items-center gap-2 [&>*]:flex-shrink-0 overflow-x-auto overflow-y-hidden
    md:max-w-64 sm:max-w-48 max-w-36 w-full max-[424px]:hidden"
      >
        {#each $profile.favorites ?? [] as favorite (favorite.id)}
          <div
            class="h-10 w-10 flex"
            transition:scale={{
              start: 0.7,
              easing: backOut,
              duration: 400,
              delay: 0,
            }}
            animate:flip={{
              easing: backOut,
              duration: 400,
              delay: 0,
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
                      width={32}
                      res={64}
                      class=""
                    />
                    <Icon
                      src={PencilSquare}
                      mini
                      size="20"
                      class="absolute -bottom-1 -right-1 rounded-full bg-slate-100 dark:bg-zinc-900 p-0.5"
                    />
                  {/if}
                </div>
              {:else}
                <Avatar
                  alt={favorite.name}
                  url={favorite.avatar}
                  res={64}
                  width={32}
                  class="w-full"
                />
                <Icon
                  src={Newspaper}
                  mini
                  size="20"
                  class="absolute -bottom-1 -right-1 rounded-full bg-slate-100 dark:bg-zinc-900 p-0.5"
                />
              {/if}
            </NavButton>
          </div>
        {/each}
      </div>
    {/if}
    <div class="ml-auto" />
    {#if $profile?.user && isAdmin($profile.user)}
      <NavButton
        href="/admin"
        label="Admin"
        icon={ServerStack}
        class="relative"
        isSelectedFilter={(path) => path.startsWith('/admin')}
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
        <ShieldIcon let:isSelected slot="icon" filled={isSelected} width={18} />
      </NavButton>
    {/if}
    <NavButton href="/communities" label="Explore" icon={GlobeAlt} />
    <NavButton
      on:click={() => (searching = true)}
      label="Search"
      icon={MagnifyingGlass}
    />
    <Menu placement="top">
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
    <Profile
      placement="top"
      itemsClass="h-8 md:h-8 z-10"
      targetClass="z-10 h-10"
      containerClass="!max-h-[28rem] z-10"
      buttonClass=""
    />
  </div>
</nav>
