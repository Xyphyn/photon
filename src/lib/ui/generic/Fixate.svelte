<script lang="ts">
  import type { Snippet } from 'svelte'

  const placements = {
    top: 'top-6 lg:top-22',
    bottom: 'bottom-22 lg:bottom-6 mt-6',
  }

  interface Props {
    placement: keyof typeof placements
    children?: Snippet
  }

  let { placement, children }: Props = $props()
</script>

<div class={['sticky z-30 mb-0', placements[placement]]}>
  {@render children?.()}
</div>
