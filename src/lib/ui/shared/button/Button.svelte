<script module lang="ts">
  import { Spinner } from 'mono-svelte'
  import type { Snippet } from 'svelte'
  import { type IconSource, Icon } from 'svelte-hero-icons/dist'
  import type {
    ClassValue,
    HTMLAnchorAttributes,
    HTMLButtonAttributes,
  } from 'svelte/elements'

  export type ButtonColor = keyof typeof buttonColor
  export type ButtonAlignment = keyof typeof buttonAlignment
  export type ButtonShadow = keyof typeof buttonShadow

  export const buttonAlignment = {
    left: 'justify-start text-left origin-left',
    center: 'justify-center',
    right: 'justify-end text-right origin-right',
  }

  export const buttonColor = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    tertiary: 'btn-tertiary',
    danger: 'btn-danger',
    ghost: 'btn-ghost',
    'danger-subtle': 'text-red-500 hover:bg-red-500 hover:text-inherit!',
    'success-subtle': 'text-green-500 hover:bg-green-500 hover:text-inherit!',
    'warning-subtle': 'text-yellow-500 hover:bg-yellow-500 hover:text-inherit!',
    'blue-subtle': `text-blue-500 hover:bg-blue-500 hover:text-inherit!`,

    none: '',
  }

  export const buttonShadow = {
    sm: 'shadow-xs',
    none: 'shadow-none',
  }

  export type ButtonSize = keyof typeof buttonSize

  export const buttonSize = {
    xs: 'btn-xs',
    sm: 'btn-sm',
    md: 'btn-md',
    lg: 'btn-lg',
    xl: 'btn-xl',
    'square-sm': 'btn-square-sm',
    'square-md': 'btn-square-md',
    'square-lg': 'btn-square-lg',
    'square-xl': 'btn-square-xl',
    custom: '',
  }

  const buttonRounding = {
    pill: 'rounded-full',
    '2xl': 'rounded-2xl',
    xl: 'rounded-xl',
    lg: 'rounded-lg',
    md: 'rounded-md',
    none: '',
  }
  type ButtonRoundness = keyof typeof buttonRounding

  const buttonWeight = {
    md: 'font-medium',
    none: '',
  }
  type ButtonWeight = keyof typeof buttonWeight

  interface Props
    extends Omit<HTMLButtonAttributes | HTMLAnchorAttributes, 'prefix'> {
    loading?: boolean
    submit?: boolean
    type?: 'button' | 'none'
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
    icon?: IconSource
    weight?: ButtonWeight
  }

  export type { Props as ButtonProps }
</script>

