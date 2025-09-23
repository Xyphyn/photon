<script lang="ts">
  import Expandable from '$comp/ui/Expandable.svelte'
  import CommonList from '$comp/ui/layout/CommonList.svelte'

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
