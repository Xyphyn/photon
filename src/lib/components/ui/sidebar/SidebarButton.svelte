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
  {...$$restProps}
  {href}
  alignment="left"
  on:click
  class="font-normal {selected
    ? 'text-primary-900 dark:!text-primary-100'
    : 'text-slate-600 dark:text-zinc-400'} {$userSettings.expandSidebar
    ? ''
    : '//max-lg:!p-1 //[&>*]:max-lg:!justify-center'} {$$props.class}"
>
  <slot {selected} name="icon" slot="prefix">
    {#if icon}
      <Icon src={icon} solid={selected} size="20" />
    {/if}
  </slot>
  <slot />
  <div
    class="{$userSettings.expandSidebar
      ? 'contents'
      : '//max-lg:hidden'} contents"
  >
    <slot name="label" />
  </div>
</Button>
