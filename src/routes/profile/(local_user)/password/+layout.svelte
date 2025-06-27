<script>
  import { t } from '$lib/i18n/translations'

  import { page } from '$app/state'
  import Header from '$lib/components/ui/layout/pages/Header.svelte'
  import Tabs from '$lib/components/ui/layout/pages/Tabs.svelte'
  import { Modal } from 'mono-svelte'
  import ChangePassword from './change/+page.svelte'
  import DeleteAccount from './delete/+page.svelte'
  import { goto } from '$app/navigation'

  /**
   * @typedef {Object} Props
   * @property {import('svelte').Snippet} [children]
   */

  /** @type {Props} */
  let { children } = $props()

  let changePassword = $state(false)
  let deleteAccount = $state(false)

  const routes = [
    {
      name: $t('form.profile.2fa.2fa'),
      href: '/profile/password/2fa',
    },
    {
      name: $t('routes.passwordChange.title'),
      onclick: () => {
        goto('/profile/password')
        changePassword = !changePassword
      },
    },
    {
      name: $t('routes.profile.logins'),
      href: '/profile/password/logins',
    },
    {
      name: $t('routes.profile.delete.title'),
      onclick: () => {
        goto('/profile/password')

        deleteAccount = !deleteAccount
      },
    },
  ]
</script>

<div
  class="sticky mx-auto z-50 max-w-full min-w-0 flex items-center gap-2 top-6 lg:top-22"
>
  <Tabs routes={[]}>
    {#each routes as route (route.name)}
      <svelte:element
        this={route.onclick ? 'button' : 'a'}
        role={route.onclick ? 'button' : 'link'}
        onclick={route.onclick}
        href={route.href}
        class="font-medium rounded-full px-4 py-1 hover:bg-slate-200/40 dark:hover:bg-zinc-700/40
      transition-colors duration-100 relative z-0 shrink-0 cursor-pointer"
      >
        {route.name}
        {#if page.url.pathname == route.href}
          <div
            class="rounded-full bg-slate-100/60 dark:bg-zinc-700/60
          absolute inset-0 w-full h-full -z-10"
          ></div>
        {/if}
      </svelte:element>
    {/each}
  </Tabs>
</div>
<Header pageHeader class="">
  {routes.find(r => page.url.pathname == r.href)?.name ??
    $t('routes.profile.credentials')}
</Header>
<div
  class="flex-3 max-w-full w-full min-w-0 h-full flex flex-col items-center justify-center"
>
  {@render children?.()}
</div>
<Modal
  bind:open={changePassword}
  dismissable={false}
  title={$t('routes.passwordChange.title')}
>
  <ChangePassword />
</Modal>

<Modal
  bind:open={deleteAccount}
  dismissable={false}
  title={$t('form.profile.deleteAccount.label')}
>
  <DeleteAccount />
</Modal>
