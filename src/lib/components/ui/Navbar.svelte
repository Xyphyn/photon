<script lang="ts">
  import { goto } from '$app/navigation'
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
    Cog6Tooth,
    Icon,
    Inbox,
  } from 'svelte-hero-icons'
</script>

<nav
  class="flex top-0 z-20 flex-row gap-4 items-center mt-2 w-full h-16
    max-w-5xl mx-auto px-6"
>
  <div class="flex flex-row gap-2 items-center mr-auto">
    <a href="/" class="flex flex-row items-center gap-2">
      <Logo width={40} />
      <div class="flex flex-col">
        <span class="font-bold">Xylemmy</span>
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
  <Link href="/communities">Communities</Link>
  <Menu>
    <button
      class="w-8 h-8 rounded-full ring-1 ring-slate-300 bg-slate-100 dark:bg-zinc-800"
      aria-label="Profile"
      slot="button"
    >
      {#if $user}
        <img
          src={$user.person_view.person.avatar ??
            'https://xylo.xylight.dev/img/logo-background.svg'}
          alt=""
          width={32}
          height={32}
        />
      {/if}
    </button>
    <span class="text-xs opacity-80 text-left mx-4 my-2">Profile</span>
    {#if !$user}
      <MenuButton link href="/login">
        <Icon src={ArrowLeftOnRectangle} mini width={16} /> Log in
      </MenuButton>
    {:else}
      <MenuButton link href="/inbox">
        <Icon src={Inbox} mini width={16} /> Inbox
      </MenuButton>
      <MenuButton
        on:click={() => {
          localStorage.removeItem('user')
          goto('/', {
            invalidateAll: true,
          })
        }}
        color={Color.dangerSecondary}
      >
        <Icon src={ArrowRightOnRectangle} mini width={16} />Log out
      </MenuButton>
    {/if}
  </Menu>
</nav>
