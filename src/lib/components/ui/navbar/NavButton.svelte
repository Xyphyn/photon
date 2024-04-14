<script lang="ts">
  import { page } from '$app/stores'
  import { Button } from 'mono-svelte'
  import { Icon, type IconSource } from 'svelte-hero-icons'

  export let label: string
  export let icon: IconSource | undefined = undefined
  export let href: string | undefined = undefined

  $: isSelected = href != undefined && $page.url.pathname == href
</script>

<Button
  color="tertiary"
  {...$$restProps}
  class="rounded-full w-10 h-10 flex-shrink-0 {isSelected
    ? 'bg-slate-200 dark:bg-zinc-900'
    : ''} {$$props.class ?? ''}"
  size="custom"
  {href}
  rounding="pill"
  title={label}
>
  {#if icon}
    <Icon src={icon} mini={isSelected} size="18" />
  {:else}
    <slot {isSelected} name="icon" />
  {/if}
  <!-- <span class="max-md:hidden">{label}</span> -->
  <slot />
</Button>
