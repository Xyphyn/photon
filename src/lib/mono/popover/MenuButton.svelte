<script lang="ts">
  import type { Snippet } from 'svelte'
  import Button, {
    type ButtonAlignment,
    type ButtonColor,
    type ButtonProps,
  } from '../button/Button.svelte'
  import { Icon, type IconSource } from 'svelte-hero-icons'

  interface Props extends ButtonProps {
    color?: ButtonColor
    alignment?: ButtonAlignment
    href?: string | undefined
    disabled?: boolean
    class?: string
    icon?: IconSource
    prefix?: Snippet
    children?: Snippet
    suffix?: Snippet
  }

  let {
    color = 'tertiary',
    alignment = 'left',
    href = undefined,
    disabled = false,
    class: clazz = '',
    icon,
    prefix: passedPrefix,
    children,
    suffix: passedSuffix,
    ...rest
  }: Props = $props()
</script>

<Button
  {...rest}
  {color}
  rounding="none"
  class="w-full px-2 rounded-lg min-h-8 font-normal {disabled
    ? 'opacity-70 pointer-events-none cursor-not-allowed'
    : ''} {color == 'tertiary'
    ? 'dark:hover:bg-zinc-800/70'
    : ''} duration-100 {clazz}"
  {alignment}
  {href}
  {disabled}
>
  {#snippet prefix()}
    <div
      class="contents {color == 'tertiary'
        ? 'text-slate-600 dark:text-zinc-400'
        : ''}
  		shrink-0"
    >
      {#if icon}
        <Icon src={icon} micro size="16" />
      {:else}
        {@render passedPrefix?.()}
      {/if}
    </div>
  {/snippet}
  {@render children?.()}
  {#snippet suffix()}
    {@render passedSuffix?.()}
  {/snippet}
</Button>
