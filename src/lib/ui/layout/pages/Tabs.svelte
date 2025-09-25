<script lang="ts">
  interface Props {
    routes: {
      href: string
      name: string
    }[]
    currentRoute?: SvelteURL | undefined
    buildUrl?: (currentRoute: SvelteURL | undefined, href: string) => string
    children?: import('svelte').Snippet
    style?: 'header' | 'subpage'
    margin?: boolean
  }

  let {
    routes,
    currentRoute = undefined,
    buildUrl = (_, href) => href,
    children,
    style = 'header',
    margin = true,
  }: Props = $props()

  let matchType = $derived<('search' | 'pathname')[]>(
    routes.map((i) =>
      new URL(`https://example.com${i.href}`)?.search != ''
        ? 'search'
        : 'pathname',
    ),
  )

  // i am on 2 hours of sleep i apologize
  function isSelected(url: URL, href: SvelteURL, type: 'search' | 'pathname') {
    const currentSearch = new Set(url.searchParams.values())
    const hrefSearch = new Set(href.searchParams.values())
    // checks if there is any
    const usePathname = !routes.some(
      (i) =>
        new Set(
          new URL(`https://example.com${i.href}`).searchParams.values(),
        ).intersection(currentSearch).size > 0,
    )

    const hasSearchParam = hrefSearch.intersection(currentSearch).size > 0

    if (hasSearchParam && !usePathname) return hasSearchParam
    else if ((url.search == '' || usePathname) && type == 'pathname')
      return href.pathname == url.pathname
  }
</script>

<nav
  class={[
    'flex flex-row items-center sm:mt-0 flex-wrap z-20',
    style == 'header'
      ? 'p-1 gap-x-8 gap-y-4 justify-center sm:justify-start'
      : 'gap-2',
    margin && 'my-2',
    margin && style == 'subpage' && 'mb-3',
  ]}
>
  {#each routes as route, index (route.href)}
    {@const selected = isSelected(
      page.url,
      new SvelteURL(`${page.url.origin}${route.href}`),
      matchType[index],
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
