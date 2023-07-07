<script lang="ts">
  import { Color } from '$lib/ui/colors.js'

  export let color: Color = Color.secondary
  export let href = ''
  export let label: string = ''
</script>

<a
  {href}
  class="px-3 py-1 rounded-md {color} flex flex-row items-center
    justify-center text-sm transition-all gap-1"
  aria-label={label}
>
  <slot name="icon" />
  <slot />
</a>
