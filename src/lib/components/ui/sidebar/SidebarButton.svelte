<script lang="ts">
  import { page } from '$app/state'
  import { Button } from 'mono-svelte'
  import type { ButtonProps } from 'mono-svelte/button/Button.svelte'
  import { Icon, type IconSource } from 'svelte-hero-icons'

  interface Props extends ButtonProps {
    href?: string | undefined
    icon?: IconSource | undefined
    class?: string
    label?: string
    customIcon?: import('svelte').Snippet<[{ selected: boolean }]>
    children?: import('svelte').Snippet
  }

  let {
    href = undefined,
    icon = undefined,
    class: clazz = '',
    customIcon,
    children,
    label,
    ...rest
  }: Props = $props()

  let selected = $derived(page.url.pathname == href)
</script>

<Button
  color="tertiary"
  alignment="left"
  rounding="xl"
  {...rest}
  {href}
  class={[
    'font-normal block',
    'hover:text-slate-900 hover:dark:text-zinc-50',
    selected
      ? 'text-primary-900 dark:text-primary-100'
      : 'text-slate-600 dark:text-zinc-400',
    clazz,
  ]}
  shadow="none"
>
  {#snippet prefix()}
    {#if customIcon}
      {@render customIcon({ selected })}
    {:else if icon}
      <Icon src={icon} mini size="18" />
    {/if}
  {/snippet}
  {label}
  {@render children?.()}
</Button>
