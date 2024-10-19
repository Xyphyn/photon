<script lang="ts">
  import {
    ArrowLeftOnRectangle,
    Bookmark,
    Cog6Tooth,
    Identification,
    Inbox,
    UserCircle,
    UserGroup,
  } from 'svelte-hero-icons'
  import { notifications, profile, profileData } from '$lib/auth.js'
  import { userSettings } from '$lib/settings.js'
  import SidebarButton from '$lib/components/ui/sidebar/SidebarButton.svelte'
  import CommunityList from '$lib/components/ui/sidebar/CommunityList.svelte'
  import ProfileButton from '$lib/components/ui/sidebar/ProfileButton.svelte'
  import { flip } from 'svelte/animate'
  import { expoOut } from 'svelte/easing'
  import { Badge } from 'mono-svelte'
  import Expandable from '$lib/components/ui/Expandable.svelte'
  import EndPlaceholder from '../EndPlaceholder.svelte'
  import { t } from '$lib/translations'
  import { iconOfLink } from '../navbar/link'
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
</script>

<nav
  class="flex flex-col p-4 overflow-auto
  gap-1 h-fit max-h-screen {$$props.class}"
  style={$$props.style}
>
  {#if $userSettings.dock.pins?.length ?? 0 > 0}
    <div class="flex items-center flex-wrap gap-2 pl-1.5">
      {#each $userSettings.dock.pins as pin}
        <SidebarButton
          icon={iconOfLink(pin.url)}
          on:click={() => goto(pin.url)}
          alignment="center"
          selected={`${$page.url.pathname}${$page.url.search}` == pin.url}
          on:contextmenu={(e) => {
            e.preventDefault()
            $userSettings.dock.pins = $userSettings.dock.pins.toSpliced(
              $userSettings.dock.pins.findLastIndex((p) => pin.url == p.url),
              1
            )
            return false
          }}
          size="square-md"
        ></SidebarButton>
      {/each}
    </div>
    <hr class="border-slate-200 dark:border-zinc-900 my-1" />
  {/if}
  {#if $profile?.jwt}
    <SidebarButton icon={UserCircle} href="/profile">
      <span slot="label">
        {$t('profile.profile')}
      </span>
    </SidebarButton>
    <SidebarButton icon={Inbox} href="/inbox">
      <span slot="label" class="flex items-center gap-2">
        {$t('profile.inbox')}
        {#if $notifications.inbox}
          <Badge
            class="w-5 h-5 !p-0 grid place-items-center ml-auto"
            color="red-subtle"
          >
            {$notifications.inbox}
          </Badge>
        {/if}
      </span>
    </SidebarButton>
    <SidebarButton icon={Bookmark} href="/saved">
      <span slot="label">{$t('profile.saved')}</span>
    </SidebarButton>
  {:else}
    <SidebarButton
      href="/login"
      title={$t('account.login')}
      icon={ArrowLeftOnRectangle}
    >
      <span slot="label">{$t('account.login')}</span>
    </SidebarButton>
    <SidebarButton
      href="/signup"
      title={$t('account.signup')}
      icon={Identification}
    >
      <span slot="label">{$t('account.signup')}</span>
    </SidebarButton>
    <SidebarButton
      href="/settings"
      title={$t('nav.menu.settings')}
      icon={Cog6Tooth}
    >
      <span slot="label">{$t('nav.menu.settings')}</span>
    </SidebarButton>
  {/if}
  {#if $profileData.profiles.length >= 1}
    <hr class="border-slate-200 dark:border-zinc-900 my-1" />

    <Expandable
      class="max-w-full min-w-0 w-full"
      bind:open={$userSettings.expand.accounts}
    >
      <span slot="title" class="px-2 py-1 w-full">
        <EndPlaceholder>
          {$t('account.accounts')}
          <span slot="action" class="dark:text-white text-black">
            {$profileData.profiles.length}
          </span>
        </EndPlaceholder>
      </span>
      {#each [...$profileData.profiles] as prof, index (prof.id)}
        <div animate:flip={{ duration: 300, easing: expoOut }} class="w-full">
          <ProfileButton {index} {prof} />
        </div>
      {/each}
      <SidebarButton href="/accounts" icon={UserGroup}>
        {$t('account.accounts')}
      </SidebarButton>
    </Expandable>
  {/if}
  <hr class="border-slate-200 dark:border-zinc-900 my-1" />
  {#if $profile?.favorites && $profile?.favorites.length > 0}
    <Expandable
      class="max-w-full min-w-0 w-full"
      bind:open={$userSettings.expand.favorites}
    >
      <span
        slot="title"
        class="px-2 py-1 w-full {$userSettings.expandSidebar
          ? ''
          : '//max-lg:hidden'}"
      >
        <EndPlaceholder>
          {$t('routes.profile.favorites')}
          <span slot="action" class="dark:text-white text-black">
            {$profile.favorites.length}
          </span>
        </EndPlaceholder>
      </span>
      <CommunityList isFavorites items={$profile.favorites} />
    </Expandable>
    <hr class="border-slate-200 dark:border-zinc-900 my-1" />
  {/if}
  {#if $profile?.user}
    {#if $profile?.user.moderates.length > 0}
      <Expandable
        class="max-w-full min-w-0 w-full"
        bind:open={$userSettings.expand.moderates}
      >
        <span
          slot="title"
          class="px-2 py-1 w-full {$userSettings.expandSidebar
            ? ''
            : '//max-lg:hidden'}"
        >
          <EndPlaceholder>
            {$t('routes.profile.moderates')}
            <span slot="action" class="dark:text-white text-black">
              {$profile.user.moderates.length}
            </span>
          </EndPlaceholder>
        </span>
        <CommunityList
          items={$profile.user.moderates.map((i) => i.community)}
        />
      </Expandable>
      <hr class="border-slate-200 dark:border-zinc-900 my-1" />
    {/if}

    <Expandable
      class="max-w-full min-w-0 w-full"
      bind:open={$userSettings.expand.communities}
    >
      <span
        slot="title"
        class="px-2 py-1 w-full {$userSettings.expandSidebar
          ? ''
          : '//max-lg:hidden'}"
      >
        <EndPlaceholder>
          {$t('profile.subscribed')}
          <span slot="action" class="dark:text-white text-black">
            {$profile.user.follows.length}
          </span>
        </EndPlaceholder>
      </span>
      <CommunityList items={$profile.user.follows.map((i) => i.community)} />
    </Expandable>
  {/if}
</nav>
