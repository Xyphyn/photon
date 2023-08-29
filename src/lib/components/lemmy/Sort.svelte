<script lang="ts">
  import { page } from '$app/stores'
  import { searchParam } from '$lib/util.js'
  import MultiSelect from '../input/MultiSelect.svelte'

  export let selected: string
  export let navigate: boolean = true
</script>

<MultiSelect
  options={[
    'Active',
    'Hot',
    'TopAll',
    'New',
    'Old',
    'TopNineMonths',
    'TopSixMonths',
    'TopThreeMonths',
    'TopMonth',
    'TopWeek',
    'TopDay',
    'TopTwelveHour',
    'TopSixHour',
    'TopHour',
    'MostComments',
    'NewComments',
  ]}
  optionNames={[
    'Active',
    'Hot',
    'Top',
    'New',
    'Old',
    'Top 9 Months',
    'Top 6 Months',
    'Top 3 Months',
    'Top Month',
    'Top Week',
    'Top Day',
    'Top 12 Hours',
    'Top 6 Hours',
    'Top Hour',
    'Most Comments',
    'New Comments',
  ]}
  bind:selected
  on:select={(e) => {
    if (navigate) searchParam($page.url, 'sort', e.detail, 'page')
  }}
  class="w-full"
/>
