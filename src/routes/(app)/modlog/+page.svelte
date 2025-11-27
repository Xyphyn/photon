<script lang="ts">
  import { browser } from '$app/environment'
  import { page } from '$app/state'
  import { client } from '$lib/api/client.svelte'
  import { profile } from '$lib/app/auth.svelte'
  import { t } from '$lib/app/i18n'
  import { settings } from '$lib/app/settings.svelte'
  import { searchParam } from '$lib/app/util.svelte'
  import CommunityLink from '$lib/feature/community/CommunityLink.svelte'
  import { postLink } from '$lib/feature/post'
  import UserAutocomplete from '$lib/feature/user/UserAutocomplete.svelte'
  import UserLink from '$lib/feature/user/UserLink.svelte'
  import ObjectAutocomplete from '$lib/ui/form/ObjectAutocomplete.svelte'
  import Placeholder from '$lib/ui/info/Placeholder.svelte'
  import { Header, Pageination } from '$lib/ui/layout'
  import { Button, Option, Select, Spinner } from 'mono-svelte'
  import {
    Bars3BottomRight,
    Icon,
    MagnifyingGlass,
    ViewColumns,
    XMark,
  } from 'svelte-hero-icons/dist'
  import ModlogItemCard from './item/ModlogItemCard.svelte'
  import ModlogItemTable from './item/ModlogItemTable.svelte'

  let { data = $bindable() } = $props()

  let view = $state(
    `${
      (settings.value.modlogCardView ?? browser)
        ? !window.matchMedia('(min-width: 1600px)').matches
        : false
    }`,
  )

  $effect(() => {
    settings.value.modlogCardView =
      view == 'true' ? true : view == 'false' ? false : undefined
  })
</script>

<svelte:head>
  <title>{$t('routes.modlog.title')}</title>
</svelte:head>

