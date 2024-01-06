<script lang="ts">
  import FormattedNumber from "../util/FormattedNumber.svelte"

  export let label: string
  export let content: string
  export let formatted: boolean = false
</script>

<div class="flex flex-col {$$props.class}">
  <span class="text-slate-600 dark:text-zinc-400 text-xs">{label}</span>
  <span class="text-base">
    {#if formatted}
      <FormattedNumber number={Number(content)} />
    {:else}
      {content}
    {/if}
  </span>
</div>