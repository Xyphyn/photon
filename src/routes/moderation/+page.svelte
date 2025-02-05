<script lang="ts">
  import UserLink from '$lib/components/lemmy/user/UserLink.svelte'
  import { fly } from 'svelte/transition'
  import Report from './Report.svelte'
  import MultiSelect from '$lib/components/input/Switch.svelte'
  import { page } from '$app/state'
  import {
    EnvelopeOpen,
    Funnel,
    Icon,
    Inbox,
    Newspaper,
  } from 'svelte-hero-icons'
  import Placeholder from '$lib/components/ui/Placeholder.svelte'
  import { searchParam } from '$lib/util.svelte.js'
  import { Button, Material, Select } from 'mono-svelte'
  import { t } from '$lib/translations'
  import Header from '$lib/components/ui/layout/pages/Header.svelte'
  import Option from 'mono-svelte/forms/select/Option.svelte'

  let { data = $bindable() } = $props()

  let reports = $state(data.items)
  $effect(() => {
    reports = data.items
  })
</script>

<div class="mb-4 flex flex-col gap-4">
  <Header pageHeader>
    {$t('routes.moderation.title')}
    {#snippet extended()}
      <div class="flex flex-row gap-2 flex-wrap items-end">
        <Select
          bind:value={data.type}
          onchange={() => searchParam(page.url, 'type', data.type, 'page')}
        >
          {#snippet customLabel()}
            <span class="flex items-center gap-1">
              <Icon src={Funnel} size="15" mini />
              {$t('filter.filter')}
            </span>
          {/snippet}
          <Option value="all">{$t('filter.location.all')}</Option>
          <Option value="unread">{$t('filter.unread')}</Option>
        </Select>
        <Button href="/modlog" class="h-max ml-auto">
          <Icon src={Newspaper} size="16" mini />
          {$t('routes.modlog')}
        </Button>
      </div>
    {/snippet}
  </Header>
</div>
{#if reports && reports.length > 0}
  <div
    class="flex flex-col *:py-4 divide-y divide-slate-200 dark:divide-zinc-800"
  >
    {#each reports as item}
      <div
        in:fly={{ y: -6, opacity: 0, duration: 500 }}
        class="flex flex-col gap-1 text-sm"
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
      </div>
    {/each}
  </div>
{:else}
  <Placeholder
    icon={Inbox}
    title={$t('routes.moderation.empty.title')}
    description={$t('routes.moderation.empty.description')}
  />
{/if}
