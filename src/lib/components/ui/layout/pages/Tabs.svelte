<script lang="ts">
  import { invalidateAll } from '$app/navigation'
  import { page } from '$app/state'
  import TabButton from '$lib/components/input/switch/TabButton.svelte'
  import { SvelteURL } from 'svelte/reactivity'

  interface Props {
    routes: {
      href: string
      name: string
    }[]
    currentRoute?: SvelteURL | undefined
    buildUrl?: (currentRoute: SvelteURL | undefined, href: string) => string
    children?: import('svelte').Snippet
    style?: 'header' | 'subpage'
  }

  let {
    routes,
    currentRoute = undefined,
    buildUrl = (_, href) => href,
    children,
    style = 'header',
  }: Props = $props()

  function isSelected(url: URL, href?: SvelteURL) {
    if (href?.search != '') return href?.search == url.search
    else if (url.search == '') return href?.pathname == url.pathname
  }
</script>

<nav
  class={[
    'flex flex-row items-center justify-center sm:justify-start my-2 sm:mt-0 flex-wrap z-20',
    style == 'header' ? 'p-1 gap-x-8 gap-y-4' : 'gap-3',
  ]}
>
  {#each routes as route (route.href)}
    {@const selected = isSelected(
      page.url,
      new SvelteURL(`${page.url.origin}${route.href}`),
    )}
    {#if style == 'header'}
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
    {:else}
      <TabButton href={buildUrl(currentRoute, route.href)} {selected}>
        {route.name}
      </TabButton>
    {/if}
  {/each}
  {@render children?.()}
</nav>
