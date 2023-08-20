<script lang="ts">
  import type { Profile } from '$lib/auth.js'
  import { Icon, UserCircle } from 'svelte-hero-icons'

  export let profile: Profile | undefined = undefined
  export let selected: boolean = false
  export let index: number = 0
  export let size: number = 20
</script>

{#if profile}
  <Icon
    src={UserCircle}
    mini={selected}
    size={`${size}`}
    title={profile.username}
    class="text-blue-500"
    style={profile.color
      ? `color: ${profile.color}`
      : `filter: hue-rotate(${index * 50}deg)`}
  />
{/if}
