<script lang="ts">
  import { page } from '$app/state'
  import { PiefedClient } from '$lib/api/piefed/adapter'
  import { type ListingType } from '$lib/api/types'
  import { profile } from '$lib/app/auth'
  import { t } from '$lib/app/i18n'
  import { searchParam } from '$lib/app/util.svelte'
  import { Option, Select } from 'mono-svelte'
  import { type SelectProps } from 'mono-svelte/forms/select/Select.svelte'
  import {
    ChartBar,
    GlobeAmericas,
    Icon,
    LightBulb,
    MapPin,
    Newspaper,
    ShieldCheck,
  } from 'svelte-hero-icons/dist'

  interface Props extends Omit<SelectProps<string>, 'onchange'> {
    selected: string
    navigate?: boolean
    changeDefault?: boolean
    showLabel?: boolean
    onchange?: (v: ListingType) => void
  }

  let { navigate = false, showLabel = true, children, onchange, ...rest }: Props = $props()

  let value = $derived(rest.selected)
</script>

<Select
  {...rest}
  bind:value
  onchange={(v) => {
    if (navigate) searchParam(page.url, 'type', v!, 'page', 'cursor')
    onchange?.(value as ListingType)
  }}
>
  {#snippet customLabel()}
    {#if showLabel}
      <span class="flex items-center gap-1">
        <Icon src={GlobeAmericas} size="16" micro />
        {$t('filter.location.label')}
      </span>
    {/if}
  {/snippet}
  <Option value="all" icon={GlobeAmericas}>
    {$t('filter.location.all')}
  </Option>
  {#if profile.client instanceof PiefedClient}
    <Option value="Popular" icon={ChartBar}>
      {$t('filter.location.popular')}
    </Option>
  {/if}
  <Option value="local" icon={MapPin}>{$t('filter.location.local')}</Option>
  <Option value="subscribed" disabled={!profile.current?.jwt} icon={Newspaper}>
    {$t('filter.location.subscribed')}
  </Option>
  <Option value="suggested" disabled={!profile.current.jwt} icon={LightBulb}>
    {$t('filter.location.suggested')}
  </Option>
  <Option value="moderator_view" disabled={!profile.isMod()} icon={ShieldCheck}>
    {$t('filter.location.moderator')}
  </Option>
  {@render children?.()}
</Select>
