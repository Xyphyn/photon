<script lang="ts">
  import { page } from '$app/state'
  import TabButton from '$lib/ui/form/TabButton.svelte'
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
    // me on 2025/10/9: no shi buh
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
    'tab-bar',
    style == 'header' ? 'bar-header' : 'gap-2',
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
        href={buildUrl(currentRoute, route.href)}
        class={['tab-item ', selected && 'tab-selected']}
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

<style>
  @reference '../../../../app.css';
  .tab-bar {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    z-index: 20;

    @variant sm {
      margin-top: 0;
    }
  }

  .tab-bar.bar-header {
    padding: calc(var(--spacing));
    gap: calc(var(--spacing) * 1) calc(var(--spacing) * 2);
    justify-content: center;
    margin-left: calc(var(--spacing) * -3);
    margin-right: calc(var(--spacing) * -3);
    margin-top: calc(var(--spacing) * -1);

    @variant sm {
      justify-content: start;
    }
  }

  .tab-selected {
    position: relative;
    color: var(--color-primary-900);

    @variant dark {
      color: var(--color-primary-100);
    }

    @variant hover {
      cursor: default !important;
    }
  }

  .tab-selected::before {
    content: '';
    position: absolute;
    inset: calc(var(--spacing) * -1) calc(var(--spacing) * -3);
    z-index: -10;
    border-radius: 9999px;
  }

  .tab-item {
    &:not(.tab-selected) {
      color: var(--color-slate-500);

      @variant dark {
        color: var(--color-zinc-500);
      }
    }
    padding: calc(var(--spacing)) calc(var(--spacing) * 3);
    border-radius: var(--radius-xl);
    font-weight: var(--font-weight-medium);
    transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 75ms;
    z-index: 0;
    flex-shrink: 0;

    @variant hover {
      color: var(--color-slate-900);
      background-color: var(--color-slate-100);
      @variant dark {
        color: var(--color-zinc-100);
        background-color: var(--color-zinc-800);
      }
    }
  }
</style>
