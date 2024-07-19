<script lang="ts">
  import Avatar from '$lib/components/ui/Avatar.svelte'
  import { userSettings } from '$lib/settings.js'
  import type { Community } from 'lemmy-js-client'

  export let community: Community

  export let avatar: boolean = false
  export let name: boolean = true
  export let avatarSize: number = 24
  export let showInstance: boolean = $userSettings.showInstances.community
  export let displayName: boolean = true
</script>

<a
  {...$$restProps}
  class="items-center flex flex-row gap-2 hover:underline max-w-full min-w-0 {$$props.class ||
    ''}"
  href="/c/{community.name}@{new URL(community.actor_id).hostname}"
  data-sveltekit-preload-data="tap"
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
    <span class="flex gap-0 items-center max-w-full min-w-0 flex-shrink">
      <span class="font-medium username-text">
        {displayName ? community.title : community.name}
      </span>
      {#if showInstance}
        <span
          class="text-slate-500 dark:text-zinc-500 font-normal
          instance-text flex-shrink {$$props.instanceClass || ''}"
        >
          @{new URL(community.actor_id).hostname}
        </span>
      {/if}
    </span>
  {/if}
</a>

<style>
  .instance-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
    flex: 1;
  }

  .username-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
