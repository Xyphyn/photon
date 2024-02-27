<script lang="ts">
  import { Button } from 'mono-svelte'
  import { Icon, type IconSource } from 'svelte-hero-icons'

  export let label: string
  export let icon: IconSource | undefined = undefined
</script>

<Button
  {...$$restProps}
  class="px-3 py-1.5 max-md:py-0 max-md:px-0 max-md:h-8 max-md:w-8 {$$props.class ??
    ''}"
  size="custom"
  title={label}
>
  {#if icon}
    <Icon src={icon} mini size="16" />
  {:else}
    <slot name="icon" />
  {/if}
  <span class="max-md:hidden">{label}</span>
  <slot />
</Button>
