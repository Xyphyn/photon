<script lang="ts">
  import { page } from '$app/stores'
  import { site } from '$lib/lemmy.js'
  import { userSettings } from '$lib/settings'
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

  let sort: string = selected.startsWith('Top') ? 'TopAll' : selected
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
      Sort
    </span>
    <option value="Active">Active</option>
    <option value="Hot">Hot</option>
    {#if feature('scaledSort', $site?.version)}
      <option value="Scaled">Scaled</option>
    {/if}
    <option value="TopAll">Top</option>
    <option value="New">New</option>
    {#if feature('controversialSort', $site?.version)}
      <option value="Controversial">Controversial</option>
    {/if}
    <option value="Old">Old</option>
    <option value="MostComments">Comments</option>
    <option value="NewComments">New Replies</option>
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
          Time
        </span>
        <option value="TopAll">All</option>
        <option value="TopNineMonths">9 Months</option>
        <option value="TopSixMonths">6 Months</option>
        <option value="TopThreeMonths">3 Months</option>
        <option value="TopMonth">Month</option>
        <option value="TopWeek">Week</option>
        <option value="TopDay">Day</option>
        <option value="TopTwelveHour">12 Hours</option>
        <option value="TopSixHour">6 Hours</option>
        <option value="TopHour">Hour</option>
      </Select>
    </div>
  {/if}
</div>
