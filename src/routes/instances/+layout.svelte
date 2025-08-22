<script lang="ts">
  import Header from '$lib/components/ui/layout/pages/Header.svelte'
  import Tabs from '$lib/components/ui/layout/pages/Tabs.svelte'

  let { children } = $props()
</script>

<Header pageHeader>Instances</Header>
<div
  class="mt-4 mb-2 z-30 mx-auto max-w-full flex gap-2 md:flex-row flex-col
items-center px-2 w-max top-6 lg:top-22"
>
  <Tabs
    routes={[
      {
        href: '/instances/linked',
        name: 'Linked',
      },
      { href: '/instances/blocked', name: 'Blocked' },
    ]}
  ></Tabs>
</div>
<div class="h-3 sm:h-6"></div>
{@render children?.()}
