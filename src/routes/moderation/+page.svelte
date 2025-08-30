<script lang="ts">
  import { goto } from '$app/navigation'
  import { page } from '$app/state'
  import CommunityLink from '$lib/components/lemmy/community/CommunityLink.svelte'
  import CommonList from '$lib/components/ui/layout/CommonList.svelte'
  import Header from '$lib/components/ui/layout/pages/Header.svelte'
  import Pageination from '$lib/components/ui/Pageination.svelte'
  import Placeholder from '$lib/components/ui/Placeholder.svelte'
  import ProgressBar from '$lib/components/ui/ProgressBar.svelte'
  import { t } from '$lib/i18n/translations'
  import { client } from '$lib/lemmy.svelte'
  import { searchParam } from '$lib/util.svelte.js'
  import { Button, Material, Select, Spinner, toast } from 'mono-svelte'
  import Option from 'mono-svelte/forms/select/Option.svelte'
  import { tick } from 'svelte'
  import { Check, Funnel, Icon, ShieldCheck, XMark } from 'svelte-hero-icons'
  import Report from './Report.svelte'

  let { data = $bindable() } = $props()

  let batch = $state({
    progress: -1,
  })
  async function markAllAsResolved() {
    if (!data.items?.value) return
    batch.progress = 0

    await Promise.all(
      data.items?.value.map(report => {
        report.map(r => {
          switch (r.type) {
            case 'comment': {
              const promise = client().resolveCommentReport({
                report_id: r.id,
                resolved: true,
              })
              promise.then(
                () => (batch.progress += 1 / data.items?.value!.length),
              )
              return promise
            }
            case 'post': {
              const promise = client().resolvePostReport({
                report_id: r.id,
                resolved: true,
              })
              promise.then(
                () => (batch.progress += 1 / data.items?.value!.length),
              )
              return promise
            }
            case 'message': {
              const promise = client().resolvePrivateMessageReport({
                report_id: r.id,
                resolved: true,
              })
              promise.then(
                () => (batch.progress += 1 / data.items?.value!.length),
              )
              return promise
            }
          }
        })
      }),
    )

    toast({ content: $t('routes.moderation.markAllComplete'), type: 'success' })
    await goto(page.url, { invalidateAll: true })

    batch.progress = -1
  }
</script>

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
        disabled={batch.progress >= 0 || data.items.value?.length == 0}
        onclick={markAllAsResolved}
        class="h-max ml-auto"
        rounding="pill"
        color="primary"
      >
        <Icon src={Check} size="16" mini />
        {$t('routes.moderation.markAll')}
      </Button>
    </div>
    {#if data.filters.community}
      <ul class="font-normal flex flex-col gap-2 mt-2">
        <li>
          <span class="text-sm text-slate-600 dark:text-zinc-400">
            {$t('form.post.community')}
          </span>
          {#await client().getCommunity({ id: data.filters.community })}
            <Spinner width={24} />
          {:then community}
            <a
              class="inline"
              aria-label={$t('common.remove')}
              href="?community="
            >
              <Icon src={XMark} size="16" micro class="inline" />
            </a>
            <CommunityLink
              class="w-max inline"
              community={community.community_view.community}
            />
          {/await}
        </li>
      </ul>
    {/if}
  {/snippet}
</Header>
{#if batch.progress > 0}
  <ProgressBar progress={batch.progress} />
{/if}
{#if data.items?.value && data.items?.value.length > 0}
  <CommonList items={data.items?.value} size="lg">
    {#snippet item(item)}
      <Material
        rounding={item.length == 1 ? 'none' : '2xl'}
        color={item.length == 1 ? 'none' : 'uniform'}
        padding={item.length == 1 ? 'none' : 'md'}
        class={['space-y-2 w-full']}
      >
        <Report {item} />
      </Material>
      {#if item.length > 1}
        <Material
          padding="none"
          rounding="none"
          color="uniform"
          class="-mt-3 rounded-b-2xl w-[95%] h-4 bg-slate-50! dark:bg-zinc-950!"
        ></Material>
      {/if}
    {/snippet}
  </CommonList>
  <Pageination
    page={data.page}
    href={current => `?page=${current}`}
    hasMore={data.items.value.length >= 20}
  />
{:else}
  <div class="h-full grid place-items-center">
    <Placeholder
      icon={ShieldCheck}
      title={$t('routes.moderation.empty.title')}
      description={$t('routes.moderation.empty.description')}
    />
  </div>
{/if}
