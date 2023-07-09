<script lang="ts">
  import Avatar from '$lib/components/ui/Avatar.svelte'
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
  class="items-center flex flex-row gap-1 hover:underline"
  href={linkFromCommunity(user)}
>
  {#if avatar}
    <Avatar url={user.avatar} alt={user.name} width={avatarSize} />
  {/if}
  {user.name}
</a>
