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
  class="items-center flex flex-row gap-2 hover:underline max-w-full min-w-0 {$$props.class ||
    ''}"
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
    <!-- div text color affects ellipsis. -->
    <div class="communitylink-text text-slate-500 dark:text-zinc-500">
      <span class="font-medium text-slate-950 dark:text-zinc-50">
        {community.title}
      </span>
      {#if showInstance}
        <span class="-ml-1 {$$props.instanceClass || ''}">
          @{new URL(community.actor_id).hostname}
        </span>
      {/if}
    </div>
  {/if}
</a>

<style>
  .communitylink-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
