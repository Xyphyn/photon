<script lang="ts">
  export let href: string

  export let highlight: boolean
</script>

<a
  {href}
  class="flex flex-row gap-2 {highlight ? 'text-sky-500' : ''} hover:underline"
  {...$$restProps}
>
  <slot name="icon" />
  <slot />
</a>
