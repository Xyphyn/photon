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
    class="font-medium w-full text-left flex flex-row items-center justify-between hover:text-primary-900
    hover:dark:text-primary-100 transition-colors h-full"
  >
    <div class="flex flex-row gap-1 items-center w-full">
      <slot name="title" />
    </div>
    <Icon
      src={ChevronDown}
      size="20"
      micro
      class="{open ? 'rotate-180' : ''} transition-transform"
    />
  </div>
  <slot name="content">
    <div class="pt-2 text-slate-900 dark:text-zinc-100">
      <slot />
    </div>
  </slot>
</Disclosure>