<div class="flex flex-col gap-4">
  <Header pageHeader>
    {$t('routes.modlog.title')}
    {#snippet extended()}
      <span class="font-medium text-lg">{$t('routes.modlog.filters')}</span>
      <ul class="font-normal flex flex-col gap-2 mt-2">
        {#if data.params.community}
          <li>
            <div class="text-sm text-slate-600 dark:text-zinc-400">
              {$t('form.post.community')}
            </div>
            {#await client().getCommunity({ id: data.params.community })}
              <Spinner width={24} />
            {:then community}
              <CommunityLink community={community.community_view.community} />
            {/await}
          </li>
        {/if}
        {#if data.params.user}
          <li>
            <div class="text-sm text-slate-600 dark:text-zinc-400">
              {$t('routes.admin.applications.user')}
            </div>
            {#await client().getPersonDetails( { person_id: data.params.user, limit: 1 }, )}
              <Spinner width={24} />
            {:then person}
              <UserLink class="inline" user={person.person_view.person} />
            {/await}
          </li>
        {/if}
        {#if data.params.moderator}
          <li>
            <div class="text-sm text-slate-600 dark:text-zinc-400">
              <!--TODO add translation key-->
              Moderator
            </div>
            {#await client().getPersonDetails( { person_id: data.params.moderator, limit: 1 }, )}
              <Spinner width={24} />
            {:then person}
              <UserLink class="inline" user={person.person_view.person} />
            {/await}
          </li>
        {/if}
        {#if data.params.post}
          <li>
            <div class="text-sm text-slate-600 dark:text-zinc-400">
              {$t('nav.create.post')}
            </div>
            {#await client().getPost({ id: data.params.post })}
              <Spinner width={24} />
            {:then post}
              <a
                class="hover:underline block"
                href={postLink(post.post_view.post)}
              >
                {post.post_view.post.name}
              </a>
            {/await}
          </li>
        {/if}
        {#if data.params.comment}
          <li>
            <div class="text-sm text-slate-600 dark:text-zinc-400">
              {$t('moderation.removeSubmission.comment')}
            </div>
            {#await client().getComment({ id: data.params.comment })}
              <Spinner width={24} />
            {:then comment}
              <a
                class="hover:underline block"
                href="/comment/{data.params.comment}"
              >
                {comment.comment_view.comment.content.slice(1, 200)}...
              </a>
            {/await}
          </li>
        {/if}
      </ul>
    {/snippet}
  </Header>
  <div class="flex flex-row flex-wrap gap-2">
    <Select
      bind:value={data.type}
      onchange={() => searchParam(page.url, 'type', data.type, 'page')}
      class="w-48"
    >
      {#snippet customLabel()}
        <span class="flex gap-1 items-center">
          <Icon src={Bars3BottomRight} size="15" mini />
          Type
        </span>
      {/snippet}
      <Option value="All">All</Option>
      <Option value="ModRemovePost">Remove post</Option>
      <Option value="ModLockPost">Lock post</Option>
      <Option value="ModFeaturePost">Feature post</Option>
      <Option value="ModRemoveComment">Remove comment</Option>
      <Option value="ModRemoveCommunity">Remove community</Option>
      <Option value="ModBanFromCommunity">Ban from community</Option>
      <Option value="ModAddCommunity">Add moderator</Option>
      <Option value="ModTransferCommunity">Transfer community</Option>
      <Option value="ModAdd">Add admin</Option>
      <Option value="ModBan">Ban admin</Option>
      <Option value="ModHideCommunity">Hide community</Option>
      <Option value="AdminPurgePerson">Purge user</Option>
      <Option value="AdminPurgeCommunity">Purge community</Option>
      <Option value="AdminPurgePost">Purge post</Option>
      <Option value="AdminPurgeComment">Purge comment</Option>
    </Select>

    <Select bind:value={view} class="w-36">
      {#snippet customLabel()}
        <span class="flex gap-1 items-center">
          <Icon src={ViewColumns} size="15" mini />
          View
        </span>
      {/snippet}
      <Option value="false">Table</Option>
      <Option value="true">Cards</Option>
      <Option value="undefined">Default</Option>
    </Select>
  </div>
  <div class="flex flex-col md:flex-row md:items-center gap-2 w-full">
    <ObjectAutocomplete
      placeholder="Filter by community"
      listing_type="All"
      showWhenEmpty={true}
      label="Community"
      q={page.url.searchParams.get('community') ? 'Selected' : ''}
      onselect={(e) =>
        searchParam(
          page.url,
          'community',
          e?.community.id.toString() ?? '',
          'page',
        )}
    />
    <UserAutocomplete
      instance={page.url.searchParams.get('instance') || undefined}
      placeholder="Filter by user"
      listing_type="All"
      showWhenEmpty={true}
      label="User"
      q={page.url.searchParams.get('user')
        ? (data.filters.user ?? 'Selected')
        : ''}
      onselect={(e) =>
        searchParam(page.url, 'user', e?.id.toString() ?? '', 'page')}
    />
    {#if profile.isAdmin}
      <UserAutocomplete
        placeholder="Filter by moderator"
        listing_type="All"
        showWhenEmpty={true}
        label="Moderator"
        q={page.url.searchParams.get('mod_id')
          ? (data.filters.moderator ?? 'Selected')
          : ''}
        onselect={(e) =>
          searchParam(page.url, 'mod_id', e?.id.toString() ?? '', 'page')}
      />
    {/if}
    <Button
      onclick={() => {
        searchParam(
          page.url,
          '',
          '',
          'user',
          'moderator',
          'community',
          'instance',
        )
      }}
      size="custom"
      class="self-end shrink-0 h-8.5 aspect-square"
      title="Clear filters"
    >
      <Icon src={XMark} size="16" mini />
    </Button>
  </div>
  {#if data.modlog && data.modlog.length > 0}
    {#if settings.value.modlogCardView ?? !window.matchMedia('(min-width: 1600px)').matches}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        {#each data.modlog as modlog (modlog)}
          <ModlogItemCard item={modlog} />
        {/each}
      </div>
    {:else}
      <div style="width:100%; overflow-x: auto;" class="table-container">
        <table
          class="table overflow-x-auto table-fixed relative w-full min-w-2xl"
        >
          <colgroup>
            <col style="width: 10.6%;" />
            <col style="width: 16.6%;" />
            <col style="width: 16.6%;" />
            <col style="width: 16.6%;" />
            <col style="width: 16.6%;" />
            <col style="width: 16.6%;" />
          </colgroup>
          <thead class="text-left">
            <tr class="rounded-t-lg overflow-hidden">
              <th>Time</th>
              <th>Moderator</th>
              <th>Community</th>
              <th>Action</th>
              <th>Reason</th>
              <th align="right">Content</th>
            </tr>
          </thead>
          <tbody class="text-sm divide-y divide-slate-200 dark:divide-zinc-800">
            {#each data.modlog as modlog (modlog)}
              <ModlogItemTable item={modlog} />
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
    <Pageination
      page={data.page}
      hasMore={data.params.hasMore}
      href={(page) => `?page=${page}`}
    />
  {:else}
    <Placeholder
      title="No results"
      description="There are no mod logs with that filter. Try refining your search."
      icon={MagnifyingGlass}
    />
  {/if}
</div>

<style>
  @reference '../../app.css';

  .table-container {
    border: 1px solid var(--color-slate-200);
    background-color: white;
    border-radius: var(--radius-2xl);

    @variant dark {
      background-color: var(--color-zinc-950);
      border: 1px solid var(--color-zinc-800);
    }
  }

  .table {
    table-layout: fixed !important;

    thead {
      tr {
        th {
          padding: calc(var(--spacing) * 3);
          border-bottom: 1px solid var(--color-slate-200);
          font-weight: var(--font-weight-medium);
          font-size: var(--text-sm);
          background-color: var(--color-slate-25);

          @variant dark {
            background-color: var(--color-zinc-900);
            border-bottom: 1px solid var(--color-zinc-800);
          }
        }
      }
    }
  }

  .table tbody {
    font-size: var(--text-xs);
    :global(tr td) {
      padding: calc(var(--spacing) * 1) calc(var(--spacing) * 3);
    }
  }
</style>
