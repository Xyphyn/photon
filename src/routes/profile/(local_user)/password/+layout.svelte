<script>
  import { t } from '$lib/i18n/translations'

  import { page } from '$app/state'
  import Header from '$lib/components/ui/layout/pages/Header.svelte'
  import Tabs from '$lib/components/ui/layout/pages/Tabs.svelte'
  /**
   * @typedef {Object} Props
   * @property {import('svelte').Snippet} [children]
   */

  /** @type {Props} */
  let { children } = $props()

  const routes = [
    {
      name: $t('form.profile.2fa.2fa'),
      href: '/profile/password/2fa',
    },
    {
      name: $t('routes.passwordChange.title'),
      href: '/profile/password/change',
    },
    {
      name: $t('routes.profile.logins'),
      href: '/profile/password/logins',
    },
    {
      name: $t('routes.profile.delete.title'),
      href: '/profile/password/delete',
    },
  ]
</script>

<Header pageHeader>
  {routes.find(r => page.url.pathname == r.href)?.name ??
    $t('routes.profile.credentials')}
  {#snippet extended()}
    <Tabs style="subpage" margin={false} {routes}></Tabs>
  {/snippet}
</Header>

<div
  class={[
    page.url.pathname == '/profile/password' && ' p-8',
    'flex flex-col justify-center items-center h-full',
  ]}
>
  {@render children?.()}
</div>
