<script lang="ts">
  import { page } from '$app/state'
  import { t } from '$lib/app/i18n'
  import { searchParam } from '$lib/app/util.svelte'
  import Placeholder from '$lib/ui/info/Placeholder.svelte'
  import { CommonList, Header, Pageination } from '$lib/ui/layout'
  import { Option, Select } from 'mono-svelte'
  import { ClipboardDocumentCheck, Funnel, Icon } from 'svelte-hero-icons/dist'
  import Application from './Application.svelte'

  import { proxify } from '$lib/app/util/reactivity.svelte'

  let { data } = $props()

  let selectForm = $state<HTMLFormElement>()
  let params = $derived(proxify({ type: data.type }))
  let applications = $derived(proxify(data.applications))
</script>

<Header pageHeader>{$t('routes.admin.applications.title')}</Header>
<form bind:this={selectForm} action="/admin/applications" class="w-max">
  <Select
    bind:value={params.type}
    onchange={async () => {
      searchParam(page.url, 'type', params.type, 'page')
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
</form>
{#if applications && applications.length > 0}
  <CommonList>
    {#each applications as application (application.registration_application.id)}
      <li
        class={application.creator_local_user.accepted_application
          ? 'material-success'
          : 'material-error'}
      >
        <Application {application} />
      </li>
    {/each}
  </CommonList>
  {#if applications.length >= 40}
    <div class="mt-auto">
      <Pageination page={data.page} href={(page) => `?page=${page}`} />
    </div>
  {/if}
{:else}
  <Placeholder
    icon={ClipboardDocumentCheck}
    title={$t('routes.admin.applications.empty.title')}
    description={$t('routes.admin.applications.empty.description')}
  />
{/if}
