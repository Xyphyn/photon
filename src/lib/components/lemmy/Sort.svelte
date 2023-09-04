<script lang="ts">
  import { page } from '$app/stores'
  import { searchParam } from '$lib/util.js'
  import { Select } from 'mono-svelte'
  import { ChartBar, Clock, Icon } from 'svelte-hero-icons'
  import { fly } from 'svelte/transition'

  export let selected: string
  export let navigate: boolean = true

  let sort: string = selected
  const setSelected = () => (selected = sort)
</script>

<div class="flex flex-row gap-4 flex-wrap">
  {#if selected?.startsWith('Top')}
    <div transition:fly={{ x: 4 }}>
      <Select
        bind:value={selected}
        on:change={(e) => {
          sort = 'TopAll'
          if (navigate) searchParam($page.url, 'sort', selected, 'page')
        }}
      >
        <span slot="label" class="flex items-center gap-1">
          <Icon src={Clock} size="16" mini />
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
  <Select
    bind:value={sort}
    on:change={(e) => {
      setSelected()
      if (navigate) searchParam($page.url, 'sort', selected, 'page')
    }}
  >
    <span slot="label" class="flex items-center gap-1">
      <Icon src={ChartBar} size="14" mini />
      Sort
    </span>
    <option value="Active">Active</option>
    <option value="Hot">Hot</option>
    <option value="TopAll">Top</option>
    <option value="New">New</option>
    <option value="Old">Old</option>
    <option value="MostComments">Most Comments</option>
    <option value="NewComments">New Comments</option>
  </Select>
</div>
