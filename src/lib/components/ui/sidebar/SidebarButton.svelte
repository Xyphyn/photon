<script lang="ts">
  import { Button } from 'mono-svelte'
</script>

<Button
  {...$$restProps}
  color="tertiary"
  alignment="left"
  on:click
  class="hover:bg-slate-100 font-normal {$$props.class}"
>
  <slot />
</Button>
