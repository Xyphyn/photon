<script lang="ts">
  import Avatar from '$lib/components/ui/Avatar.svelte'
  import { userSettings } from '$lib/settings.js'
  import type { Community } from 'lemmy-js-client'

  export let community: Community
  export let avatar: boolean = false
  export let avatarSize: number = 24

  function linkFromCommunity(community: Community) {
    const domain = new URL(community.actor_id).hostname
    return `/c/${community.name}@${domain}`
  }
</script>

<a
  class="items-center flex flex-row gap-2 hover:underline"
  href={linkFromCommunity(community)}
>
  {#if avatar}
    <Avatar
      url={community.icon ??
        `https://api.dicebear.com/6.x/initials/svg?seed=${community.name}`}
      alt={community.name}
      width={avatarSize}
    />
  {/if}

  <span class="flex gap-0">
    {#if $userSettings.showInstances.community}
      {community.title}
      <span class="text-slate-500 dark:text-zinc-500 font-normal">
        @{new URL(community.actor_id).hostname}
      </span>
    {:else}
      {community.title}
    {/if}
  </span>
</a>
