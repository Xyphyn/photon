<script lang="ts">
  import { goto } from '$app/navigation'
  import MultiSelect from '$lib/components/input/Switch.svelte'
  import { page } from '$app/stores'
  import {
    ChatBubbleOvalLeftEllipsis,
    Check,
    GlobeAmericas,
    Icon,
    InformationCircle,
    MagnifyingGlass,
    PencilSquare,
    Plus,
    QuestionMarkCircle,
    UserGroup,
  } from 'svelte-hero-icons'
  import CommunityLink from '$lib/components/lemmy/community/CommunityLink.svelte'
  import Subscribe from './Subscribe.svelte'
  import Pageination from '$lib/components/ui/Pageination.svelte'
  import {
    DOMAIN_REGEX,
    DOMAIN_REGEX_FORMS,
    isSubscribed,
    searchParam,
  } from '$lib/util.js'
  import { addSubscription } from '$lib/lemmy/user.js'
  import { profile } from '$lib/auth.js'
  import { Button, Material, Popover, Select, TextInput } from 'mono-svelte'
  import Sort from '$lib/components/lemmy/Sort.svelte'
  import Placeholder from '$lib/components/ui/Placeholder.svelte'
  import FormattedNumber from '$lib/components/util/FormattedNumber.svelte'
  import CommunityItem from '$lib/components/lemmy/community/CommunityItem.svelte'

  export let data

  let search = data.query || ''
  let instance = ''
</script>

<svelte:head>
  <title>Communities</title>
</svelte:head>

<h1 class="text-3xl font-bold">
  <span>Communities</span>
  <Popover
    openOnHover
    class="!inline-flex"
    targetClass="inline"
    placement="bottom"
  >
    <Icon
      src={InformationCircle}
      size="20"
      mini
      slot="target"
      class="!inline"
    />
    <Material slot="popover" color="distinct" class="w-72">
      <p class="font-normal">
        Can't find a community on your home instance? Go to the <a
          href="/search"
          class="text-blue-500 hover:underline"
        >
          search
        </a>
        page, and search with this syntax:
        <code>!community@instance.com</code>
      </p>
    </Material>
  </Popover>
</h1>
<div class="flex flex-row flex-wrap gap-4 mt-4">
  <Select
    bind:value={data.type}
    on:change={() => searchParam($page.url, 'type', data.type ?? 'All', 'page')}
  >
    <span slot="label" class="flex items-center gap-1">
      <Icon src={GlobeAmericas} mini size="15" />
      Location
    </span>
    <option value="All">All</option>
    <option value="Local">Local</option>
    <option value="Subscribed">Subscribed</option>
  </Select>
  <Sort selected={data.sort} />
  <form
    on:submit|preventDefault={() => searchParam($page.url, 'q', search, 'page')}
    class="flex flex-col sm:flex-row gap-2 sm:ml-auto items-center"
  >
    <TextInput
      bind:value={search}
      placeholder="Search for a community..."
      label="Query"
      size="sm"
    />
    <Button
      submit
      color="ghost"
      size="square-md"
      class="self-end"
      aria-label="Search"
    >
      <Icon src={MagnifyingGlass} size="16" mini />
    </Button>
  </form>
</div>
<ul class="flex flex-col divide-y dark:divide-zinc-800">
  {#if data.communities.length == 0}
    <Placeholder
      icon={QuestionMarkCircle}
      title="No communities"
      description="There are no communities that match this filter. Try refining your
  search."
    />
  {/if}
  {#each data.communities as community}
    <CommunityItem {community} />
  {/each}
</ul>
{#if data.communities.length > 0}
  <div class="mt-2 w-full">
    <Pageination
      page={Number($page.url.searchParams.get('page')) || 1}
      on:change={(p) => searchParam($page.url, 'page', p.detail.toString())}
    />
  </div>
{/if}
