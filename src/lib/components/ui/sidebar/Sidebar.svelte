<script lang="ts">
  import {
    ArrowLeftOnRectangle,
    ChevronDoubleLeft,
    Cog6Tooth,
    Home,
    Icon,
    Plus,
    UserCircle,
    UserGroup,
  } from 'svelte-hero-icons'
  import Button from '../../input/Button.svelte'
  import Avatar from '$lib/components/ui/Avatar.svelte'
  import { profile, profileData, setUserID } from '$lib/auth.js'
  import { userSettings } from '$lib/settings.js'
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import { slide } from 'svelte/transition'
  import SidebarButton from '$lib/components/ui/sidebar/SidebarButton.svelte'
  import CommunityList from '$lib/components/ui/sidebar/CommunityList.svelte'
  import ProfileAvatar from '$lib/lemmy/ProfileAvatar.svelte'
</script>

<nav
  class="hidden sm:flex flex-col pl-4 pr-4 py-4 overflow-auto sticky top-16 bottom-0
  gap-1 max-h-[calc(100svh-4rem)] w-full bg-slate-100 dark:bg-black
  {$userSettings.expandSidebar
    ? 'max-w-[25%] resize-x min-w-[12rem]'
    : 'w-max max-w-max min-w-max'}"
>
  <Button
    on:click={() =>
      ($userSettings.expandSidebar = !$userSettings.expandSidebar)}
    class="w-max !p-2 hover:bg-slate-200"
    aria-label="Collapse sidebar"
  >
    <Icon
      src={ChevronDoubleLeft}
      mini
      size="16"
      class="transition-transform {$userSettings.expandSidebar
        ? ''
        : 'rotate-180'}"
      title="Toggle Sidebar"
    />
  </Button>
  <SidebarButton href="/" expanded={$userSettings.expandSidebar}>
    <Icon src={Home} solid size="20" title="Frontpage" />
    <span class:hidden={!$userSettings.expandSidebar}>Frontpage</span>
  </SidebarButton>
  <SidebarButton href="/settings" expanded={$userSettings.expandSidebar}>
    <Icon src={Cog6Tooth} solid size="20" title="Settings" />
    <span class:hidden={!$userSettings.expandSidebar}>Settings</span>
  </SidebarButton>
  {#if $profileData.profiles.length >= 1}
    <hr class="border-slate-300 dark:border-zinc-800 my-1" />
    {#each $profileData.profiles as prof, index}
      <Button
        color="tertiary"
        alignment="left"
        on:click={() => {
          if ($profile?.id == prof.id) setUserID(-1)
          else setUserID(prof.id)

          goto($page.url, {
            invalidateAll: true,
          })
        }}
        class="hover:bg-slate-200 {$userSettings.expandSidebar
          ? ''
          : '!p-1.5'} {$profile?.id == prof.id ? 'font-bold' : ''}"
      >
        <ProfileAvatar
          profile={prof}
          {index}
          selected={$profile?.id == prof.id}
        />
        <span
          class:hidden={!$userSettings.expandSidebar}
          class="flex flex-col gap-0"
        >
          {prof.username ?? prof.user?.local_user_view.person.name}
          <span class="text-slate-500 dark:text-zinc-400 font-normal text-xs">
            {prof.instance}
          </span>
        </span>
      </Button>
    {/each}
    <SidebarButton href="/accounts" expanded={$userSettings.expandSidebar}>
      <Icon src={UserGroup} mini size="16" />
      <span class:hidden={!$userSettings.expandSidebar}>Accounts</span>
    </SidebarButton>
  {/if}
  <hr class="border-slate-300 dark:border-zinc-800 my-1" />
  {#if $profile?.user}
    {#if $profile?.user.moderates.length > 0}
      <CommunityList
        expanded={$userSettings.expandSidebar}
        items={$profile.user.moderates.map((i) => i.community)}
      />
      <hr class="border-slate-300 dark:border-zinc-800 my-1" />
    {/if}

    <CommunityList
      expanded={$userSettings.expandSidebar}
      items={$profile.user.follows.map((i) => i.community)}
    />
    {#if $profile.user.follows.length == 0}
      <Button
        class="hover:bg-slate-200 {$userSettings.expandSidebar ? '' : '!p-1.5'}"
        href="/communities"
        color="tertiary"
        alignment="left"
      >
        <Icon src={Plus} solid size="20" />
        <span class:hidden={!$userSettings.expandSidebar}>Add communities</span>
      </Button>
    {/if}
  {:else}
    <Button
      class="hover:bg-slate-200 {$userSettings.expandSidebar ? '' : '!p-1.5'}"
      href="/accounts"
      color="tertiary"
      alignment="left"
    >
      <Icon src={ArrowLeftOnRectangle} solid size="20" />
      <span class:hidden={!$userSettings.expandSidebar}>Log in</span>
    </Button>
  {/if}
</nav>