<script lang="ts">
  let {
    loading = false,
    submit = false,
    type = 'button',
    color = 'secondary',
    size = 'md',
    rounding = size == 'lg' || size == 'square-lg' ? '2xl' : 'xl',
    alignment = 'center',
    shadow = color == 'primary' || color == 'secondary' ? 'sm' : 'none',
    disabled,
    loaderWidth = undefined,
    href = undefined,
    class: clazz = '',
    prefix,
    children,
    suffix,
    icon,
    weight = 'md',
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
    type == 'button' && 'btn',
    buttonSize[size],
    buttonRounding[rounding],
    buttonShadow[shadow],
    buttonColor[color],
    buttonAlignment[alignment],
    buttonWeight[weight],
    (disabled || loading) && 'btn-disabled',
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
  {:else if icon}
    <Icon
      src={icon}
      size="16"
      mini
      class={[color == 'secondary' && 'text-slate-600 dark:text-zinc-400']}
    />
  {/if}
  {@render children?.()}
  {@render suffix?.()}
</svelte:element>

<!--
  @component

  @slot `prefix` -- Will be replaced if `loading` is `true`.
  @slot `suffix`
-->

<style>
  @reference "../../../../app.css";

  :global {
    .btn {
      display: flex;
      flex-direction: row;
      align-items: center;
      font-size: var(--text-sm);
      gap: calc(var(--spacing) * 1.5);

      transition: 75ms cubic-bezier(0.075, 0.82, 0.165, 1);

      @variant hover {
        cursor: pointer;
      }
    }

    .no-hover:hover {
      cursor: normal !important;
    }

    .btn-primary {
      border: 1px solid transparent;
      background: radial-gradient(
        circle at 20% 0%,
        var(--color-primary-800),
        var(--color-primary-900)
      );
      background-size: 110% 110% !important;
      color: var(--color-slate-50);

      @variant dark {
        background: radial-gradient(
          circle at center right,
          var(--color-primary-200),
          var(--color-primary-100)
        );
        color: var(--color-zinc-900);
      }

      @variant hover {
        filter: brightness(120%);
        @variant dark {
          filter: brightness(90%);
        }
      }
    }

    .btn-secondary {
      border: 1px solid var(--color-slate-200);
      border-bottom-color: var(--color-slate-300);
      background-color: var(--color-white);

      @variant dark {
        border: 1px solid var(--color-zinc-800);
        background-color: var(--color-zinc-900);
      }

      @variant hover {
        background-color: color-mix(
          in oklab,
          var(--color-white),
          var(--color-slate-50)
        );
        @variant dark {
          background-color: color-mix(
            in oklab,
            var(--color-zinc-925),
            var(--color-zinc-900)
          );
        }
      }
    }

    .btn-tertiary {
      background-color: transparent;
      @variant hover {
        background-color: --alpha(var(--color-slate-200) / 50%);
        @variant dark {
          background-color: --alpha(var(--color-zinc-700) / 30%);
        }
      }
    }

    .btn-danger {
      /*  border border-red-500 bg-red-500 hover:text-red-500 hover:bg-transparent text-white */

      background-color: var(--color-red-600);
      color: var(--color-white);

      @variant dark {
        background-color: var(--color-red-400);
        color: var(--color-black);
      }

      @variant hover {
        filter: brightness(120%);
        @variant dark {
          filter: brightness(90%);
        }
      }
    }

    .btn-ghost {
      border: 1px solid var(--color-slate-200);

      @variant hover {
        background-color: var(--color-slate-100);
      }

      @variant dark {
        border-color: var(--color-zinc-800);
        @variant hover {
          background-color: var(--color-zinc-800);
          border-color: var(--color-zinc-700);
          color: var(--color-zinc-200);
        }
      }
    }

    .btn-xs {
      padding: calc(var(--spacing) * 1) calc(var(--spacing) * 2);
      font-size: var(--text-xs);
    }

    .btn-sm {
      padding: calc(var(--spacing) * 1.5) calc(var(--spacing) * 3);
      font-size: 12px;
    }

    .btn-md {
      padding-block: calc(var(--spacing) * 1.5);
      padding-inline: calc(var(--spacing) * 3);
      font-size: var(--text-sm);
    }

    .btn-lg {
      padding-block: calc(var(--spacing) * 2);
      padding-inline: calc(var(--spacing) * 5);
      font-size: var(--text-sm);
    }

    .btn-xl {
      padding: calc(var(--spacing) * 3) calc(var(--spacing) * 6);
      font-size: var(--text-base);
    }

    .btn-square-sm {
      width: calc(var(--spacing) * 6);
      height: calc(var(--spacing) * 6);
    }

    .btn-square-md {
      width: calc(var(--spacing) * 8);
      height: calc(var(--spacing) * 8);
    }

    .btn-square-lg {
      width: calc(var(--spacing) * 9.5);
      height: calc(var(--spacing) * 9.5);
    }

    .btn-square-xl {
      width: calc(var(--spacing) * 12);
      height: calc(var(--spacing) * 12);
    }

    .btn-disabled {
      pointer-events: none;
      opacity: 0.6;
      cursor: normal;

      @variant dark {
        opacity: 0.5;
      }
    }
  }
</style>
