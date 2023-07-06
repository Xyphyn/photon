<script lang="ts">
  import type { Person } from 'lemmy-js-client'

  export let user: Person
  export let avatar: boolean = false

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
    <img
      src={user.avatar ??
        `https://api.dicebear.com/6.x/initials/svg?seed=${user.name}`}
      alt=""
      width={24}
      height={24}
      class="rounded-full aspect-square object-cover"
      loading="lazy"
    />
  {/if}
  {user.name}
</a>
