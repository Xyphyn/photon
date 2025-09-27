<script lang="ts">
  import { CommonList } from '$lib/ui/layout'
  import { Expandable } from 'mono-svelte'

  interface Props {
    title: string
    id: string
    open?: boolean
    children?: import('svelte').Snippet
  }

  let {
    title: passedTitle,
    id,
    open = $bindable(true),
    children,
  }: Props = $props()
</script>

<Expandable bind:open class="border-y-0">
  {#snippet title()}
    <h2 class="text-lg font-medium text-inherit" {id}>
      <span>{passedTitle}</span>
    </h2>
  {/snippet}
  <CommonList>
    {@render children?.()}
  </CommonList>
</Expandable>
