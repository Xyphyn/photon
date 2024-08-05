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
      selected = $page.url.pathname == href
    }
  }
</script>

<Button
  color="tertiary"
  alignment="left"
  {...$$restProps}
  {href}
  on:click
  on:contextmenu
  class="font-normal block {selected
    ? 'text-primary-900 dark:!text-primary-100 bg-slate-100 dark:bg-zinc-800'
    : 'text-slate-600 dark:text-zinc-400'} {$$props.class}"
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
