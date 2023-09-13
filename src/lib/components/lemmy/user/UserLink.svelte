<script lang="ts">
  import ShieldIcon from '$lib/components/lemmy/moderation/ShieldIcon.svelte'
  import Avatar from '$lib/components/ui/Avatar.svelte'
  import { userSettings } from '$lib/settings.js'
  import type { Person } from 'lemmy-js-client'
  import { Icon, NoSymbol } from 'svelte-hero-icons'

  export let user: Person
  export let avatar: boolean = false
  export let avatarSize: number = 24
  export let badges: boolean = true
  export let inComment: boolean = false
  export let showInstance: boolean = false

  function linkFromCommunity(user: Person) {
    const domain = new URL(user.actor_id).hostname
    return `/u/${user.name}@${domain}`
  }
</script>

<a
  class="items-center inline-flex flex-row gap-1 hover:underline"
  href={linkFromCommunity(user)}
>
  {#if avatar}
    <Avatar url={user.avatar} alt={user.name} width={avatarSize} />
  {/if}
  <span
    class="flex flex-wrap gap-0"
    class:ml-0.5={avatar}
    class:text-red-500={user.admin}
    class:font-bold={user.admin}
  >
    <span
      class:font-medium={($userSettings.showInstances.comments && inComment) ||
        $userSettings.showInstances.user ||
        showInstance}
    >
      {$userSettings.displayNames ? user.display_name ?? user.name : user.name}
    </span>
    {#if $userSettings.showInstances.user || ($userSettings.showInstances.comments && inComment) || showInstance}
      <span class="text-slate-500 dark:text-zinc-500 font-normal">
        @{new URL(user.actor_id).hostname}
      </span>
    {/if}
  </span>
  {#if badges && (user.admin || user.banned || user.bot_account)}
    <span>
      {#if user.admin}
        <div class="text-red-500" title="Admin">
          <ShieldIcon width={12} filled />
        </div>
      {/if}
      {#if user.banned}
        <div class="text-red-500" title="Banned">
          <Icon src={NoSymbol} mini size="12" />
        </div>
      {/if}
      {#if user.bot_account}
        <div class="text-blue-500 font-bold" title="Bot">BOT</div>
      {/if}
    </span>
  {/if}
</a>
