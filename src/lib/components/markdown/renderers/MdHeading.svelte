<script lang="ts">
  export let depth: number = 0
  export let raw: string | undefined = undefined
</script>

{#if depth === 1}
  <h1 class="font-bold text-4xl"><slot></slot></h1>
{:else if depth === 2}
  <h2 class="font-bold text-3xl"><slot></slot></h2>
{:else if depth === 3}
  <h3 class="font-bold text-2xl"><slot></slot></h3>
{:else if depth === 4}
  <h4 class="font-semibold text-xl"><slot></slot></h4>
{:else if depth === 5}
  <h5 class="font-semibold text-lg"><slot></slot></h5>
{:else if depth === 6}
  <h6 class="font-semibold text-base"><slot></slot></h6>
{:else}
  {raw}
{/if}
