<script lang="ts">
  import FormattedNumber from '../util/FormattedNumber.svelte'

  export let label: string
  export let content: string
  export let formatted: boolean = false

  export let labelClass: string = ''
  export let contentClass: string = ''
  let clazz: string = ''
  export { clazz as class }
</script>

<div class="flex flex-col {clazz}">
  <span class="text-slate-600 dark:text-zinc-400 text-xs {labelClass}">
    {label}
  </span>
  <span class="text-base {contentClass}">
    {#if formatted}
      <FormattedNumber number={Number(content)} />
    {:else}
      {content}
    {/if}
  </span>
</div>
