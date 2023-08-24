<script lang="ts">
  import UserLink from '$lib/components/lemmy/user/UserLink.svelte'
  import Card from '$lib/components/ui/Card.svelte'
  import { fly } from 'svelte/transition'
  import Report from './Report.svelte'
  import MultiSelect from '$lib/components/input/MultiSelect.svelte'
  import { page } from '$app/stores'
  import { goto } from '$app/navigation'
  import { EnvelopeOpen, Icon, Inbox, Newspaper } from 'svelte-hero-icons'
  import Placeholder from '$lib/components/ui/Placeholder.svelte'
  import Button from '$lib/components/input/Button.svelte'
  import { searchParam } from '$lib/util.js'

  export let data
</script>

<div class="mb-4 flex flex-col gap-4">
  <h1 class="font-bold text-2xl">Reports</h1>
  <div class="flex flex-row gap-2 flex-wrap items-center">
    <MultiSelect
      selected={data.type}
      options={['all', 'unread']}
      optionNames={['All', 'Unread']}
      on:select={(e) => searchParam($page.url, 'type', e.detail, 'page')}
    />
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
        <Card
          class="p-4 flex flex-col gap-4 text-sm !bg-slate-100 dark:!bg-zinc-950"
        >
          <div class="flex flex-col gap-1.5">
            <span class="text-xs font-bold dark:text-zinc-400 text-slate-600">
              Report from
            </span>
            <span class="font-bold">
              <UserLink avatar user={item.creator} />
            </span>
          </div>

          <Report {item} />
        </Card>
      </div>
    {/each}
  </div>
{:else}
  <Placeholder>
    <Icon src={Inbox} size="28" slot="icon" />
    <span slot="title">No new reports</span>
  </Placeholder>
{/if}
