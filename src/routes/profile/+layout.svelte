<script>
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'

  import MultiSelect from '$lib/components/input/Switch.svelte'
  import Tabs from '$lib/components/ui/layout/pages/Tabs.svelte'
  import { contentPadding } from '$lib/components/ui/layout/Shell.svelte'
  import { t } from '$lib/translations'
</script>

<svelte:head>
  <title>{$t('profile.profile')}</title>
</svelte:head>

<div class="flex flex-col gap-4 h-full z-0">
  <div
    class="sticky mx-auto z-50 max-w-full"
    style="top: max(1.5rem, {$contentPadding.top}px);"
  >
    <Tabs
      routes={[
        {
          href: '/profile/user',
          name: $t('routes.profile.user'),
        },

        {
          href: '/profile/settings',
          name: $t('routes.profile.settings'),
        },

        {
          href: '/profile/blocks',
          name: $t('routes.profile.blocks'),
        },

        {
          href: '/profile/password',
          name: $t('routes.profile.credentials'),
        },
      ]}
    />
  </div>
  <slot />
</div>
