<script lang="ts">
  import { invalidate } from '$app/navigation'
  import { page } from '$app/stores'
  import { fly } from 'svelte/transition'

  export let routes: {
    href: string
    name: string
  }[]
  export let currentRoute: string | undefined = undefined
  export let isSelected: (
    url: URL,
    currentRoute: string | undefined,
    route: string,
    defaultRoute?: string
  ) => boolean = (url, currentRoute, route) =>
    (currentRoute ?? url.pathname) == route
  export let buildUrl: (
    currentRoute: string | undefined,
    href: string
  ) => string = (route, href) => href
  export let defaultRoute: string | undefined = undefined
</script>

<nav
  class="flex flex-row items-center gap-1 p-1 rounded-full bg-white/60 dark:bg-zinc-800/60
  backdrop-blur-lg border border-slate-200/60 dark:border-zinc-800 shadow-lg border-opacity-50 {$$props.class ??
    ''}
  "
>
  {#each routes as route}
    <a
      on:click={() => invalidate(route.href)}
      href={buildUrl(currentRoute, route.href)}
      class="font-medium rounded-full px-4 py-1 hover:bg-slate-200/40 hover:dark:bg-zinc-700/40
      transition-colors duration-100 relative z-0 flex-shrink-0"
    >
      {route.name}
      {#if isSelected($page.url, currentRoute, route.href, defaultRoute)}
        <div
          class="rounded-full bg-slate-100/60 dark:bg-zinc-700/60
          absolute inset-0 w-full h-full -z-10"
        ></div>
      {/if}
    </a>
  {/each}
  <slot />
</nav>
