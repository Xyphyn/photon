<script lang="ts">
  import { Header } from '$comp/ui/layout'
  import Tabs from '$comp/ui/layout/pages/Tabs.svelte'

  let { children } = $props()
</script>

<Tabs
  routes={[
    {
      href: '/instances/linked',
      name: 'Linked',
    },
    { href: '/instances/blocked', name: 'Blocked' },
  ]}
></Tabs>
<Header pageHeader>Instances</Header>
{@render children?.()}
