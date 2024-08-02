<script lang="ts">
  export let ordered: boolean
  export let start: number
</script>

{#if ordered}
  <ol
    {start}
    class="pl-5 list-decimal *:marker:font-medium *:marker:text-primary-900 *:marker:dark:text-primary-100"
  >
    <slot />
  </ol>
{:else}
  <ul
    class="list-disc pl-4 *:marker:text-primary-900 *:marker:dark:text-primary-100"
  >
    <slot />
  </ul>
{/if}
