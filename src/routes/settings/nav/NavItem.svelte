<script lang="ts">
  import { Material, Popover } from 'mono-svelte'

  export let href: string
  export let size: keyof typeof sizes = 'medium'
  export let title: string = ''

  const sizes = {
    large: 'h-24',
    medium: 'h-16',
    small: 'h-8',
  }
</script>

<Popover openOnHover placement="right">
  <a {href} slot="target">
    <slot />
  </a>
  <Material
    slot="popover"
    padding="none"
    rounding="xl"
    elevation="medium"
    class="px-3 py-2 font-medium"
  >
    {title}
  </Material>
</Popover>
<div class="{sizes[size]} border-l self-center"></div>
