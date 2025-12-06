<script lang="ts">
  import { t } from '$lib/app/i18n'
  import { Header, Tabs } from '$lib/ui/layout'

  let { children } = $props()
</script>

<Header pageHeader>
  {$t('routes.profile.blocks.title')}

  {#snippet extended()}
    <Tabs
      routes={[
        {
          href: '/profile/blocks/users',
          name: $t('content.users'),
        },
        {
          href: '/profile/blocks/communities',
          name: $t('content.communities'),
        },
        {
          href: '/profile/blocks/instances',
          name: $t('content.instances'),
        },
      ]}
      style="subpage"
      margin={false}
    />
  {/snippet}
</Header>

{@render children?.()}
