<script lang="ts">
  import Avatar from '$lib/components/ui/Avatar.svelte'
  import { userSettings } from '$lib/settings.js'
  import type { Community } from 'lemmy-js-client'

  export let community: Community

  export let avatar: boolean = false
  export let name: boolean = true
  export let avatarSize: number = 24
  export let showInstance: boolean = $userSettings.showInstances.community
</script>

<a
  {...$$restProps}
  class="items-center flex flex-row gap-2 hover:underline flex-shrink-0"
  href="/c/{community.name}@{new URL(community.actor_id).hostname}"
>
  {#if avatar}
    <Avatar
      url={community.icon ??
        `https://api.dicebear.com/6.x/initials/svg?seed=${community.name}`}
      alt={community.name}
      width={avatarSize}
    />
  {/if}

  {#if name}
    <span class="flex gap-0">
      {#if showInstance}
        <span class="font-medium">{community.title}</span>
        <span class="text-slate-500 dark:text-zinc-500 font-normal">
          @{new URL(community.actor_id).hostname}
        </span>
      {:else}
        {community.title}
      {/if}
    </span>
  {/if}
</a>
