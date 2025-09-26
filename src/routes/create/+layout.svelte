<script lang="ts">
  import { site } from '$lib/api/client.svelte'
  import { t } from '$lib/app/i18n'
  import { Header, Tabs } from '$lib/ui/layout'

  let { children } = $props()
</script>

<Header pageHeader>
  {$t('nav.create.label')}
  {#snippet extended()}
    {#if !site || !site.data?.site_view.local_site.community_creation_admin_only}
      <Tabs
        margin={false}
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
  {/snippet}
</Header>

{@render children?.()}
