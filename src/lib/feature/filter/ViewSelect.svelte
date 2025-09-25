<script lang="ts">
  import { t } from '$lib/app/i18n'
  import { settings } from '$lib/settings.svelte.js'
  import { Select } from 'mono-svelte'
  import Option from 'mono-svelte/forms/select/Option.svelte'
  import type { SelectProps } from 'mono-svelte/forms/select/Select.svelte'
  import { Bars3, Icon, RectangleGroup, ViewColumns } from 'svelte-hero-icons'

  interface Props extends SelectProps<string> {
    showLabel?: boolean
  }

  let { showLabel = true, ...rest }: Props = $props()
</script>

<Select {...rest} bind:value={settings.view}>
  {#snippet customLabel()}
    {#if showLabel}
      <span class="flex items-center gap-1">
        <Icon src={ViewColumns} size="14" micro />
        {$t('filter.view.label')}
      </span>
    {/if}
  {/snippet}
  <Option value="cozy" icon={RectangleGroup}>
    {$t('filter.view.cozy')}
  </Option>
  <Option value="compact" icon={Bars3}>
    {$t('filter.view.compact')}
  </Option>
</Select>
