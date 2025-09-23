<script>
  import Tabs from '$comp/ui/layout/pages/Tabs.svelte'
  import { t } from '$lib/i18n/translations'
  import { Button, Menu, MenuButton } from 'mono-svelte'
  import {
    ArrowDown,
    ArrowUp,
    EllipsisHorizontal,
    Icon,
    Photo,
  } from 'svelte-hero-icons'
  /**
   * @typedef {Object} Props
   * @property {import('svelte').Snippet} [children]
   */

  /** @type {Props} */
  let { children } = $props()
</script>

<svelte:head>
  <title>{$t('profile.profile')}</title>
</svelte:head>

<div class="flex flex-col gap-4 h-full z-0">
  <div class="flex flex-row justify-between">
    <Tabs
      routes={[
        {
          href: '/profile/user',
          name: $t('routes.profile.submissions'),
        },

        {
          href: '/profile/settings',
          name: $t('routes.profile.edit'),
        },

        {
          href: '/profile/blocks',
          name: $t('routes.profile.blocks.title'),
        },

        {
          href: '/profile/password',
          name: $t('routes.profile.credentials'),
        },
      ]}
    >
      <Menu class="flex-1" placement="bottom-end">
        {#snippet target(attachment)}
          <Button
            {@attach attachment}
            aria-label={$t('post.actions.more.label')}
            size="square-sm"
            color="none"
            class="z-0 text-slate-600 dark:text-zinc-500 hover:bg-slate-100 hover:dark:bg-zinc-800"
          >
            <Icon src={EllipsisHorizontal} size="16" micro />
          </Button>
        {/snippet}
        <MenuButton href="/profile/media" icon={Photo}>
          {$t('routes.profile.media.title')}
        </MenuButton>
        <MenuButton href="/profile/voted/up" icon={ArrowUp}>
          {$t('routes.profile.upvoted')}
        </MenuButton>
        <MenuButton href="/profile/voted/down" icon={ArrowDown}>
          {$t('routes.profile.downvoted')}
        </MenuButton>
      </Menu>
    </Tabs>
  </div>
  {@render children?.()}
</div>
