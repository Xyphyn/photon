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
    gap: var(--spacing);
    flex-shrink: 0;
  }

  .btn-group.btn-group-horizontal {
    flex-direction: row;
  }

  .btn-group.btn-group-horizontal :global(> *) {
    position: relative;
    border-radius: 8px 8px 8px 8px !important;

    &:first-child {
      border-radius: 24px 12px 12px 24px !important;
    }

    &:last-child {
      border-radius: 12px 24px 24px 12px !important;
    }
  }
</style>
