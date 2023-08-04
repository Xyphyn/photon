<script lang="ts">
  import Button from '$lib/components/input/Button.svelte'

  export let expanded: boolean
</script>

<Button
  {...$$restProps}
  color="tertiary"
  alignment="left"
  on:click
  class="hover:bg-slate-200 {expanded ? '' : '!p-1.5'} {$$props.class}"
>
  <slot />
</Button>
