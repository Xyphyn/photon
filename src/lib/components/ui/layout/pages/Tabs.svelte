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
  class="flex flex-row items-center gap-1 p-1 rounded-full bg-white/60 dark:bg-zinc-900/60
  backdrop-blur-lg border border-slate-200 dark:border-zinc-800 shadow-sm {clazz ??
    ''}
  "
>
  {#each routes as route (route.href)}
    <a
      onclick={() => invalidateAll()}
      href={buildUrl(currentRoute, route.href)}
      class="font-medium rounded-full px-4 py-1 hover:bg-slate-200/40 dark:hover:bg-zinc-700/40
      transition-colors duration-100 relative z-0 shrink-0"
    >
      {route.name}
      {#if isSelected(page.url, new SvelteURL(`${page.url.origin}${route.href}`))}
        <div
          class="rounded-full bg-slate-200/60 dark:bg-zinc-700/60
          absolute inset-0 w-full h-full -z-10"
        ></div>
      {/if}
    </a>
  {/each}
  {@render children?.()}
</nav>
