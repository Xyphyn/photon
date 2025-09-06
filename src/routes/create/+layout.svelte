<script lang="ts">
  import { site } from '$lib/lemmy.svelte'
  import Header from '$lib/components/ui/layout/pages/Header.svelte'
  import Tabs from '$lib/components/ui/layout/pages/Tabs.svelte'
  import { t } from '$lib/i18n/translations'

  let { children } = $props()
</script>

<Header pageHeader>
  {$t('nav.create.label')}
</Header>

{#if !site || !site.data?.site_view.local_site.community_creation_admin_only}
  <Tabs
    style="subpage"
    routes={[
      {
        href: '/create/post',
        name: $t('nav.create.post'),
      },
      {
        href: '/create/community',
        name: $t('nav.create.community'),
      },
    ]}
  />
{/if}

{@render children?.()}
