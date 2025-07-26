<script lang="ts">
  import Expandable from '$lib/components/ui/Expandable.svelte'
  import CommonList from '$lib/components/ui/layout/CommonList.svelte'

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

<Expandable bind:open>
  {#snippet title()}
    <h2 class="text-xl font-semibold text-inherit" {id}>
      <span>{passedTitle}</span>
    </h2>
  {/snippet}
  <CommonList>
    {@render children?.()}
  </CommonList>
</Expandable>
