<script lang="ts">
  import type { Community } from 'lemmy-js-client'

  export let community: Community
  export let avatar: boolean = false

  function linkFromCommunity(community: Community) {
    const local = community.local

    // if (local) {
    //   return `/c/${community.name}`
    // } else {
    const domain = new URL(community.actor_id).hostname

    return `/c/${community.name}@${domain}`
    // }
  }
</script>

<a class="items-center flex flex-row gap-2" href={linkFromCommunity(community)}>
  {#if avatar}
    <img
      src={community.icon ??
        `https://api.dicebear.com/6.x/initials/svg?seed=${community.name}`}
      alt=""
      width={24}
      height={24}
      class="rounded-full aspect-square object-cover"
      loading="lazy"
    />
  {/if}
  {community.title}
</a>
