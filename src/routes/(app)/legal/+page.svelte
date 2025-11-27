<script lang="ts">
  import { site } from '$lib/api/client.svelte'
  import { t } from '$lib/app/i18n'
  import Markdown from '$lib/app/markdown/Markdown.svelte'
  import { Header } from '$lib/ui/layout'
  import { Spinner } from 'mono-svelte'
</script>

<div class="flex flex-row w-full">
  {#if site.data}
    <div class="flex flex-col flex-1 gap-4">
      <Header pageHeader>{$t('routes.legal.title')}</Header>
      <Markdown
        source={site.data.site_view.local_site.legal_information ??
          $t('routes.legal.noLegal')}
      />
    </div>
  {:else}
    <Spinner />
  {/if}
</div>
