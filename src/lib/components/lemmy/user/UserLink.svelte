<script lang="ts">
  import Avatar from '$lib/components/ui/Avatar.svelte'
  import { userSettings } from '$lib/settings.js'
  import type { Person } from 'lemmy-js-client'

  export let user: Person
  export let avatar: boolean = false
  export let avatarSize = 24
  export let badges = true

  function linkFromCommunity(user: Person) {
    const domain = new URL(user.actor_id).hostname
    return `/u/${user.name}@${domain}`
  }
</script>

<a
  class="items-center flex flex-row gap-1 hover:underline"
  href={linkFromCommunity(user)}
>
  {#if avatar}
    <Avatar url={user.avatar} alt={user.name} width={avatarSize} />
  {/if}
  <span class="flex gap-0">
    {#if !user.local && $userSettings.showInstance}
      {user.name}
      <span class="text-slate-500 dark:text-zinc-400 font-normal">
        @{new URL(user.actor_id).hostname}
      </span>
    {:else}
      {user.name}
    {/if}
  </span>
</a>
