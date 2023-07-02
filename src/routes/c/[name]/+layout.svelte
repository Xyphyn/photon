<script lang="ts">
  import type { GetCommunityResponse } from 'lemmy-js-client'
  import Avatar from '../../post/[id]/Avatar.svelte'

  export let data: GetCommunityResponse
</script>

<div class="flex flex-col gap-4">
  <div class="flex flex-row gap-4 items-center">
    <Avatar
      url={data.community_view.community.icon ??
        `https://api.dicebear.com/6.x/initials/svg?seed=${data.community_view.community.name}`}
      alt={data.community_view.community.title}
      width={64}
    />
    <h1 class="font-bold text-xl">
      {data.community_view.community.name}
    </h1>
  </div>
  <slot />
</div>
