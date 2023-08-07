<script lang="ts">
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import Button from '$lib/components/input/Button.svelte'
  import UserLink from '$lib/components/lemmy/user/UserLink.svelte'
  import Card from '$lib/components/ui/Card.svelte'
  import Pageination from '$lib/components/ui/Pageination.svelte'
  import Placeholder from '$lib/components/ui/Placeholder.svelte'
  import SectionTitle from '$lib/components/ui/SectionTitle.svelte'
  import { searchParam } from '$lib/util.js'
  import { ClipboardDocumentCheck, Icon } from 'svelte-hero-icons'
  import Application from './Application.svelte'
  import MultiSelect from '$lib/components/input/MultiSelect.svelte'

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
  <div class="flex flex-col divide-y divide-slate-200 dark:divide-zinc-900">
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
  <Placeholder>
    <Icon src={ClipboardDocumentCheck} size="32" slot="icon" />
    <span slot="title">No applications</span>
    <span slot="description">You're all caught up for now.</span>
  </Placeholder>
{/if}
