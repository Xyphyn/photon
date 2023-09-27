<script lang="ts">
  import UserLink from '$lib/components/lemmy/user/UserLink.svelte'
  import { fly } from 'svelte/transition'
  import Report from './Report.svelte'
  import MultiSelect from '$lib/components/input/Switch.svelte'
  import { page } from '$app/stores'
  import {
    EnvelopeOpen,
    Funnel,
    Icon,
    Inbox,
    Newspaper,
  } from 'svelte-hero-icons'
  import Placeholder from '$lib/components/ui/Placeholder.svelte'
  import { searchParam } from '$lib/util.js'
  import { Button, Material, Select } from 'mono-svelte'

  export let data
</script>

<div class="mb-4 flex flex-col gap-4">
  <h1 class="font-bold text-3xl">Reports</h1>
  <div class="flex flex-row gap-2 flex-wrap items-center">
    <Select
      bind:value={data.type}
      on:change={() => searchParam($page.url, 'type', data.type, 'page')}
    >
      <span slot="label" class="flex items-center gap-1">
        <Icon src={Funnel} size="15" mini />
        Filter
      </span>
      <option value="all">All</option>
      <option value="unread">Unread</option>
    </Select>
    <Button href="/modlog" class="h-max ml-auto">
      <Icon src={Newspaper} size="16" mini />
      Modlog
    </Button>
  </div>
</div>
{#if data.items && data.items.length > 0}
  <div class="flex flex-col gap-4">
    {#each data.items as item}
      <div in:fly={{ y: -6, opacity: 0, duration: 500 }}>
        <Material class="flex flex-col gap-4 text-sm">
          <div class="flex flex-col gap-1.5">
            <span class="text-xs font-bold dark:text-zinc-400 text-slate-600">
              Report from
            </span>
            <span class="font-bold">
              <UserLink avatar user={item.creator} />
            </span>
          </div>

          <Report {item} />
        </Material>
      </div>
    {/each}
  </div>
{:else}
  <Placeholder
    icon={Inbox}
    title="No new reports"
    description="When submissions are reported, you can act on them here."
  />
{/if}
