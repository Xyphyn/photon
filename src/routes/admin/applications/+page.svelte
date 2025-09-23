<script lang="ts">
  import { Header } from '$comp/ui/layout'
  import Pageination from '$comp/ui/layout/Pageination.svelte'
  import Placeholder from '$comp/ui/Placeholder.svelte'
  import { t } from '$lib/i18n/translations'
  import { Option, Select } from 'mono-svelte'
  import { ClipboardDocumentCheck } from 'svelte-hero-icons'
  import Application from './Application.svelte'

  let { data } = $props()

  let selectForm = $state<HTMLFormElement>()
</script>

<Header pageHeader>{$t('routes.admin.applications.title')}</Header>
<form bind:this={selectForm} action="/admin/applications" class="w-max">
  <Select
    name="unreadOnly"
    onchange={() => selectForm?.requestSubmit?.()}
    label={$t('filter.filter')}
  >
    <Option value="false">{$t('filter.location.all')}</Option>
    <Option value="true">{$t('filter.unread')}</Option>
  </Select>
</form>
{#if data.applications?.value && data.applications?.value.length > 0}
  <div class="flex flex-col gap-4">
    {#each data.applications?.value as application (application.registration_application.id)}
      <Application {application} />
    {/each}
  </div>
  {#if data.applications?.value.length >= 40}
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
