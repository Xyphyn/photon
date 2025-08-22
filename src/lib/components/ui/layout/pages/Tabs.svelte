<script lang="ts">
  import { invalidateAll } from '$app/navigation'
  import { page } from '$app/state'
  import { SvelteURL } from 'svelte/reactivity'

  interface Props {
    routes: {
      href: string
      name: string
    }[]
    currentRoute?: SvelteURL | undefined
    buildUrl?: (currentRoute: SvelteURL | undefined, href: string) => string
    class?: string
    children?: import('svelte').Snippet
  }

  let {
    routes,
    currentRoute = undefined,
    buildUrl = (_, href) => href,
    class: clazz = '',
    children,
  }: Props = $props()

  function isSelected(url: URL, href?: SvelteURL) {
    if (href?.search != '') return href?.search == url.search
    else if (url.search == '') return href?.pathname == url.pathname
  }
</script>

<nav
  class="flex flex-row items-center gap-x-8 gap-y-4 p-1 justify-center sm:justify-start my-2 sm:mt-0 flex-wrap"
>
  {#each routes as route (route.href)}
    {@const selected = isSelected(
      page.url,
      new SvelteURL(`${page.url.origin}${route.href}`),
    )}
    <a
      onclick={() => invalidateAll()}
      href={buildUrl(currentRoute, route.href)}
      class={[
        'rounded-full font-medium transition-colors duration-100 relative z-0 shrink-0 hover:text-slate-900 hover:dark:text-zinc-100',
        selected
          ? 'text-primary-900 dark:text-primary-100'
          : 'text-slate-500 dark:text-zinc-500',
      ]}
    >
      {route.name}
    </a>
  {/each}
  {@render children?.()}
</nav>
