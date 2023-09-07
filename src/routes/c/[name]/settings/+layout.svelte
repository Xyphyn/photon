<script lang="ts">
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import MultiSelect from '$lib/components/input/Switch.svelte'
  import { fullCommunityName } from '$lib/util.js'
  import type { PageData } from './$types.js'

  export let data: PageData

  $: communityUrl = `/c/${fullCommunityName(
    data.community.community_view.community.name,
    data.community.community_view.community.actor_id
  )}`
</script>

<div class="flex flex-col gap-4 h-full">
  <MultiSelect
    headless
    options={[`${communityUrl}/settings`, `${communityUrl}/settings/team`]}
    optionNames={['Settings', 'Team']}
    selected={$page.url.pathname}
    on:select={(e) => {
      goto(e.detail)
    }}
  />
  <slot />
</div>
