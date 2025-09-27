<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { ClassValue } from 'svelte/elements'

  interface Props {
    open?: boolean
    class?: ClassValue
    summary?: Snippet<[{ open: boolean }]>
    extended?: Snippet
    children?: Snippet<[{ open: boolean }]>
  }

  let {
    open = $bindable(false),
    class: clazz = '',
    summary,
    extended,
    children,
    ...rest
  }: Props = $props()

  const id = $props.id()
</script>

<div {...rest} class={['w-full', clazz]}>
  <label for={id} class="w-full">
    {@render summary?.({ open })}
  </label>
  {@render extended?.()}
  <input {id} class="hidden input" type="checkbox" bind:checked={open} />
  <div class="expand">
    {@render children?.({ open })}
  </div>
</div>

<style>
  .expand {
    display: grid;
    grid-template-rows: 0fr;
    grid-template-columns: 100%;
    overflow: hidden;
    transition: grid-template-rows 0.5s cubic-bezier(0.19, 1, 0.22, 1);
  }

  .input:checked + .expand {
    grid-template-rows: 1fr;
  }

  .expand > :global(*) {
    min-height: 0;
  }
</style>
