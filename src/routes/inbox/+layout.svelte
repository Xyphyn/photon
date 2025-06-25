<script lang=ts>
  import { notifications, profile } from '$lib/auth.svelte'
  import Tabs from '$lib/components/ui/layout/pages/Tabs.svelte'
  import {} from '$lib/components/ui/layout/Shell.svelte'
  import { t } from '$lib/i18n/translations'
  import { Badge } from 'mono-svelte'
  import { goto } from '$app/navigation'
  import { page } from '$app/state'
  import Header from '$lib/components/ui/layout/pages/Header.svelte'
  import Pageination from '$lib/components/ui/Pageination.svelte'
  import Placeholder from '$lib/components/ui/Placeholder.svelte'
  import { getClient } from '$lib/lemmy.svelte.js'
  import { Button } from 'mono-svelte'
  import { ArrowPath, Check, Icon, Inbox } from 'svelte-hero-icons'
  import { expoOut } from 'svelte/easing'
  import { fly } from 'svelte/transition'


  function addSearchParam(
    currentSearchParams: URLSearchParams,
    newParamString: string,
  ) {
    // Create a new URLSearchParams object from the current search params
    const updatedParams = new URLSearchParams(currentSearchParams)

    // Parse the new parameter string
    const newParam = new URLSearchParams(newParamString)

    // Get the key and value of the new parameter
    const [key, value]: [string, string] = newParam.entries().next().value!

    // Add the new parameter to the updated params
    updatedParams.set(key, value)

    return updatedParams
  }

  /**
   * @typedef {Object} Props
   * @property {import('svelte').Snippet} [children]
   */

  /** @type {Props} */
  let { children } = $props()
</script>

<div class=" gap-2">
  <div
    class="mt-4 mb-2 z-30 mx-auto max-w-full flex gap-2 md:flex-row flex-col
items-center px-2 w-max top-6 lg:top-22"
  >
    <Tabs
      tabs={[
        {
          pathname: '/inbox',
          search: { name: 'type', value: 'all', isDefault: true},
          name: $t('filter.location.all'),
        },
        {
          pathname: '/inbox',
          search: { name: 'type', value: 'replies'},
          name: $t('filter.inbox.replies'),
        },
        {
          pathname: '/inbox',
          search: { name: 'type', value: 'mentions'},
          name: $t('filter.inbox.mentions'),
        },
        {
          pathname: '/inbox/messages',
          name: $t('filter.inbox.messages'),
        },
      ]}
      currentRoute={page.url.search}
      defaultRoute="?type=all"
      class="overflow-auto"
    />
    <!--
      //buildUrl={(tab) =>
      //  href.includes('?')
      //    ? '?' + addSearchParam(page.url.searchParams, href).toString()
      //    : `${href}${page.url.search}`}-->
    <Tabs
      tabs={[
        {
          search: { name: 'unreadOnly', value: 'false'},
          name: $t('filter.location.all'),
        },
        {
          search: { name: 'unreadOnly', value: 'true'},
          name: $t('filter.unread'),
        },
      ]}
      currentRoute={page.url.search}
      defaultRoute="?unreadOnly=true"
      class="overflow-auto"
    />
    <!--
      buildUrl={(route, href) =>
        '?' + addSearchParam(page.url.searchParams, href).toString()}-->
  </div>
</div>

{@render children?.()}
