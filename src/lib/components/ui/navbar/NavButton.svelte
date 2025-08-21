<script lang="ts">
  import { page } from '$app/state'
  import { Button } from 'mono-svelte'
  import type { ButtonProps } from 'mono-svelte/button/Button.svelte'
  import type { Snippet } from 'svelte'
  import { Icon, type IconSource } from 'svelte-hero-icons'

  interface Props extends ButtonProps {
    label: string
    icon?: IconSource | undefined
    href?: string | undefined
    adaptive?: boolean
    isSelectedFilter?: (path: string) => boolean
    class?: string
    customIcon?: Snippet<[{ size: number; isSelected?: boolean }]>
    children?: Snippet
  }

  let {
    label,
    icon,
    href,
    adaptive = true,
    isSelectedFilter = path => href != undefined && path == href,
    class: clazz = '',
    customIcon,
    children,
    ...rest
  }: Props = $props()

  let isSelected = $derived(isSelectedFilter(page.url.pathname))
</script>

<Button
  color="none"
  {...rest}
  class={[
    'shrink-0 rounded-full w-10 h-10 lg:w-max lg:h-8 lg:rounded-xl',
    !rest.color &&
      'hover:text-slate-900 dark:hover:text-zinc-50 transition-colors',
    isSelected
      ? 'text-primary-900 dark:text-primary-100 max-lg:bg-slate-100 max-lg:dark:bg-zinc-800'
      : 'text-slate-600 dark:text-zinc-400',
    clazz,
  ]}
  shadow="none"
  size="custom"
  rounding="none"
  {href}
  title={label}
  style="transition-property: background-color, filter, transform, scale;"
  aria-selected={isSelected}
>
  {#snippet prefix()}
    <div class={(icon || customIcon) && adaptive ? 'lg:hidden' : ''}>
      {#if icon}
        <Icon src={icon} size="20" mini />
      {:else}
        {@render customIcon?.({ size: 16, isSelected })}
      {/if}
    </div>
  {/snippet}
  <span class="hidden {adaptive ? 'lg:block' : ''}">{label}</span>
  {@render children?.()}
</Button>
