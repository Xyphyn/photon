<script lang="ts">
  import { t } from '$lib/app/i18n'
  import { proxify } from '$lib/app/util/reactivity.svelte'
  import Placeholder from '$lib/ui/info/Placeholder.svelte'
  import { CommonList, Header, Pageination } from '$lib/ui/layout'
  import { Option, Select } from 'mono-svelte'
  import { ClipboardDocumentCheck, Funnel, Icon } from 'svelte-hero-icons/dist'
  import Application from './Application.svelte'

  let { data } = $props()

  let selectForm = $state<HTMLFormElement>()
  let params = $derived(proxify(data.params))
  let applications = $derived(proxify(data.applications))
</script>

<Header pageHeader>{$t('routes.admin.applications.title')}</Header>
<form bind:this={selectForm} action="/admin/applications" class="w-max">
  <Select name="type" bind:value={params.type} onchange={() => selectForm?.requestSubmit()}>
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
      <li class={application.creator_local_user.accepted_application ? 'material-success' : ''}>
        <Application {application} />
      </li>
    {/each}
  </CommonList>
  {#if params.next != null}
    <div class="mt-auto">
      <Pageination
        cursor={{
          next: params.next,
          back: params.prev,
        }}
        href={(cursor) => `?cursor=${cursor}`}
      />
    </div>
  {/if}
{:else}
  <Placeholder
    icon={ClipboardDocumentCheck}
    title={$t('routes.admin.applications.empty.title')}
    description={$t('routes.admin.applications.empty.description')}
  />
{/if}
