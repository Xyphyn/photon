<script lang="ts">
  import { userSettings } from '$lib/settings.js'
  import { Button } from 'mono-svelte'

  export let selected: boolean = false
</script>

<Button
  {...$$restProps}
  color="tertiary"
  alignment="left"
  on:click
  class="hover:bg-slate-100 font-normal {selected
    ? 'text-primary-900 dark:!text-primary-100'
    : 'text-slate-600 dark:text-zinc-400'} {$userSettings.expandSidebar
    ? ''
    : 'max-lg:!p-1 [&>*]:max-lg:!justify-center'} {$$props.class}"
>
  <slot name="prefix" slot="prefix" />
  <slot />
  <div class={$userSettings.expandSidebar ? 'contents' : 'max-lg:hidden'}>
    <slot name="label" />
  </div>
</Button>
