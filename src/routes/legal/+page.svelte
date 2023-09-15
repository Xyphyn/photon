<script lang="ts">
  import SiteCard from '$lib/components/lemmy/SiteCard.svelte'
  import Markdown from '$lib/components/markdown/Markdown.svelte'
  import { site } from '$lib/lemmy'
  import { Spinner } from 'mono-svelte'
</script>

<div class="flex flex-row w-full">
  {#if $site}
    <div class="flex flex-col flex-1 gap-4">
      <h1 class="font-bold text-2xl">Legal</h1>
      <Markdown source={$site.site_view.local_site.legal_information} />
    </div>
    <SiteCard
      site={$site.site_view}
      admins={$site.admins}
      taglines={$site.taglines}
    />
  {:else}
    <Spinner />
  {/if}
</div>
