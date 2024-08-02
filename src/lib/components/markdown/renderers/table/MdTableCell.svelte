<script lang="ts">
  export let header: boolean
  export let align:
    | 'left'
    | 'center'
    | 'right'
    | 'justify'
    | 'char'
    | null
    | undefined = undefined
</script>

{#if header}
  <th
    class="bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 py-2 px-3"
    {align}
  >
    <slot />
  </th>
{:else}
  <td
    class="bg-slate-25 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 py-2 px-3"
    {align}
  >
    <slot />
  </td>
{/if}
