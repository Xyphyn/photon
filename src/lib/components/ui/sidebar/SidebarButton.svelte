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
  color="tertiary"
  alignment="left"
  rounding="pill"
  {...rest}
  {href}
  class="font-normal block origin-left! border border-transparent dark:hover:bg-zinc-900 {!selected
    ? 'text-slate-600 dark:text-zinc-400'
    : 'bg-slate-100 dark:bg-zinc-925'} {clazz}"
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
