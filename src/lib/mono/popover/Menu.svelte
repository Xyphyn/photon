<script lang="ts">
  import {
    flip,
    offset,
    shift,
    type Middleware,
    type Placement,
    type Strategy,
  } from '@floating-ui/core'
  import Popover from '../popover/Popover.svelte'

  interface Props {
    openOnHover?: boolean
    open?: boolean
    manual?: boolean
    placement?: Placement
    middleware?: Middleware[]
    strategy?: Strategy
    class?: string
    target?: import('svelte').Snippet
    children?: import('svelte').Snippet<[boolean]>
  }

  let {
    openOnHover = false,
    open = $bindable(false),
    manual = false,
    placement = 'bottom-start',
    middleware = [offset(6), shift({ padding: 6 }), flip()],
    strategy = 'absolute',
    class: clazz = '',
    target,
    children,
    ...rest
  }: Props = $props()
</script>

<Popover
  {openOnHover}
  {placement}
  {middleware}
  {strategy}
  {manual}
  {...rest}
  bind:open
  popoverClass="backdrop-blur-xl rounded-2xl w-full max-w-[280px]"
  class={clazz}
  {target}
>
  {#snippet popover()}
    <div
      class="w-full max-w-[280px] origin-top-left
  	max-h-128 overflow-auto list-none shadow-lg rounded-2xl"
    >
      <div
        class="flex flex-col py-2 list-none bg-white/80 dark:bg-zinc-900/90 px-2 gap-px
        rounded-2xl
        border border-slate-300 dark:border-zinc-800 border-opacity-50"
      >
        {@render children?.(open)}
      </div>
    </div>
  {/snippet}
</Popover>
