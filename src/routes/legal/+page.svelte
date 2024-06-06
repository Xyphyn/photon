<script lang="ts">
  import SiteCard from '$lib/components/lemmy/SiteCard.svelte'
  import Markdown from '$lib/components/markdown/Markdown.svelte'
  import Header from '$lib/components/ui/layout/pages/Header.svelte'
  import { site } from '$lib/lemmy'
  import { t } from '$lib/translations'
  import { Button, Modal, Spinner } from 'mono-svelte'

  let siteOpen: boolean = false
</script>

<div class="flex flex-row w-full">
  {#if $site}
    <div class="flex flex-col flex-1 gap-4">
      <Header>{$t('routes.legal.title')}</Header>
      <Markdown
        source={$site.site_view.local_site.legal_information ??
          $t('routes.legal.noLegal')}
      />
    </div>
  {:else}
    <Spinner />
  {/if}
</div>
