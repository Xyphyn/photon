<script lang="ts">
  import { site } from '$lib/api/client.svelte'
  import { profile } from '$lib/app/auth'
  import { t } from '$lib/app/i18n'
  import { Header, Tabs } from '$lib/ui/layout'

  let { children } = $props()
</script>

{#if !site || !(site.data?.site_view.local_site.community_creation_admin_only && !profile.isAdmin)}
  <Tabs
    margin={false}
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

<Header pageHeader>
  {$t('nav.create.label')}
</Header>

{@render children?.()}
