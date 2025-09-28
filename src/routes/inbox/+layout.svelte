<script lang="ts">
  import { t } from '$lib/app/i18n'
  import { Tabs } from '$lib/ui/layout'

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
