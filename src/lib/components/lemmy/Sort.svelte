<script lang="ts">
  import { page } from '$app/stores'
  import { searchParam } from '$lib/util.js'
  import MultiSelect from '../input/MultiSelect.svelte'

  export let selected: string
</script>

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
    'Most Comments',
    'New Comments',
  ]}
  {selected}
  on:select={(e) => searchParam($page.url, 'sort', e.detail, 'page')}
  class="w-full md:max-w-[20rem]"
/>
