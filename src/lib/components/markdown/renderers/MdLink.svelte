<script lang="ts">
  import { photonify } from './plugins.js'
  import { page } from '$app/state'

  interface Props {
    href?: string
    title?: string
    children?: import('svelte').Snippet
  }

  let { href = '', title = undefined, children }: Props = $props()

  export const parseURL = (href: string) => {
    try {
      return new URL(href)
    } catch {
      return undefined
    }
  }

  let photonified = $derived(photonify(href))

  const isInternalLink = parseURL(href)?.host === page.url.host;
</script>

<a
  href={photonified ?? href}
  target={photonified || isInternalLink ? undefined : "_blank"}
  {title}
  class="hover:underline text-sky-600 dark:text-sky-500"
>
  {@render children?.()}
</a>
