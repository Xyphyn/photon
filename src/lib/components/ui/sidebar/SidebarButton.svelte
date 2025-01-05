<script lang="ts">
  import { page } from '$app/stores'
  import { userSettings } from '$lib/settings.js'
  import { Button } from 'mono-svelte'
  import { Icon, type IconSource } from 'svelte-hero-icons'

  export let href: string | undefined = undefined
  export let icon: IconSource | undefined = undefined
  export let selected = false
  
  $: {
    if (href != undefined) {
      const fullUrl = href.includes('?') ? href : href + $page.url.search
      selected = `${$page.url.pathname}${$page.url.search}` === fullUrl
    }
  }
</script>

<Button
  color={selected ? 'primary' : 'tertiary'}
  alignment="left"
  {...$$restProps}
  {href}
  on:click
  on:contextmenu
  class="font-normal block !origin-left border border-transparent {!selected
    ? 'text-slate-600 dark:text-zinc-400'
    : ''} {$$props.class}"
>
  <slot {selected} name="icon" slot="prefix">
    {#if icon}
      <Icon src={icon} solid={selected} size="20" />
    {/if}
  </slot>
  <slot />
  <div class="contents">
    <slot name="label" />
  </div>
</Button>
