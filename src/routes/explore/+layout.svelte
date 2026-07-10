<script lang="ts">
  import { page } from '$app/state'
  import { t } from '$lib/app/i18n'
  import Location from '$lib/feature/filter/Location.svelte'
  import Sort from '$lib/feature/filter/Sort.svelte'
  import { Header, SearchBar, Tabs } from '$lib/ui/layout'

  let { data, children } = $props()

  let search = $state(page.data.query || '')
  let form = $state<HTMLFormElement>()
</script>

<Tabs
  routes={[
    {
      href: '/explore/communities',
      name: $t('routes.communities.title'),
    },
    {
      href: '/explore/feeds',
      name: $t('routes.feeds.title'),
    },
  ]}
></Tabs>

<svelte:head>
  <title>{$t('routes.explore.title')}</title>
</svelte:head>

<Header pageHeader>
  {$t('routes.explore.title')}
  {#snippet extended()}
    {#if page.route.id == '/explore/communities'}
      <form method="get" action={page.url.pathname} class="contents" bind:this={form}>
        <SearchBar bind:query={search} />

        <div class="flex flex-row flex-wrap gap-4 items-center">
          <Location name="type" selected={data.type} onchange={() => form?.requestSubmit()} />
          <Sort
            type="community"
            name="sort"
            selected={data.sort}
            onchange={() => form?.requestSubmit()}
          />
        </div>
      </form>
    {:else if page.route.id == '/explore/feeds'}
      <form method="get" action={page.url.pathname} class="contents" bind:this={form}>
        <SearchBar bind:query={search} />

        <div class="flex flex-row flex-wrap gap-4 items-center">
          <Location name="type" selected={data.type} onchange={() => form?.requestSubmit()} />
          <Sort
            type="community"
            name="sort"
            selected={data.sort}
            onchange={() => form?.requestSubmit()}
          />
        </div>
      </form>
    {/if}
  {/snippet}
</Header>

{@render children?.()}
