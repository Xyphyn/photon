<script lang="ts">
  import { page } from '$app/stores'
  import Pageination from '$lib/components/ui/Pageination.svelte'
  import Placeholder from '$lib/components/ui/Placeholder.svelte'
  import { searchParam } from '$lib/util.js'
  import { ClipboardDocumentCheck, Icon } from 'svelte-hero-icons'
  import Application from './Application.svelte'
  import MultiSelect from '$lib/components/input/Switch.svelte'

  export let data
</script>

<h1 class="font-bold text-2xl">Applications</h1>
<MultiSelect
  options={[false, true]}
  selected={data.unreadOnly ?? true}
  optionNames={['All', 'Unread']}
  on:select={(e) =>
    searchParam($page.url, 'unreadOnly', e.detail.toString(), 'page')}
/>
{#if data.applications && data.applications.length > 0}
  <div class="flex flex-col gap-4">
    {#each data.applications as application (application.registration_application.id)}
      <Application {application} />
    {/each}
  </div>
  {#if data.applications.length >= 40}
    <div class="mt-auto">
      <Pageination
        page={data.page}
        on:change={(p) => searchParam($page.url, 'page', p.detail.toString())}
      />
    </div>
  {/if}
{:else}
  <Placeholder
    icon={ClipboardDocumentCheck}
    title="No new applications"
    description="Applications to join your instance will appear here."
  />
{/if}
