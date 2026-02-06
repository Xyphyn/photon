<script lang="ts">
  import { page } from '$app/state'
  import { type Snippet } from 'svelte'
  import { ChevronRight, Icon, type IconSource } from 'svelte-hero-icons/dist'
  import CommonList from '../CommonList.svelte'
  import Tabs from './Tabs.svelte'

  interface Props {
    baseRoute: string
    routes: { icon?: IconSource; href: string; name: string; detail?: string }[]
    header?: Snippet
    children?: Snippet
  }

  let { baseRoute, routes, header, children }: Props = $props()

  let onBaseRoute = $derived(page.url.pathname == baseRoute)
</script>

{#if !onBaseRoute}
  <Tabs {routes} />
{/if}

{@render header?.()}
{#if onBaseRoute}
  <CommonList animate={false} items={routes}>
    {#snippet item(route)}
      <a class="font-medium flex items-center gap-1" href={route.href}>
        {#if route.icon}
          <Icon
            src={route.icon}
            mini
            size="32"
            class="bg-gray-200/20 dark:bg-gray-600/20 p-1.5 rounded-lg color
            text-gray-500 dark:text-gray-300 float-left mr-2 clear-both"
            style="grid-area: icon;"
          />
        {/if}
        <div class="flex-1">
          <div>
            {route.name}
          </div>
          {#if route.detail}
            <div>
              {route.detail}
            </div>
          {/if}
        </div>
        <Icon src={ChevronRight} size="20" class />
      </a>
    {/snippet}
  </CommonList>
{:else}
  {@render children?.()}
{/if}
