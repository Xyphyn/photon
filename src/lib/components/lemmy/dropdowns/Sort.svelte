<script lang="ts">
  import { page } from '$app/stores'
  import { site } from '$lib/lemmy.js'
  import { userSettings } from '$lib/settings'
  import { t } from '$lib/translations'
  import { searchParam } from '$lib/util.js'
  import { feature } from '$lib/version.js'
  import type { SortType } from 'lemmy-js-client'
  import { Select } from 'mono-svelte'
  import { ChartBar, Clock, Icon } from 'svelte-hero-icons'
  import { backOut } from 'svelte/easing'
  import { fly, slide } from 'svelte/transition'

  export let selected: string
  export let navigate: boolean = true
  export let changeDefault: boolean = false

  let sort: string = selected?.startsWith('Top') ? 'TopAll' : selected
  $: if (selected) {
    sort = selected?.startsWith('Top') ? 'TopAll' : selected
  }
  const setSelected = () => (selected = sort)
  $: changeDefault
    ? ($userSettings.defaultSort.sort = selected as SortType)
    : undefined
</script>

<div class="flex flex-row {$$props.class}">
  <Select
    {...$$restProps}
    class={selected?.startsWith('Top') ? 'rounded-r-none' : ''}
    bind:value={sort}
    on:change={(e) => {
      setSelected()
      if (navigate) searchParam($page.url, 'sort', selected, 'page', 'cursor')
    }}
  >
    <span slot="label" class="flex items-center gap-1">
      <Icon src={ChartBar} size="13" mini />
      {$t('filter.sort.label')}
    </span>
    <option value="Active">{$t('filter.sort.active')}</option>
    <option value="Hot">{$t('filter.sort.hot')}</option>
    {#if feature('scaledSort', $site?.version)}
      <option value="Scaled">{$t('filter.sort.scaled')}</option>
    {/if}
    <option value="TopAll">{$t('filter.sort.top.label')}</option>
    <option value="New">{$t('filter.sort.new')}</option>
    <option value="Old">{$t('filter.sort.old')}</option>
    <option value="Controversial">{$t('filter.sort.controversial')}</option>
    <option value="MostComments">{$t('filter.sort.mostcomments')}</option>
    <option value="NewComments">{$t('filter.sort.newcomments')}</option>
  </Select>
  {#if selected?.startsWith('Top')}
    <div transition:fly={{ easing: backOut, x: 2 }}>
      <Select
        class="border-l-0 rounded-l-none"
        bind:value={selected}
        on:change={(e) => {
          sort = 'TopAll'
          if (navigate)
            searchParam($page.url, 'sort', selected, 'page', 'cursor')
        }}
      >
        <span slot="label" class="flex items-center gap-1">
          <Icon src={Clock} size="15" mini />
          {$t('filter.sort.top.time.label')}
        </span>
        <option value="TopAll">{$t('filter.sort.top.time.all')}</option>
        <option value="TopNineMonths">
          {$t('filter.sort.top.time.9months')}
        </option>
        <option value="TopSixMonths">
          {$t('filter.sort.top.time.6months')}
        </option>
        <option value="TopThreeMonths">
          {$t('filter.sort.top.time.3months')}
        </option>
        <option value="TopMonth">{$t('filter.sort.top.time.month')}</option>
        <option value="TopWeek">{$t('filter.sort.top.time.week')}</option>
        <option value="TopDay">{$t('filter.sort.top.time.day')}</option>
        <option value="TopTwelveHour">
          {$t('filter.sort.top.time.12hours')}
        </option>
        <option value="TopSixHour">{$t('filter.sort.top.time.6hours')}</option>
        <option value="TopHour">{$t('filter.sort.top.time.hour')}</option>
      </Select>
    </div>
  {/if}
</div>
