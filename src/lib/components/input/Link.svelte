<script lang="ts">
  export let href: string

  export let highlight: boolean = false
</script>

<a
  {href}
  class="{highlight ? 'text-sky-500' : ''} hover:underline"
  {...$$restProps}
>
  <slot name="icon" />
  <slot />
</a>
