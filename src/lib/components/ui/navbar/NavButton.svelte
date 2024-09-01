<script lang="ts">
  import { page } from '$app/stores'
  import { Button } from 'mono-svelte'
  import { Icon, type IconSource } from 'svelte-hero-icons'
  import { dockProps } from '../layout/Shell.svelte'

  export let label: string
  export let icon: IconSource | undefined = undefined
  export let href: string | undefined = undefined

  export let adaptive: boolean = true

  export let isSelectedFilter: (path: string) => boolean = (path) =>
    href != undefined && path == href

  $: isSelected = isSelectedFilter($page.url.pathname)
  $: isPanel = adaptive ? $dockProps.noGap : false
</script>

<Button
  color={isPanel ? 'tertiary' : 'tertiary'}
  {...$$restProps}
  on:click
  on:contextmenu
  class="rounded-full w-10 h-10 flex-shrink-0 {adaptive
    ? '@3xl:h-8 @3xl:px-3 @3xl:rounded-[10px] @3xl:w-auto'
    : ''} {isSelected
    ? 'bg-slate-200 dark:bg-zinc-900 text-primary-900 dark:!text-primary-100'
    : ''} {$$props.class ?? ''}"
  size="custom"
  {href}
  rounding="pill"
  title={label}
  style="transition-property: background-color, filter;"
>
  {#if icon}
    <Icon
      src={icon}
      micro={isPanel}
      solid={!isPanel && isSelected}
      size={isPanel ? '16' : '18'}
    />
  {:else}
    <slot size={isPanel ? 16 : 18} {isSelected} name="icon" />
  {/if}
  <span class="hidden {adaptive ? '@3xl:block' : ''}">{label}</span>
  <slot />
</Button>
