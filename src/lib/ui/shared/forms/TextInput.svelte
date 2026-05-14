<script module lang="ts">
  import { Label } from 'mono-svelte'
  import { Icon, type IconSource } from 'svelte-hero-icons/dist'
  import type { HTMLInputAttributes } from 'svelte/elements'
  import { generateID } from './helper'

  export type Size = keyof typeof sizeClass
  export type Shadow = keyof typeof shadowClass

  export const sizeClass = {
    sm: 'px-3 py-1',
    md: 'px-3.5 py-1.5',
    lg: 'px-5 py-3',
  }

  export const shadowClass = {
    sm: 'shadow-xs',
    none: 'shadow-none',
  }

  interface Props extends Omit<HTMLInputAttributes, 'size' | 'prefix'> {
    label?: string | undefined
    placeholder?: string
    disabled?: boolean
    required?: boolean
    size?: Size
    id?: string
    inlineAffixes?: boolean
    shadow?: Shadow
    element?: HTMLInputElement | undefined
    class?: string
    icon?: IconSource
    customLabel?: import('svelte').Snippet
    prefix?: import('svelte').Snippet
    suffix?: import('svelte').Snippet
    children?: import('svelte').Snippet
  }

  export type { Props as TextInputProps }
</script>

<script lang="ts">
  let {
    label,
    value = $bindable(),
    placeholder = '',
    disabled = false,
    required = false,
    size = 'md',
    id = generateID(),
    icon,
    inlineAffixes = !!icon,
    shadow = 'none',
    element = $bindable(),
    class: clazz = '',
    customLabel: passedCustomLabel,
    prefix,
    suffix,
    children,
    ...rest
  }: Props = $props()
</script>

<div class={['text-input-container', clazz]}>
  {#if passedCustomLabel || label}
    <Label
      for={id}
      text={label}
      class={[
        'peer-invalid:text-red-500 relative',
        required && "after:content-['*'] after:text-red-500 after:ml-1",
      ]}
    >
      {@render passedCustomLabel?.()}
    </Label>
  {/if}
  <div
    class={[
      shadowClass[shadow],
      'text-input-sections focus-within:ring-2 ring-slate-300 dark:ring-zinc-700 transition-colors',
      clazz,
    ]}
  >
    {#if prefix || icon}
      <div
        class={[
          'rounded-xl rounded-r-none text-slate-600 dark:text-zinc-400 pl-3',
        ]}
      >
        {#if prefix}
          {@render prefix?.()}
        {:else if icon}
          <Icon src={icon} size="20" mini />
        {/if}
      </div>
    {/if}
    <input
      type="text"
      {id}
      {placeholder}
      {disabled}
      bind:value
      bind:this={element}
      {required}
      {...rest}
      class={[
        sizeClass[size],
        'text-input flex-1',
        (prefix || icon) && 'rounded-l-none',
        (prefix || icon) && inlineAffixes && 'border-l-0',
        suffix && 'rounded-r-none',
        suffix && inlineAffixes && 'border-r-0',
        clazz,
      ]}
    />
    {#if suffix}
      <div
        class={[
          'rounded-xl rounded-l-none text-slate-600 dark:text-zinc-400 h-full',
        ]}
      >
        {@render suffix?.()}
      </div>
    {/if}
  </div>
  {@render children?.()}
</div>

<style>
  @reference '../../../../app.css';

  .text-input-container {
    display: flex;
    flex-direction: column;
    gap: calc(var(--spacing) * 1);

    *:focus {
      outline: none;
    }
  }

  .text-input-sections {
    border: 1px solid var(--color-slate-200);
    border-top-color: color-mix(
      in oklab,
      var(--color-slate-200),
      var(--color-slate-300)
    );
    background: linear-gradient(
      to top,
      var(--color-white),
      var(--color-slate-100)
    );
    border-radius: var(--radius-xl);
    display: flex;
    flex-direction: row;
    align-items: center;
    font-weight: var(--text-sm);

    @variant dark {
      border-color: var(--color-zinc-800);
      border-bottom-color: var(--color-zinc-700);
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

      @variant has-invalid {
        border-color: var(--color-red-500);
      }
    }
  }

  .text-input {
    border-radius: var(--radius-xl);
    font-size: var(--text-sm);
    z-index: 10;

    @variant disabled {
      background: var(--color-slate-100);

      @variant dark {
        background: var(--color-zinc-800);
      }
    }

    @variant invalid {
      color: var(--color-red-500);
    }
  }
</style>
