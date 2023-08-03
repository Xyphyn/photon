<script lang="ts">
  import Button from '$lib/components/input/Button.svelte'

  export let expanded: boolean
</script>

<Button
  class="hover:bg-slate-200 {expanded ? '' : '!p-1.5'}"
  color="tertiary"
  alignment="left"
  {...$$restProps}
>
  <slot />
</Button>
