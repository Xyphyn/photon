<script lang="ts">
  import Header from '$lib/components/ui/layout/pages/Header.svelte'
  import Tabs from '$lib/components/ui/layout/pages/Tabs.svelte'

  let { children } = $props()
</script>

<Header pageHeader>Instances</Header>
<Tabs
  routes={[
    {
      href: '/instances/linked',
      name: 'Linked',
    },
    { href: '/instances/blocked', name: 'Blocked' },
  ]}
></Tabs>
<div class="h-3 sm:h-6"></div>
{@render children?.()}
