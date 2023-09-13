<script lang="ts">
  import type { Profile } from '$lib/auth.js'
  import { Icon, UserCircle } from 'svelte-hero-icons'

  export let profile: Profile | undefined = undefined
  export let selected: boolean = false
  export let index: number = 0
  export let size: number = 20
</script>

{#if profile}
  <div style="width: {size}px; height: {size}px;">
    {#if profile.avatar && !profile.color}
      <img
        src="{profile.avatar}?thumbnail=32&format=webp"
        alt={profile.username}
        width={size}
        height={size}
        class="flex-shrink-0 rounded-full ring-slate-800/50 dark:ring-zinc-200/50"
        class:ring-2={selected}
      />
    {:else}
      <Icon
        src={UserCircle}
        mini={selected}
        size={`${size}`}
        title={profile.username}
        class="text-blue-500 flex-shrink-0"
        style={profile.color
          ? `color: ${profile.color}`
          : `filter: hue-rotate(${index * 50}deg)`}
      />
    {/if}
  </div>
{/if}
