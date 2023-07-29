<script lang="ts">
  import ShieldIcon from '$lib/components/lemmy/moderation/ShieldIcon.svelte'
  import Avatar from '$lib/components/ui/Avatar.svelte'
  import { userSettings } from '$lib/settings.js'
  import type { Person } from 'lemmy-js-client'

  export let user: Person
  export let avatar: boolean = false
  export let avatarSize = 24

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
  <span class="flex flex-wrap gap-0" class:text-red-500={user.admin}>
    {#if $userSettings.showInstance}
      {user.name}
      <span class="text-slate-500 dark:text-zinc-400 font-normal">
        @{new URL(user.actor_id).hostname}
      </span>
    {:else}
      {user.name}
    {/if}
  </span>
  {#if user.admin}
    <span>
      <div class="text-red-500" title="Admin">
        <ShieldIcon width={12} filled />
      </div>
    </span>
  {/if}
</a>
