<script module lang="ts">
  import { Label } from 'mono-svelte'
  import type { ClassValue, HTMLTextareaAttributes } from 'svelte/elements'
  import { generateID } from './helper'

  export type Size = keyof typeof sizeClass

  export const sizeClass = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-5',
  }

  interface Props extends HTMLTextareaAttributes {
    label?: string | undefined
    value?: string
    placeholder?: string
    disabled?: boolean
    required?: boolean
    size?: Size
    id?: string
    rows?: number
    element?: HTMLTextAreaElement | undefined
    unstyled?: boolean
    class?: ClassValue
    customLabel?: import('svelte').Snippet
    suffix?: import('svelte').Snippet
    children?: import('svelte').Snippet
  }

  export type { Props as TextAreaProps }
</script>

<script lang="ts">
  const borderClass = `
	border border-slate-200 dark:border-zinc-800
	`

  let {
    label = undefined,
    value = $bindable(),
    placeholder = '',
    disabled = false,
    required = false,
    size = 'md',
    id = generateID(),
    rows = 4,
    element = $bindable(),
    unstyled = false,
    class: clazz = '',
    customLabel,
    suffix,
    children,
    ...rest
  }: Props = $props()
</script>

<div class="flex flex-col gap-1 {clazz}">
  {#if customLabel || label}
    <Label
      for={id}
      text={label}
      class="peer-invalid:text-red-500 {required
        ? "after:content-['*'] after:text-red-500 after:ml-1"
        : ''}"
    >
      {@render customLabel?.()}
    </Label>
  {/if}
  <div class={[!unstyled && 'text-area-container', clazz]}>
    <textarea
      {id}
      {placeholder}
      {disabled}
      {rows}
      bind:value
      bind:this={element}
      {...rest}
      class={[
        sizeClass[size],
        'text-area transition-all peer',
        !unstyled && borderClass,
        !unstyled && 'focus:ring-2 ring-slate-800/50 dark:ring-zinc-200/50',
        suffix && 'rounded-b-none border-b-0',
        clazz,
      ]}
    ></textarea>
    {#if suffix}
      <div
        class="{borderClass} {sizeClass[
          size
        ]} w-full border-t-0 rounded-xl rounded-t-none
      flex items-center"
      >
        {@render suffix?.()}
      </div>
    {/if}
  </div>
  {@render children?.()}
</div>

<style>
  @reference '../../../../app.css';
  .text-area-container {
    border-radius: var(--radius-xl);
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: var(--text-sm);

    background: linear-gradient(
      to top,
      var(--color-white),
      var(--color-slate-100)
    );

    @variant dark {
      background: linear-gradient(
        to bottom,
        var(--color-zinc-900),
        color-mix(
          in oklab,
          var(--color-zinc-800) 50%,
          var(--color-zinc-900) 50%
        )
      );
    }

    @variant focus-within {
      border-color: var(--color-primary-900);

      @variant dark {
        border-color: var(--color-primary-100);
      }
    }
  }

  .text-area {
    border-radius: inherit;
    width: 100%;

    @variant focus {
      outline: none;
    }

    @variant disabled {
      cursor: not-allowed;
      background-color: var(--color-slate-100);

      @variant dark {
        background: var(--color-zinc-900);
      }
    }
  }
</style>
