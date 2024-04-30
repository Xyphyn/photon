<script lang="ts">
  import { userSettings } from '$lib/settings.js'
  import { Select } from 'mono-svelte'
  import { Icon, ViewColumns } from 'svelte-hero-icons'

  export let showLabel = true
</script>

<Select {...$$restProps} bind:value={$userSettings.view}>
  <svelte:fragment slot="label">
    {#if showLabel}
      <span class="flex items-center gap-1">
        <Icon src={ViewColumns} size="14" mini />
        View
      </span>
    {/if}
  </svelte:fragment>
  <option value="cozy">Cozy</option>
  <option value="list">List</option>
  <option value="compact">Compact</option>
  <option value="card">Legacy</option>
</Select>
