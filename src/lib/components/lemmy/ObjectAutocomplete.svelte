<script lang="ts">
  import Avatar from '$lib/components/ui/Avatar.svelte'
  import { getClient } from '$lib/lemmy.js'
  import type { Community, ListingType } from 'lemmy-js-client'
  import { MenuButton, Search } from 'mono-svelte'
  import { createEventDispatcher } from 'svelte'
  import { Icon, XCircle } from 'svelte-hero-icons'
  import { fly } from 'svelte/transition'

  let type: 'community' = 'community'
  export let q: string = ''

  export let jwt: string | undefined = undefined
  export let listing_type: ListingType = 'Subscribed'
  export let showWhenEmpty: boolean = false

  const dispatcher = createEventDispatcher<{ select: Community | undefined }>()
</script>

{#if type == 'community'}
  <Search
    search={async (q) => {
      const results = await getClient().search({
        q: q || ' ',
        auth: jwt,
        type_: 'Communities',
        limit: 20,
        listing_type: listing_type,
        sort: 'TopAll',
      })

      return results.communities.map((c) => c.community)
    }}
    extractName={(c) => `${c.title}@${new URL(c.actor_id).hostname}`}
    on:select
    bind:q
    {showWhenEmpty}
    {...$$restProps}
    let:item
    let:select
  >
    <div class="w-full h-full" slot="noresults">
      {#if q == '' && showWhenEmpty}
        <MenuButton on:click={() => dispatcher('select', undefined)}>
          <Icon src={XCircle} size="16" mini />
          <div class="flex flex-col text-left">
            <span>None</span>
          </div>
        </MenuButton>
      {:else}
        <span class="mx-auto my-auto">No results.</span>
      {/if}
    </div>
    <div in:fly|global={{ y: -4, opacity: 0 }}>
      <MenuButton on:click={() => select(item)}>
        <Avatar url={item.icon} alt={item.title} width={24} />
        <div class="flex flex-col text-left">
          <span>{item.title}</span>
          <span class="text-xs opacity-80">
            {new URL(item.actor_id).hostname}
          </span>
        </div>
      </MenuButton>
    </div>
  </Search>
{/if}
