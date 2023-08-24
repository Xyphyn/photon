<script lang="ts">
  import SearchInput from '$lib/components/input/SearchInput.svelte'
  import Avatar from '$lib/components/ui/Avatar.svelte'
  import MenuButton from '$lib/components/ui/menu/MenuButton.svelte'
  import { getClient } from '$lib/lemmy.js'
  import type { Community, ListingType } from 'lemmy-js-client'
  import { createEventDispatcher } from 'svelte'
  import { Icon, XCircle } from 'svelte-hero-icons'

  let type: 'community' = 'community'
  export let q: string = ''

  export let jwt: string | undefined = undefined
  export let listing_type: ListingType = 'Subscribed'
  export let items: Community[] | undefined = undefined
  let showNone: boolean = false

  const dispatcher = createEventDispatcher<{ select: Community }>()
</script>

{#if type == 'community'}
  <SearchInput
    options={items || []}
    on:search={async () => {
      if (q == '') showNone = true
      else showNone = false

      const results = await getClient().search({
        q: q || ' ',
        auth: jwt,
        type_: 'Communities',
        limit: 20,
        listing_type: listing_type,
        sort: 'TopAll',
      })

      items = results.communities.map((c) => c.community)
    }}
    debounceTime={600}
    extractName={(c) => c.title}
    bind:query={q}
    extractSelected={(c) => {
      if (c) dispatcher('select', c)
    }}
    let:extractName
    let:extractSelected
    let:option
    showWhenEmpty
    {...$$restProps}
    let:query
  >
    {#if query == ''}
      <MenuButton on:click={() => dispatcher('select', undefined)}>
        <Icon src={XCircle} size="16" mini />
        <div class="flex flex-col text-left">
          <span>None</span>
        </div>
      </MenuButton>
    {:else if option}
      <MenuButton on:click={() => extractSelected(option)}>
        <Avatar url={option.icon} alt={option.title} width={24} />
        <div class="flex flex-col text-left">
          <span>{option.title}</span>
          <span class="text-xs opacity-80">
            {new URL(option.actor_id).hostname}
          </span>
        </div>
      </MenuButton>
    {/if}
  </SearchInput>
{/if}
