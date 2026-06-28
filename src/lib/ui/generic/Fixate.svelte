<script lang="ts">
  import type { Snippet } from 'svelte'

  const placements = {
    top: 'top-6 md:top-22',
    bottom: 'bottom-0 pb-22 md:pb-6 pt-6 mt-auto',
  }

  interface Props {
    placement: keyof typeof placements
    styling?: boolean
    children?: Snippet
  }

  let { placement, styling = true, children }: Props = $props()
</script>

<div
  class={[
    'sticky z-30 bottom-0 -mb-6 pointer-events-none *:pointer-events-auto',
    styling &&
      'bg-linear-to-b from-slate-25/0 to-slate-25 dark:from-zinc-925/0 dark:to-zinc-925 w-full',
    placements[placement],
  ]}
>
  {@render children?.()}
</div>
