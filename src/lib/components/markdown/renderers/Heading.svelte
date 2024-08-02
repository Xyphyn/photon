<script>
  import { getContext } from 'svelte'

  export let depth
  export let raw
</script>

test
{#if depth === 1}
  <h1 class="font-bold text-3xl"><slot></slot></h1>
{:else if depth === 2}
  <h2><slot></slot></h2>
{:else if depth === 3}
  <h3><slot></slot></h3>
{:else if depth === 4}
  <h4><slot></slot></h4>
{:else if depth === 5}
  <h5><slot></slot></h5>
{:else if depth === 6}
  <h6><slot></slot></h6>
{:else}
  {raw}
{/if}
