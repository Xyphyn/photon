<script module lang="ts">
  export type ButtonColor = keyof typeof buttonColor
  export type ButtonAlignment = keyof typeof buttonAlignment
  export type ButtonShadow = keyof typeof buttonShadow

  export const buttonAlignment = {
    left: 'justify-start text-left origin-left',
    center: 'justify-center',
    right: 'justify-end text-right origin-right',
  }

  export const buttonColor = {
    primary: `border border-transparent bg-primary-900 text-slate-50 dark:bg-primary-100 dark:text-black`,
    secondary: `border border-slate-200 border-b-slate-300 dark:border-zinc-800 bg-white dark:bg-zinc-900`,
    tertiary:
      ' bg-transparent hover:bg-slate-200/50 dark:hover:bg-zinc-700/30 dark:text-zinc-200',

    danger:
      'border border-red-500 bg-red-500 hover:text-red-500 hover:bg-transparent text-white',
    'danger-subtle': 'text-red-500 hover:bg-red-500 hover:text-inherit!',
    'success-subtle': 'text-green-500 hover:bg-green-500 hover:text-inherit!',
    'warning-subtle': 'text-yellow-500 hover:bg-yellow-500 hover:text-inherit!',
    ghost: `border border-slate-200 dark:border-zinc-800 bg-transparent
		hover:bg-slate-100 dark:hover:bg-zinc-800 dark:hover:border-zinc-700 dark:text-zinc-400 hover:text-inherit
		dark:hover:text-inherit`,
    'blue-subtle': `text-blue-500 hover:bg-blue-500 hover:text-inherit!`,

    none: '',
  }

  export const buttonShadow = {
    sm: 'shadow-xs',
    none: 'shadow-none',
  }

  export type ButtonSize = keyof typeof buttonSize

  export const buttonSize = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-[12px]',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-sm',
    xl: 'px-6 py-3 text-base',
    'square-sm': 'w-6 h-6',
    'square-md': 'w-8 h-8',
    'square-lg': 'w-10 h-10',
    'square-xl': 'w-12 h-12',
    custom: '',
  }

  const buttonRounding = {
    pill: 'rounded-full',
    xl: 'rounded-xl',
    lg: 'rounded-lg',
    md: 'rounded-md',
    none: '',
  }
  type ButtonRoundness = keyof typeof buttonRounding

  interface Props
    extends Omit<HTMLButtonAttributes | HTMLAnchorAttributes, 'prefix'> {
    loading?: boolean
    submit?: boolean
    color?: ButtonColor
    size?: ButtonSize
    rounding?: ButtonRoundness
    alignment?: ButtonAlignment
    shadow?: ButtonShadow
    loaderWidth?: number | undefined
    href?: string | undefined
    class?: ClassValue
    prefix?: Snippet
    children?: Snippet
    suffix?: Snippet
    onclick?: HTMLButtonAttributes['onclick']
  }

  export type { Props as ButtonProps }
</script>

<script lang="ts">
  import type {
    ClassValue,
    HTMLAnchorAttributes,
    HTMLButtonAttributes,
  } from 'svelte/elements'

  import Spinner from '../loader/Spinner.svelte'
  import type { Snippet } from 'svelte'

  let {
    loading = false,
    submit = false,
    color = 'secondary',
    size = 'md',
    rounding = size == 'lg' ? 'xl' : 'lg',
    alignment = 'center',
    shadow = color != 'tertiary' ? 'none' : 'none',
    disabled,
    loaderWidth = undefined,
    href = undefined,
    class: clazz = '',
    prefix,
    children,
    suffix,
    ...rest
  }: Props = $props()
</script>

<svelte:element
  this={href ? 'a' : 'button'}
  role={href ? 'link' : 'button'}
  {href}
  {...rest}
  tabindex={disabled ? -1 : undefined}
  class={[
    buttonSize[size],
    buttonRounding[rounding],
    buttonShadow[shadow],
    buttonColor[color],
    buttonAlignment[alignment],
    'transition-all font-medium cursor-pointer disabled:opacity-50 disabled:pointer-events-none',
    'hover:brightness-98 hover:dark:brightness-95 active:brightness-90 active:dark:brightness-85 text-sm',
    'flex flex-row items-center gap-1.5',
    (disabled || loading) && 'pointer-events-none opacity-50 shadow-none',
    alignment == 'center'
      ? 'origin-center'
      : alignment == 'left'
        ? 'origin-left'
        : 'origin-right',
    clazz,
  ]}
  type={submit ? 'submit' : 'button'}
>
  {#if loading}
    <Spinner width={loaderWidth ?? 16} />
  {:else if prefix}
    {@render prefix?.()}
  {/if}
  {@render children?.()}
  {@render suffix?.()}
</svelte:element>

<!--
  @component

  @slot `prefix` -- Will be replaced if `loading` is `true`.
  @slot `suffix`
-->
