<script lang="ts">
  import { page } from '$app/state'
  import { Button } from 'mono-svelte'
  import type { ButtonProps } from 'mono-svelte/button/Button.svelte'
  import { Icon, type IconSource } from 'svelte-hero-icons'

  interface Props extends ButtonProps {
    href?: string | undefined
    icon?: IconSource | undefined
    selected?: boolean
    class?: string
    customIcon?: import('svelte').Snippet<[{ selected: boolean }]>
    children?: import('svelte').Snippet
    label?: import('svelte').Snippet
  }

  let {
    href = undefined,
    icon = undefined,
    selected = $bindable(false),
    class: clazz = '',
    customIcon,
    children,
    label,
    ...rest
  }: Props = $props()

  $effect(() => {
    if (href != undefined) {
      selected = page.url.pathname == href
    }
  })
</script>

<Button
  color="none"
  alignment="left"
  rounding="pill"
  {...rest}
  {href}
  class={[
    'font-normal block',
    'hover:text-slate-900 hover:dark:text-zinc-50',
    selected
      ? 'text-slate-950 dark:text-zinc-50'
      : 'text-slate-600 dark:text-zinc-400',
    clazz,
  ]}
  shadow="none"
>
  {#snippet prefix()}
    {#if customIcon}
      {@render customIcon({ selected })}
    {:else if icon}
      <Icon src={icon} solid={selected} size="20" />
    {/if}
  {/snippet}
  {@render children?.()}
  <div class="contents">
    {@render label?.()}
  </div>
</Button>
