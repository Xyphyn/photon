<script lang="ts">
  export let href: string
  export let highlight: boolean = false
  export let nowrap: boolean = false

</script>

<a {href} class="{highlight ? 'text-blue-500' : ''} hover:underline max-w-full">
  <slot name="icon" />
  <slot>
    <span
      class="flex gap-0 {nowrap
        ? 'w-full whitespace-nowrap overflow-hidden text-ellipsis text-xs'
        : ''} {$$props.class}"
    >
    {href}
    </span>
  </slot>
</a>
