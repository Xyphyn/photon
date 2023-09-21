<script lang="ts">
  export let href: string
  export let highlight: boolean = false
  export let nowrap: boolean = false

  const parseURL = (href: string) => {
    try {
      return new URL(href)
    } catch (e) {
      return undefined
    }
  }
</script>

<a {href} class="{highlight ? 'text-blue-500' : ''} hover:underline max-w-full">
  <slot name="icon" />
  <slot>
    <span
      class="flex relative gap-0 {nowrap
        ? 'w-full whitespace-nowrap overflow-hidden text-ellipsis text-xs'
        : ''} {$$props.class} text-transparent bg-clip-text bg-gradient-to-r
        from-blue-500 via-blue-500 to-blue-500/0"
    >
        {href}
    </span>
  </slot>
</a>
