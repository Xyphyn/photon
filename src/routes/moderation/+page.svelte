<script lang="ts">
  import { goto } from '$app/navigation'
  import { page } from '$app/state'
  import Header from '$lib/components/ui/layout/pages/Header.svelte'
  import Placeholder from '$lib/components/ui/Placeholder.svelte'
  import ProgressBar from '$lib/components/ui/ProgressBar.svelte'
  import { t } from '$lib/i18n/translations'
  import { client } from '$lib/client/client.svelte'
  import { searchParam } from '$lib/util.svelte.js'
  import { Button, Select, toast } from 'mono-svelte'
  import Option from 'mono-svelte/forms/select/Option.svelte'
  import { tick } from 'svelte'
  import { Check, Funnel, Icon, Inbox } from 'svelte-hero-icons'
  import { fly } from 'svelte/transition'
  import Report from './Report.svelte'
  import Pageination from '$lib/components/ui/Pageination.svelte'

  let { data = $bindable() } = $props()

  let batch = $state({
    progress: -1,
  })
  async function markAllAsResolved() {
    if (!data.items?.value) return
    batch.progress = 0

    await Promise.all(
      data.items?.value.map(report => {
        switch (report.type) {
          case 'comment': {
            const promise = client().resolveCommentReport({
              report_id: report.id,
              resolved: true,
            })
            promise.then(
              () => (batch.progress += 1 / data.items?.value!.length),
            )
            return promise
          }
          case 'post': {
            const promise = client().resolvePostReport({
              report_id: report.id,
              resolved: true,
            })
            promise.then(
              () => (batch.progress += 1 / data.items?.value!.length),
            )
            return promise
          }
          case 'message': {
            const promise = client().resolvePrivateMessageReport({
              report_id: report.id,
              resolved: true,
            })
            promise.then(
              () => (batch.progress += 1 / data.items?.value!.length),
            )
            return promise
          }
        }
      }),
    )

    toast({ content: $t('routes.moderation.markAllComplete'), type: 'success' })
    await goto(page.url, { invalidateAll: true })

    batch.progress = -1
  }
</script>

<div class="mb-4 flex flex-col gap-4">
  <Header pageHeader>
    {$t('routes.moderation.title')}
    {#snippet extended()}
      <div class="flex flex-row gap-2 flex-wrap items-end">
        <Select
          bind:value={data.type.value}
          onchange={async () => {
            await tick()
            searchParam(page.url, 'type', data.type.value, 'page')
          }}
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
        <Button
          loading={batch.progress >= 0}
          disabled={batch.progress >= 0}
          onclick={markAllAsResolved}
          class="h-max ml-auto"
          rounding="xl"
        >
          <Icon src={Check} size="16" mini />
          {$t('routes.moderation.markAll')}
        </Button>
      </div>
    {/snippet}
  </Header>
</div>
<ProgressBar progress={batch.progress} />
{#if data.items?.value && data.items?.value.length > 0}
  <div
    class="flex flex-col *:py-4 divide-y divide-slate-200 dark:divide-zinc-800"
  >
    {#each data.items?.value as item (item.id)}
      <div
        in:fly={{ y: -6, opacity: 0, duration: 500 }}
        class="flex flex-col gap-3 text-sm -mx-4 sm:-mx-6 px-4 sm:px-6"
      >
        <div class="space-y-2">
          <Report {item} />
        </div>
      </div>
    {/each}
  </div>
  <Pageination
    page={data.page}
    href={current => `?page=${current}`}
    hasMore={data.items.value.length >= 20}
  />
{:else}
  <Placeholder
    icon={Inbox}
    title={$t('routes.moderation.empty.title')}
    description={$t('routes.moderation.empty.description')}
  />
{/if}
<div class="h-4"></div>
