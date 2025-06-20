<script lang="ts">
  import { invalidateAll } from '$app/navigation'
  import { page } from '$app/state'

  interface Tab {
    name: string
    pathname?: string
    search?: { name: string; value: string; isDefault?: boolean }
  }

  interface Props {
    tabs: Tab[]
    currentRoute?: string | undefined
    buildUrl?: (tab: Tab) => string
    defaultRoute?: string | undefined
    class?: string
    children?: import('svelte').Snippet
  }

  let {
    tabs,
    buildUrl = defaultUrl,
    class: clazz = '',
    children,
  }: Props = $props()

  function isSelected(tab: Tab): boolean {
    if (tab.pathname && page.url.pathname != tab.pathname) {
      console.log('bail path: ', tab.pathname, ' != ', page.url.pathname)
      return false
    }
    if (tab.search) {
      const urlVal = page.url.searchParams.get(tab.search.name)
      if (!urlVal && !tab.search.isDefault) {
        return false
      } else if (urlVal && urlVal != tab.search.value) {
        return false
      }
    }
    return true
  }

  function defaultUrl(tab: Tab): string {
    let href = new URL(page.url)
    if (tab.pathname) {
      href.pathname = tab.pathname
    }
    if (tab.search) {
      href.searchParams.set(tab.search.name, tab.search.value)
    }
    return href.toString()
  }
</script>

<nav
  class="flex flex-row items-center gap-1 p-1 rounded-full bg-white/60 dark:bg-zinc-800/60
  backdrop-blur-lg border border-slate-200/60 dark:border-zinc-800 shadow-lg border-opacity-50 {clazz ??
    ''}
  "
>
  {#each tabs as tab (tab.name)}
    <a
      onclick={() => invalidateAll()}
      href={buildUrl(tab)}
      class="font-medium rounded-full px-4 py-1 hover:bg-slate-200/40 dark:hover:bg-zinc-700/40
      transition-colors duration-100 relative z-0 shrink-0"
    >
      {tab.name}
      {#if isSelected(tab)}
        <div
          class="rounded-full bg-slate-100/60 dark:bg-zinc-700/60
          absolute inset-0 w-full h-full -z-10"
        ></div>
      {/if}
    </a>
  {/each}
  {@render children?.()}
</nav>
