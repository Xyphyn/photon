<script lang="ts">
  import { page } from '$app/state'
  import Tabs from '$lib/components/ui/layout/pages/Tabs.svelte'
  import { t } from '$lib/i18n/translations'
  import { SvelteURLSearchParams } from 'svelte/reactivity'

  let { children } = $props()

  function addSearchParam(
    currentSearchParams: URLSearchParams,
    newParamString: string,
  ) {
    const updatedParams = new SvelteURLSearchParams(currentSearchParams)
    const newParam = new SvelteURLSearchParams(newParamString)
    const [key, value]: [string, string] = newParam.entries().next().value!
    updatedParams.set(key, value)
    return updatedParams
  }
</script>

<div
  class="mt-4 mb-2 z-30 mx-auto max-w-full flex gap-2 md:flex-row flex-col
items-center px-2 w-max top-6 lg:top-22"
>
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
</div>
{@render children?.()}
