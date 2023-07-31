<script lang="ts">
  import { ChevronDoubleLeft, Icon } from 'svelte-hero-icons'
  import Button from '../input/Button.svelte'

  let expanded = true
</script>

<nav
  class="hidden xl:flex flex-col pl-4 pr-4 py-4 overflow-auto sticky top-16 bottom-0
  gap-1 max-h-[calc(100vh-4rem)] w-full bg-slate-100 dark:bg-black"
  class:flex-1={expanded}
  class:w-max={!expanded}
>
  <Button
    on:click={() => (expanded = !expanded)}
    class="w-max !p-2 hover:bg-slate-200"
  >
    <Icon
      src={ChevronDoubleLeft}
      mini
      size="16"
      class="transition-transform {expanded ? '' : 'rotate-180'}"
    />
  </Button>
  <slot {expanded} />
</nav>
