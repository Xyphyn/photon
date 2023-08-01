<script lang="ts">
  import {
    ArrowLeftOnRectangle,
    ChevronDoubleLeft,
    Cog6Tooth,
    Home,
    Icon,
    Plus,
  } from 'svelte-hero-icons'
  import Button from '../input/Button.svelte'
  import Avatar from '$lib/components/ui/Avatar.svelte'
  import { user } from '$lib/lemmy.js'

  let expanded = true
</script>

<nav
  class="hidden lg:flex flex-col pl-4 pr-4 py-4 overflow-auto sticky top-16 bottom-0
  gap-1 max-h-[calc(100vh-4rem)] w-full bg-slate-100 dark:bg-black"
  class:flex-1={expanded}
  class:w-max={!expanded}
>
  <Button
    on:click={() => (expanded = !expanded)}
    class="w-max !p-2 hover:bg-slate-200"
  >
    <Icon
      src={ChevronDoubleLeft}
      mini
      size="16"
      class="transition-transform {expanded ? '' : 'rotate-180'}"
    />
  </Button>
  <Button
    class="hover:bg-slate-200 {expanded ? '' : '!p-1.5'}"
    href="/"
    color="tertiary"
    alignment="left"
  >
    <Icon src={Home} solid size="20" />
    <span class:hidden={!expanded}>Frontpage</span>
  </Button>
  <Button
    class="hover:bg-slate-200 {expanded ? '' : '!p-1.5'}"
    href="/settings"
    color="tertiary"
    alignment="left"
  >
    <Icon src={Cog6Tooth} solid size="20" />
    <span class:hidden={!expanded}>Settings</span>
  </Button>
  <hr class="border-slate-300 dark:border-zinc-800 my-1" />
  {#if $user}
    {#each $user.follows
      .map((f) => f.community)
      .sort((a, b) => a.title.localeCompare(b.title)) as follow}
      <Button
        class="hover:bg-slate-200 {expanded ? '' : '!p-1.5'}"
        color="tertiary"
        alignment="left"
        href="/c/{follow.name}@{new URL(follow.actor_id).hostname}"
      >
        <Avatar url={follow.icon} alt={follow.name} title={follow.title} width={20} slot="icon" />
        <span class:hidden={!expanded}>{follow.title}</span>
      </Button>
    {/each}
    {#if $user.follows.length == 0}
      <Button
        class="hover:bg-slate-200 {expanded ? '' : '!p-1.5'}"
        href="/communities"
        color="tertiary"
        alignment="left"
      >
        <Icon src={Plus} solid size="20" />
        <span class:hidden={!expanded}>Add communities</span>
      </Button>
    {/if}
  {:else}
    <Button
      class="hover:bg-slate-200 {expanded ? '' : '!p-1.5'}"
      href="/login"
      color="tertiary"
      alignment="left"
    >
      <Icon src={ArrowLeftOnRectangle} solid size="20" />
      <span class:hidden={!expanded}>Log in</span>
    </Button>
  {/if}
</nav>
