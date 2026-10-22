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
        border-start-start-radius: var(--radius-xl);
        border-end-start-radius: var(--radius-xl);
        border-start-end-radius: 0px;
        border-end-end-radius: 0px;
        border-inline-end: 0px;
      }

      &:last-child:not(:first-child) {
        border-start-end-radius: var(--radius-xl);
        border-end-end-radius: var(--radius-xl);
        border-start-start-radius: 0px;
        border-end-start-radius: 0px;
      }
    }
  }
</style>
