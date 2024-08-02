<script lang="ts">
  import { photonify } from './plugins'

  export let href = ''
  export let title = undefined

  export const parseURL = (href: string) => {
    try {
      return new URL(href)
    } catch (e) {
      return undefined
    }
  }

  $: photonified = photonify(href)
</script>

<a
  href={photonified ?? href}
  {title}
  class="hover:underline text-sky-600 dark:text-sky-500"
>
  <slot />
</a>
