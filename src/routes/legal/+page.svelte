<script lang="ts">
  import Markdown from '$comp/markdown/Markdown.svelte'
  import { Header } from '$comp/ui/layout'
  import { t } from '$lib/i18n/translations'
  import { site } from '$lib/client/lemmy.svelte'
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
