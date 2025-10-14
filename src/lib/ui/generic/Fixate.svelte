<script lang="ts">
  import type { Snippet } from 'svelte'

  const placements = {
    top: 'top-6 lg:top-22',
    bottom: 'bottom-22 lg:bottom-6 pt-6 mt-auto',
  }

  interface Props {
    placement: keyof typeof placements
    children?: Snippet
  }

  let { placement, children }: Props = $props()
</script>

<div
  class={[
    'sticky z-30 mb-0 pointer-events-none *:pointer-events-auto',
    placements[placement],
  ]}
>
  {@render children?.()}
</div>
