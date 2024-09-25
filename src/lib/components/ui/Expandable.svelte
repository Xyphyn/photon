<script lang="ts">
  import { Disclosure } from 'mono-svelte'
  import { Minus, Plus, Icon } from 'svelte-hero-icons'
  export let open: boolean = false
</script>

<Disclosure
  bind:open
  class="items-start justify-items-start gap-2 {$$props.class}"
>
  <div
    slot="summary"
    class="font-medium w-full text-left flex flex-row items-center justify-between hover:text-primary-900
    hover:dark:text-primary-100 transition-colors h-full z-0 group relative"
  >
    <div class="flex flex-row gap-1 items-center w-full">
      <slot name="title" />
    </div>
    <Icon
      src={open ? Minus : Plus}
      size="16"
      micro
      class="{open
        ? ''
        : 'rotate-90'} transition-transform duration-300 ease-out"
    />
    <div
      class="inset-0 -z-10 opacity-0 absolute bg-slate-100 dark:bg-zinc-900 rounded-full
    group-hover:opacity-100 group-hover:-inset-1 group-hover:-inset-x-2 transition-all"
    />
  </div>
  <slot name="content">
    <div class="pt-2 text-slate-900 dark:text-zinc-100">
      <slot />
    </div>
  </slot>
</Disclosure>
