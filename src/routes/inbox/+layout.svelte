<script lang="ts">
  import Tabs from '$lib/components/ui/layout/pages/Tabs.svelte'
  import { t } from '$lib/i18n/translations'

  let { children } = $props()
</script>

<Tabs
  routes={[
    {
      href: '/inbox',
      name: $t('filter.location.all'),
    },
    {
      href: '/inbox?type=replies',
      name: $t('filter.inbox.replies'),
    },
    {
      href: '/inbox?type=mentions',
      name: $t('filter.inbox.mentions'),
    },
    {
      href: '/inbox/messages',
      name: $t('filter.inbox.messages'),
    },
  ]}
  class="overflow-auto"
/>
{@render children?.()}
