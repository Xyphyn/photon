<script lang="ts">
  import { page } from '$app/state'
  import Tabs from '$lib/components/ui/layout/pages/Tabs.svelte'
  interface Props {
    children?: import('svelte').Snippet
  }

  let { children }: Props = $props()
</script>

<div class="flex flex-col gap-2">
  <Tabs
    routes={[
      {
        href: '/util',
        name: 'Home',
      },
      {
        href: '/util/instance',
        name: 'Photon instance',
      },
      {
        href: '/util/photonify',
        name: 'Photonify Links',
      },
      {
        href: '/util/placeholder',
        name: 'Placeholders',
      },
      {
        href: '/util/constants',
        name: 'Constants',
      },
      {
        href: '/functions',
        name: 'Functions',
      },
    ]}
    class="overflow-auto"
  />
  {@render children?.()}
</div>
