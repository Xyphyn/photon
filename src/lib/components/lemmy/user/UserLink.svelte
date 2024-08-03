<script lang="ts" context="module">
  import { env } from '$env/dynamic/public'

  const hasPhotonBadge = (actor_id: string) =>
    env.PUBLIC_PHOTON_BADGE &&
    env.PUBLIC_PHOTON_BADGE.split(',').includes(actor_id)
</script>

<script lang="ts">
  import Avatar from '$lib/components/ui/Avatar.svelte'
  import Logo from '$lib/components/ui/Logo.svelte'
  import { userSettings } from '$lib/settings.js'
  import type { Person } from 'lemmy-js-client'
  import { Icon, NoSymbol } from 'svelte-hero-icons'

  export let user: Person
  export let avatar: boolean = false
  export let avatarSize: number = 24
  export let badges: boolean = true
  export let inComment: boolean = false
  export let showInstance: boolean =
    $userSettings.showInstances.user ||
    ($userSettings.showInstances.comments && inComment)
  export let displayName = $userSettings.displayNames
  $: photonBadge = hasPhotonBadge(user.actor_id)
</script>

<a
  class="items-center flex flex-row gap-1 hover:underline max-w-full min-w-0 {$$props.class ??
    ''}"
  href="/u/{user.name}@{new URL(user.actor_id).hostname}"
  data-sveltekit-preload-data="tap"
>
  {#if avatar}
    <Avatar
      url={user.avatar}
      alt={user.name}
      width={avatarSize}
      class="flex-shrink-0"
    />
  {/if}
  <span
    class="flex gap-0 items-center flex-shrink max-w-full min-w-0"
    class:ml-0.5={avatar}
    class:text-indigo-600={photonBadge}
    class:dark:text-indigo-400={photonBadge}
  >
    <span class:font-medium={showInstance} class="username-text">
      {displayName ? user.display_name || user.name : user.name}
    </span>
    {#if showInstance}
      <span
        class="text-slate-500 dark:text-zinc-500 font-normal instance-text flex-shrink {$$props.instanceClass ??
          ''}"
      >
        @{new URL(user.actor_id).hostname}
      </span>
    {/if}
  </span>
  {#if badges}
    {#if user.banned}
      <div class="text-red-500" title="Banned">
        <Icon src={NoSymbol} mini size="12" />
      </div>
    {/if}
    {#if user.bot_account}
      <div class="text-blue-500 font-bold" title="Bot">BOT</div>
    {/if}
    {#if photonBadge}
      <Logo width={16} />
    {/if}
    <slot name="badges" />
  {/if}
</a>

<style>
  .instance-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0;
    max-width: 100%;
    flex: 1;
  }

  .username-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
