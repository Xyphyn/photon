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
  import type { Snippet } from 'svelte'
  import type { Attachment } from 'svelte/attachments'

  interface Props {
    openOnHover?: boolean
    open?: boolean
    placement?: Placement
    middleware?: Middleware[]
    strategy?: Strategy
    class?: string
    target?: Snippet<[Attachment]>
    children?: import('svelte').Snippet<[boolean]>
  }

  let {
    openOnHover = false,
    open = $bindable(false),
    placement = 'bottom-start',
    middleware = [offset(6), shift({ padding: 6 }), flip()],
    strategy = 'absolute',
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
  {target}
  {...rest}
  bind:open
  popoverClass="rounded-xl w-full backdrop-blur-md max-w-72"
>
  {#snippet popover()}
    <div
      class="w-full max-w-sm max-h-128 overflow-auto list-none shadow-lg rounded-xl"
    >
      <div
        class="flex flex-col p-1 list-none bg-white/80 dark:bg-zinc-900/90 rounded-xl
        border border-slate-200 dark:border-zinc-800 gap-px"
        role="menu"
      >
        {@render children?.(open)}
      </div>
    </div>
  {/snippet}
</Popover>
