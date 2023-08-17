<script lang="ts">
  export let href: string
  export let highlight: boolean = false
  export let nowrap: boolean = false

  $: url = new URL(href)
</script>

<a {href} class="{highlight ? 'text-blue-500' : ''} hover:underline max-w-full">
  <slot name="icon" />
  <slot>
    <span
      class="flex gap-0 {nowrap
        ? 'w-full whitespace-nowrap overflow-hidden text-ellipsis text-xs'
        : ''} {$$props.class}"
    >
      <span class="opacity-90">
        {url.protocol}//
      </span>
      <span class="font-bold">
        {url.hostname}
      </span>
      <span class="opacity-90">
        {url.pathname}
      </span>
    </span>
  </slot>
</a>
