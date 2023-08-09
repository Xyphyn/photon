<script lang="ts">
  import { page } from '$app/stores'
  import { searchParam } from '$lib/util.js'
  import MultiSelect from '../input/MultiSelect.svelte'

  export let selected: string
  export let navigate: boolean = true
</script>

<div class="w-full">
  <MultiSelect
    options={[
      'Active',
      'Hot',
      'TopAll',
      'New',
      'Old',
      'TopMonth',
      'TopWeek',
      'TopDay',
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
      'Top Month',
      'Top Week',
      'Top Day',
      'Top 6 Hours',
      'Top Hour',
      'Most Comments',
      'New Comments',
    ]}
    bind:selected
    on:select={(e) => {
      if (navigate) searchParam($page.url, 'sort', e.detail, 'page')
    }}
    class="w-full md:max-w-[24rem]"
  />
</div>
