<script lang="ts">
  import SiteCard from '$lib/components/lemmy/SiteCard.svelte'
  import Markdown from '$lib/components/markdown/Markdown.svelte'
  import { site } from '$lib/lemmy'
  import { Button, Modal, Spinner } from 'mono-svelte'

  export let data

  let siteOpen: boolean = false
</script>

<div class="flex flex-row w-full">
  {#if data.site}
    <Modal bind:open={siteOpen}>
      <SiteCard
        site={data.site.site_view}
        admins={data.site.admins}
        taglines={data.site.taglines}
      />
    </Modal>

    <div class="flex flex-col flex-1 gap-4">
      <h1 class="font-bold text-2xl w-full flex items-center justify-between">
        Legal <span class="lg:hidden">
          <Button on:click={() => (siteOpen = !siteOpen)}>Site</Button>
        </span>
      </h1>
      <Markdown
        source={data.site.site_view.local_site.legal_information ??
          'This instance does not have any legal information.'}
      />
    </div>
  {:else}
    <Spinner />
  {/if}
</div>
