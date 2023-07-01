<script lang="ts">
  import type { Community } from 'lemmy-js-client'

  export let community: Community

  function linkFromCommunity(community: Community) {
    const local = community.local

    if (local) {
      return `/c/${community.name}`
    } else {
      const domain = new URL(community.actor_id).hostname

      return `/c/${community.name}@${domain}`
    }
  }
</script>

<a href={linkFromCommunity(community)}>{community.title}</a>
