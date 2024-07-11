<script lang="ts">
  import { userSettings } from '$lib/settings.js'
  import { t } from '$lib/translations'
  import { Select } from 'mono-svelte'
  import { Icon, ViewColumns } from 'svelte-hero-icons'

  export let showLabel = true
</script>

<Select {...$$restProps} bind:value={$userSettings.view}>
  <svelte:fragment slot="label">
    {#if showLabel}
      <span class="flex items-center gap-1">
        <Icon src={ViewColumns} size="14" mini />
        {$t('filter.view.label')}
      </span>
    {/if}
  </svelte:fragment>
  <option value="cozy">{$t('filter.view.cozy')}</option>
  <option value="list">{$t('filter.view.list')}</option>
  <option value="compact">{$t('filter.view.compact')}</option>
  <option value="card">{$t('filter.view.legacy')}</option>
</Select>
