<script lang="ts">
  import { page } from '$app/stores'
  import { profile } from '$lib/auth'
  import { userSettings } from '$lib/settings'
  import { searchParam } from '$lib/util'
  import { Select } from 'mono-svelte'
  import { GlobeAmericas, Icon } from 'svelte-hero-icons'
  import { amModOfAny } from '../moderation/moderation'
  import { t } from '$lib/translations'

  export let selected: string
  export let navigate: boolean = true
  export let changeDefault: boolean = false
  export let showLabel: boolean = true

  let feed: string = selected
  $: feed = selected
  $: changeDefault
    ? ($userSettings.defaultSort.feed = selected as
        | 'All'
        | 'Subscribed'
        | 'Local')
    : undefined
</script>

<Select
  {...$$restProps}
  bind:value={feed}
  on:change={() => {
    if (navigate) searchParam($page.url, 'type', feed, 'page', 'cursor')
  }}
>
  <svelte:fragment slot="label">
    {#if showLabel}
      <span class="flex items-center gap-1">
        <Icon src={GlobeAmericas} size="16" mini />
        {$t('filter.location.label')}
      </span>
    {/if}
  </svelte:fragment>
  <option value="All">{$t('filter.location.all')}</option>
  <option value="Local">{$t('filter.location.local')}</option>
  <option value="Subscribed" disabled={$profile?.jwt == undefined}>
    {$t('filter.location.subscribed')}
  </option>
  <option
    value="ModeratorView"
    disabled={!$profile?.jwt || !amModOfAny($profile?.user)}
  >
    {$t('filter.location.moderator')}
  </option>
</Select>
