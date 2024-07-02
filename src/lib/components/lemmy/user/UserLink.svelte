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
  export let showInstance: boolean =
    $userSettings.showInstances.user ||
    ($userSettings.showInstances.comments && inComment)
</script>

<a
  class="items-center flex flex-row gap-1 hover:underline max-w-full min-w-0 {$$props.class ??
    ''}"
  href="/u/{user.name}@{new URL(user.actor_id).hostname}"
>
  {#if avatar}
    <Avatar
      url={user.avatar}
      alt={user.name}
      width={avatarSize}
      class="flex-shrink-0"
    />
  {/if}
  <!-- div text color affects ellipsis. -->
  <div
    class="text-slate-500 dark:text-zinc-500 userlink-text"
    class:ml-0.5={avatar}
  >
    <span class:font-medium={showInstance} class="text-slate-600 dark:text-zinc-400">
      {$userSettings.displayNames ? user.display_name || user.name : user.name}
    </span>
    {#if showInstance}
      <span class="-ml-1 {$$props.instanceClass ?? ''}">
        @{new URL(user.actor_id).hostname}
      </span>
    {/if}
  </div>

  {#if badges}
    {#if user.banned}
      <div class="text-red-500" title="Banned">
        <Icon src={NoSymbol} mini size="12" />
      </div>
    {/if}
    {#if user.bot_account}
      <div class="text-blue-500 font-bold" title="Bot">BOT</div>
    {/if}
    <slot name="badges" />
  {/if}
</a>

<style>
  .userlink-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
