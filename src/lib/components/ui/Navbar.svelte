<script lang="ts">
  import { goto } from '$app/navigation'
  import Button from '$lib/components/input/Button.svelte'
  import Link from '$lib/components/input/Link.svelte'
  import Logo from '$lib/components/ui/Logo.svelte'
  import Menu from '$lib/components/ui/menu/Menu.svelte'
  import MenuButton from '$lib/components/ui/menu/MenuButton.svelte'
  import {
    DEFAULT_INSTANCE_URL,
    authData,
    instance_url,
    user,
  } from '$lib/lemmy.js'
  import { Color } from '$lib/ui/colors.js'
  import {
    ArrowLeftOnRectangle,
    ArrowRightOnRectangle,
    Beaker,
    GlobeAlt,
    Icon,
    Inbox,
    PencilSquare,
    Plus,
    UserCircle,
  } from 'svelte-hero-icons'
</script>

<nav
  class="flex flex-row gap-2 items-center sticky top-0 bg-slate-50/80
  lg:bg-white/80 lg:rounded-b-xl
  dark:bg-zinc-950/80 lg:dark:bg-zinc-900/80 backdrop-blur-3xl max-w-5xl
  w-full mx-auto px-4 py-2 z-50 lg:border-x lg:border-b transition-all
  border-slate-200 dark:border-zinc-800 box-border"
>
  <div class="flex flex-row gap-2 items-center mr-auto">
    <a href="/" class="flex flex-row items-center gap-2">
      <Logo width={40} />
      <div class="flex flex-col">
        <span class="font-bold">Photon</span>
        <span
          class="text-xs opacity-50
        transition-opacity"
        >
          {#if $authData?.instance}
            {$authData.instance}
          {:else}
            {DEFAULT_INSTANCE_URL}
          {/if}
        </span>
      </div>
    </a>
  </div>
  <div class="flex flex-row gap-2 py-2 px-3">
    <Link href="/communities" label="Communities">
      <Icon src={GlobeAlt} width={16} />
      <span class="hidden sm:inline ml-1">Explore</span>
    </Link>
    <Menu let:toggleOpen>
      <Button
        color={Color.accent}
        slot="button"
        label="Create"
        on:click={toggleOpen}
      >
        <Icon src={Plus} width={18} mini />
        <span class="hidden sm:inline">Create</span>
      </Button>
      <span class="text-xs opacity-80 text-left mx-4 my-2">Create</span>
      <MenuButton link href="/create/post">
        <Icon src={PencilSquare} mini width={16} />
        Post
      </MenuButton>
    </Menu>
  </div>
  <Menu let:toggleOpen>
    <button
      class="w-8 h-8 rounded-full ring-1 ring-slate-300 bg-slate-100
      dark:bg-zinc-800 relative"
      aria-label="Profile"
      slot="button"
      on:click={toggleOpen}
    >
      {#if $user}
        <img
          src={$user.person.avatar ??
            'https://xylo.xylight.dev/img/logo-background.svg'}
          alt=""
          width={32}
          height={32}
          class="rounded-full"
        />
        {#if $user.unreads > 0}
          <div class="rounded-full w-2 h-2 bg-red-500 absolute top-0 left-0" />
        {/if}
      {/if}
    </button>
    <span class="text-xs opacity-80 text-left mx-4 my-2">
      {$user ? $user.person.name : 'Profile'}
    </span>
    {#if !$user || !$authData}
      <MenuButton link href="/login">
        <Icon src={ArrowLeftOnRectangle} mini width={16} /> Log in
      </MenuButton>
    {:else}
      <MenuButton link href="/u/{$user.person.name}@{$authData.instance}">
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
      <MenuButton
        on:click={() => {
          localStorage.removeItem('user')
          user.set(undefined)
          authData.set(undefined)
        }}
        color={Color.dangerSecondary}
      >
        <Icon src={ArrowRightOnRectangle} mini width={16} />Log out
      </MenuButton>
      <hr class="opacity-10 w-[90%] my-2 mx-auto" />
      <span class="text-xs px-4 my-1">v{__VERSION__}</span>
      <MenuButton link href="/experiments">
        <Icon src={Beaker} mini width={16} />
        Experiments
      </MenuButton>
      <!-- svelte-ignore missing-declaration -->
    {/if}
  </Menu>
</nav>
