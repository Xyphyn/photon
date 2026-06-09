<script lang="ts">
  import { goto } from '$app/navigation'
  import { page } from '$app/state'
  import { client } from '$lib/api/client.svelte'
  import { t } from '$lib/app/i18n'
  import { searchParam } from '$lib/app/util.svelte'
  import { proxify } from '$lib/app/util/reactivity.svelte'
  import CommunityLink from '$lib/feature/community/CommunityLink.svelte'
  import { Listing } from '$lib/feature/feeds/listing.svelte'
  import Fixate from '$lib/ui/generic/Fixate.svelte'
  import Placeholder from '$lib/ui/info/Placeholder.svelte'
  import ProgressBar from '$lib/ui/info/ProgressBar.svelte'
  import { CommonList, Header, Pageination } from '$lib/ui/layout'
  import { Button, Option, Select, Spinner, toast } from 'mono-svelte'
  import { Check, Funnel, Icon, ShieldCheck, XMark } from 'svelte-hero-icons/dist'
  import Report from './Report.svelte'

  let { data = $bindable() } = $props()

  let listing = $derived(new Listing(data.items, (i) => i))
  let params = $derived(proxify(data.params))

  let batch = $state({
    progress: -1,
  })

  async function markAllAsResolved() {
    if (!listing.items) return
    batch.progress = 0

    await Promise.all(
      listing.items.map((r) => {
        switch (r.type_) {
          case 'comment': {
            const promise = client().resolveCommentReport({
              report_id: r.comment_report.id,
              resolved: true,
            })
            promise.then(() => (batch.progress += 1 / listing.items.length))
            return promise
          }
          case 'post': {
            const promise = client().resolvePostReport({
              report_id: r.post_report.id,
              resolved: true,
            })
            promise.then(() => (batch.progress += 1 / listing.items.length))
            return promise
          }
          case 'private_message': {
            const promise = client().resolvePrivateMessageReport({
              report_id: r.private_message_report.id,
              resolved: true,
            })
            promise.then(() => (batch.progress += 1 / listing.items.length))
            return promise
          }
          case 'community': {
            const promise = client().resolveCommunityReport({
              report_id: r.community_report.id,
              resolved: true,
            })
            promise.then(() => (batch.progress += 1 / listing.items.length))
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

<Header pageHeader>
  {$t('routes.moderation.title')}
  {#snippet extended()}
    <div class="flex flex-row gap-2 flex-wrap items-end tracking-normal">
      <Select
        bind:value={() => params.unreadOnly.toString(), (v) => (params.unreadOnly = v == 'false')}
        onchange={() => searchParam(page.url, 'unreadOnly', params.unreadOnly.toString(), 'page')}
      >
        {#snippet customLabel()}
          <span class="flex items-center gap-1">
            <Icon src={Funnel} size="15" mini />
            {$t('filter.filter')}
          </span>
        {/snippet}
        <Option value="false">{$t('filter.location.all')}</Option>
        <Option value="true">{$t('filter.unread')}</Option>
      </Select>
      <Button
        loading={batch.progress >= 0}
        disabled={batch.progress >= 0 || listing.items.length == 0}
        onclick={markAllAsResolved}
        size="lg"
        class="ml-auto"
        color="primary"
      >
        <Icon src={Check} size="16" mini />
        {$t('routes.moderation.markAll')}
      </Button>
    </div>
    {#if params.community}
      <ul class="font-normal flex flex-col gap-2 mt-2">
        <li>
          <span class="text-sm text-slate-600 dark:text-zinc-400">
            {$t('form.post.community')}
          </span>
          {#await client().getCommunity({ id: params.community })}
            <Spinner width={24} />
          {:then community}
            <a class="inline" aria-label={$t('common.remove')} href="?community=">
              <Icon src={XMark} size="16" micro class="inline" />
            </a>
            <CommunityLink class="w-max inline" community={community.community_view.community} />
          {/await}
        </li>
      </ul>
    {/if}
  {/snippet}
</Header>
{#if batch.progress > 0}
  <ProgressBar progress={batch.progress} />
{/if}
{#if listing.items && listing.items.length > 0}
  <CommonList size="lg">
    {#each listing.items ?? [] as item}
      <li class="z-0 relative space-y-2 w-full">
        <Report {item} />
      </li>
    {/each}
  </CommonList>
  {#if params.next != null && params.prev != null}
    <Fixate placement="bottom">
      <Pageination
        cursor={{
          next: params.next,
          back: params.prev,
        }}
        href={(cursor) => `?cursor=${cursor}`}
        hasMore={params.next != null}
      />
    </Fixate>
  {/if}
{:else}
  <div class="h-full grid place-items-center">
    <Placeholder
      icon={ShieldCheck}
      title={$t('routes.moderation.empty.title')}
      description={$t('routes.moderation.empty.description')}
    />
  </div>
{/if}
