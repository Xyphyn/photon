<script lang="ts">
  import { notifications, profile } from '$lib/auth.svelte.js'
  import Expandable from '$lib/components/ui/Expandable.svelte'
  import CommunityList from '$lib/components/ui/sidebar/CommunityList.svelte'
  import ProfileButton from '$lib/components/ui/sidebar/ProfileButton.svelte'
  import SidebarButton from '$lib/components/ui/sidebar/SidebarButton.svelte'
  import { t } from '$lib/i18n/translations'
  import { settings } from '$lib/settings.svelte.js'
  import { Badge } from 'mono-svelte'
  import {
    ArrowLeftOnRectangle,
    Bookmark,
    Cog6Tooth,
    Identification,
    Inbox,
    UserCircle,
    UserGroup,
  } from 'svelte-hero-icons'
  import EndPlaceholder from '../EndPlaceholder.svelte'
  import type { ClassValue } from 'svelte/elements'

  interface Props {
    style?: string
    class?: ClassValue
  }

  let { style = '', class: clazz = '' }: Props = $props()
</script>

<nav
  class={['flex flex-col p-4 overflow-auto gap-1 h-fit max-h-screen', clazz]}
  {style}
>
  {#if profile.current?.jwt}
    <SidebarButton icon={UserCircle} href="/profile">
      {#snippet label()}
        {$t('profile.profile')}
      {/snippet}
    </SidebarButton>
    <SidebarButton icon={Inbox} href="/inbox">
      {#snippet label()}
        {$t('profile.inbox')}
        {#if $notifications.inbox}
          <Badge
            class="min-w-5 h-5 p-0! px-0.5 grid place-items-center ml-auto"
            color="red-subtle"
          >
            {$notifications.inbox > 99 ? '∞' : $notifications.inbox}
          </Badge>
        {/if}
      {/snippet}
    </SidebarButton>
    <SidebarButton icon={Bookmark} href="/saved">
      {#snippet label()}
        {$t('profile.saved')}
      {/snippet}
    </SidebarButton>
  {:else}
    <SidebarButton
      href="/login"
      title={$t('account.login')}
      icon={ArrowLeftOnRectangle}
    >
      {#snippet label()}
        {$t('account.login')}
      {/snippet}
    </SidebarButton>
    <SidebarButton
      href="/signup"
      title={$t('account.signup')}
      icon={Identification}
    >
      {#snippet label()}
        {$t('account.signup')}
      {/snippet}
    </SidebarButton>
    <SidebarButton
      href="/settings"
      title={$t('nav.menu.settings')}
      icon={Cog6Tooth}
    >
      {#snippet label()}
        {$t('nav.menu.settings')}
      {/snippet}
    </SidebarButton>
  {/if}
  {#if profile.meta.profiles.length >= 1}
    <hr class="border-slate-200 dark:border-zinc-900 my-1" />

    <Expandable
      class="max-w-full min-w-0 w-full"
      bind:open={settings.expand.accounts}
    >
      {#snippet title()}
        <span class="px-2 py-1 w-full">
          <EndPlaceholder>
            {$t('account.accounts')}
            {#snippet action()}
              <span class="dark:text-white text-black">
                {profile.meta.profiles.length}
              </span>
            {/snippet}
          </EndPlaceholder>
        </span>
      {/snippet}
      <div class="w-full flex gap-px flex-col">
        {#each [...profile.meta.profiles] as prof, index}
          <ProfileButton {index} {prof} />
        {/each}
      </div>
      <SidebarButton href="/accounts" icon={UserGroup}>
        {$t('account.accounts')}
      </SidebarButton>
    </Expandable>
  {/if}
  <hr class="border-slate-200 dark:border-zinc-900 my-1" />
  {#if profile.current?.favorites && profile.current?.favorites.length > 0}
    <Expandable
      class="max-w-full min-w-0 w-full"
      bind:open={settings.expand.favorites}
    >
      {#snippet title()}
        <span class="px-2 py-1 w-full">
          <EndPlaceholder>
            {$t('routes.profile.favorites')}
            {#snippet action()}
              <span class="dark:text-white text-black">
                {profile.current.favorites?.length}
              </span>
            {/snippet}
          </EndPlaceholder>
        </span>
      {/snippet}
      <CommunityList isFavorites items={profile.current.favorites} />
    </Expandable>
    <hr class="border-slate-200 dark:border-zinc-900 my-1" />
  {/if}
  {#if profile.current?.user}
    {#if profile.current?.user.moderates.length > 0}
      <Expandable
        class="max-w-full min-w-0 w-full"
        bind:open={settings.expand.moderates}
      >
        {#snippet title()}
          <span class="px-2 py-1 w-full">
            <EndPlaceholder>
              {$t('routes.profile.moderates')}
              {#snippet action()}
                <span class="dark:text-white text-black">
                  {profile.current.user?.moderates.length}
                </span>
              {/snippet}
            </EndPlaceholder>
          </span>
        {/snippet}
        <CommunityList
          items={profile.current.user.moderates.map(i => i.community)}
        />
      </Expandable>
      <hr class="border-slate-200 dark:border-zinc-900 my-1" />
    {/if}

    <Expandable
      class="max-w-full min-w-0 w-full"
      bind:open={settings.expand.communities}
    >
      {#snippet title()}
        <span class="px-2 py-1 w-full">
          <EndPlaceholder>
            {$t('profile.subscribed')}
            {#snippet action()}
              <span class="dark:text-white text-black">
                {profile.current.user?.follows.length}
              </span>
            {/snippet}
          </EndPlaceholder>
        </span>
      {/snippet}
      <CommunityList
        items={profile.current.user.follows.map(i => i.community)}
      />
    </Expandable>
  {/if}
</nav>
