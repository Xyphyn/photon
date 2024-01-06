<script>

  import { Disclosure } from "mono-svelte"
  import { ChevronDown, Icon } from "svelte-hero-icons"

</script>

<Disclosure buttonClass="text-red-500" class="items-start justify-items-start gap-2">
  <div slot="summary" class="font-medium w-full text-left flex flex-row items-center justify-between">
    <div class="flex flex-row gap-1 items-center"><slot name="title" /></div>
    <Icon src={ChevronDown} size="20" mini />
  </div>
  <div class="pt-2">
  <slot /></div>
</Disclosure>