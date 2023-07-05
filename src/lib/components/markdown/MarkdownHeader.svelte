<script lang="ts">
  export let depth: Number
</script>

{#if depth == 1}
  <h1 class="font-bold text-3xl"><slot /></h1>
{:else if depth == 2}
  <h2 class="font-bold text-2xl"><slot /></h2>
{:else if depth == 3}
  <h3 class="font-bold text-xl"><slot /></h3>
{:else if depth == 4}
  <h4 class="font-bold text-lg"><slot /></h4>
{:else if depth == 5}
  <h5 class="font-bold text-base"><slot /></h5>
{:else if depth == 6}
  <h6 class="font-bold text-sm"><slot /></h6>
{:else}
  <slot />
{/if}
