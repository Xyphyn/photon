<script lang="ts">
  import type { Snippet } from 'svelte'

  interface Props {
    orientation: 'horizontal'
    class?: string
    children?: Snippet
  }

  let {
    orientation = 'horizontal',
    children,
    class: clazz,
    ...rest
  }: Props = $props()
</script>

<div
  {...rest}
  role="group"
  class={[
    'btn-group',
    orientation == 'horizontal' ? 'btn-group-horizontal' : 'btn-group-vertical',
    clazz,
  ]}
>
  {@render children?.()}
</div>

<style>
  .btn-group {
    flex-shrink: 0;
  }

  .btn-group.btn-group-horizontal {
    flex-direction: row;
  }

  .btn-group.btn-group-horizontal :global {
    & > button,
    & > a {
      position: relative;

      &:not(:first-child):not(:last-child) {
        border-radius: 0px !important;
      }

      &:first-child:not(:last-child) {
        border-radius: var(--radius-xl) 0px 0px var(--radius-xl) !important;
        border-right: 0px;
      }

      &:last-child:not(:first-child) {
        border-radius: 0px var(--radius-xl) var(--radius-xl) 0px !important;
      }
    }
  }
</style>
