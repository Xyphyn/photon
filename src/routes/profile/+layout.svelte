<script>
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'

  import MultiSelect from '$lib/components/input/Switch.svelte'
  import Tabs from '$lib/components/ui/layout/pages/Tabs.svelte'
  import { contentPadding } from '$lib/components/ui/layout/Shell.svelte'
  import { site } from '$lib/lemmy'
  import { t } from '$lib/translations'
  import { feature } from '$lib/version'
  import { Button, Menu, MenuButton } from 'mono-svelte'
  import {
    ArrowDown,
    ArrowUp,
    EllipsisHorizontal,
    Icon,
    Photo,
  } from 'svelte-hero-icons'
</script>

<svelte:head>
  <title>{$t('profile.profile')}</title>
</svelte:head>

<div class="flex flex-col gap-4 h-full z-0">
  <div
    class="sticky mx-auto z-50 max-w-full min-w-0 flex items-center gap-2"
    style="top: max(1.5rem, {$contentPadding.top}px);"
  >
    <Tabs
      class="overflow-auto"
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
    {#if feature('mediaAndVotes', $site?.version)}
      <Menu class="flex-1" placement="bottom-end">
        <Button
          title={$t('post.actions.more.label')}
          slot="target"
          size="square-lg"
          rounding="pill"
          color="none"
          class="bg-[#fff]/60 dark:bg-neutral-800/60
        border border-gray-200/60 dark:border-neutral-800
        backdrop-blur-xl shadow-xl hover:bg-slate-100 hover:dark:bg-zinc-800
        flex-shrink-0"
        >
          <Icon src={EllipsisHorizontal} size="16" mini />
        </Button>
        <MenuButton href="/profile/media">
          <Icon src={Photo} size="16" mini slot="prefix" />
          {$t('routes.profile.media.title')}
        </MenuButton>
        <MenuButton href="/profile/voted/up">
          <Icon src={ArrowUp} size="16" micro slot="prefix" />
          {$t('routes.profile.upvoted')}
        </MenuButton>
        <MenuButton href="/profile/voted/down">
          <Icon src={ArrowDown} size="16" micro slot="prefix" />
          {$t('routes.profile.downvoted')}
        </MenuButton>
      </Menu>
    {/if}
  </div>
  <slot />
</div>
