<script lang="ts">
  import { userSettings } from '$lib/settings.js'
  import { Select } from 'mono-svelte'
  import { Icon, ViewColumns } from 'svelte-hero-icons'
</script>

<Select bind:value={$userSettings.view}>
  <span slot="label" class="flex items-center gap-1">
    <Icon src={ViewColumns} size="14" mini />
    View
  </span>
  <option value="list">List</option>
  <option value="card">Cards</option>
  <option value="compact">Compact</option>
</Select>
