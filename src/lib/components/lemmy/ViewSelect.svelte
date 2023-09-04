<script lang="ts">
  import { userSettings } from '$lib/settings.js'
  import { Select } from 'mono-svelte'
  import { Icon, ViewColumns } from 'svelte-hero-icons'

  let value = `${$userSettings.showCompactPosts}`

  $: $userSettings.showCompactPosts = value == 'true'
</script>

<Select bind:value>
  <span slot="label" class="flex items-center gap-1">
    <Icon src={ViewColumns} size="14" mini />
    View
  </span>
  <option value="true">List</option>
  <option value="false">Cards</option>
</Select>
