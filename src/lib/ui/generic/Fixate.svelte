<script lang="ts">
  import type { Snippet } from 'svelte'

  const placements = {
    top: 'placement-top',
    bottom: 'placement-bottom',
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

<style>
  @reference '../../../app.css';

  .placement-bottom {
    bottom: calc(calc(var(--spacing) * 22) + env(safe-area-inset-bottom, 0px));
    padding-top: calc(var(--spacing) * 6);
    margin-top: auto;

    @variant lg {
      bottom: calc(var(--spacing) * 6);
    }
  }

  .placement-top {
    top: calc(calc(var(--spacing) * 6) + env(safe-area-inset-top, 0px));

    @variant lg {
      top: calc(var(--spacing) * 22);
    }
  }
</style>
