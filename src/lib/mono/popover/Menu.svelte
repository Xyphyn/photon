<script lang="ts">
  import Material from '../materials/Material.svelte'
  import Popover, { type Origin } from '../popover/Popover.svelte'
  import {
    offset,
    type Middleware,
    type Placement,
    shift,
    type Strategy,
    flip,
    autoPlacement,
    size,
  } from '@floating-ui/core'

  export let openOnHover: boolean = false
  export let open: boolean = false

  export let placement: Placement = 'bottom-start'
  export let middleware: Middleware[] = [
    offset(6),
    shift({ padding: 6 }),
    flip(),
  ]
  export let strategy: Strategy = 'absolute'
</script>

<Popover
  {openOnHover}
  {placement}
  {middleware}
  {strategy}
  {...$$restProps}
  bind:open
  popoverClass="backdrop-blur-xl rounded-xl w-full max-w-[280px]"
  class={$$props.class}
>
  <slot name="target" slot="target" />
  <div
    slot="popover"
    class="w-full max-w-[280px] origin-top-left
	max-h-[32rem] overflow-auto list-none shadow-lg rounded-xl"
  >
    <Material
      class="flex flex-col py-2 list-none bg-white/80 dark:bg-zinc-900/80 px-2 gap-px"
      color="distinct"
      padding="none"
      rounding="xl"
    >
      <slot />
    </Material>
  </div>
</Popover>
