<script lang="ts">
  import { generateID } from '../forms/helper.js'

  export let group: string = generateID()
  export let row: boolean = true
</script>

<div class="flex flex-col gap-1 max-w-full">
  <div
    class="flex {row
      ? 'flex-row flex-wrap'
      : 'flex-col'} gap-4 {$$props.class || ''}"
  >
    <slot {group} />
  </div>
</div>
