<script lang="ts">
  interface Props {
    header: boolean
    align?: 'left' | 'center' | 'right' | 'justify' | 'char' | null | undefined
    children?: import('svelte').Snippet
  }

  let { header, align = undefined, children }: Props = $props()
</script>

{#if header}
  <th {align}>
    {@render children?.()}
  </th>
{:else}
  <td {align}>
    {@render children?.()}
  </td>
{/if}
