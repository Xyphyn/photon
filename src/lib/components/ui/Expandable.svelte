<script lang="ts">
  import { Disclosure } from 'mono-svelte'
  import { ChevronDown, Icon } from 'svelte-hero-icons'
  export let open: boolean = false
</script>

<Disclosure
  bind:open
  class="items-start justify-items-start gap-2 {$$props.class}"
>
  <div
    slot="summary"
    class="font-medium w-full text-left flex flex-row items-center justify-between"
  >
    <div class="flex flex-row gap-1 items-center w-full">
      <slot name="title" />
    </div>
    <Icon
      src={ChevronDown}
      size="20"
      mini
      class="{open ? 'rotate-180' : ''} transition-transform"
    />
  </div>
  <div class="pt-2">
    <slot />
  </div>
</Disclosure>
