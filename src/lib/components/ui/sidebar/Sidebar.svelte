<script lang="ts">
  import {
    ArrowLeftOnRectangle,
    ChevronDoubleRight,
    Cog6Tooth,
    GlobeAlt,
    Home,
    Icon,
    Identification,
    Inbox,
    MagnifyingGlass,
    ServerStack,
    UserGroup,
  } from 'svelte-hero-icons'
  import { profile, profileData } from '$lib/auth.js'
  import { userSettings } from '$lib/settings.js'
  import SidebarButton from '$lib/components/ui/sidebar/SidebarButton.svelte'
  import CommunityList from '$lib/components/ui/sidebar/CommunityList.svelte'
  import ProfileButton from '$lib/components/ui/sidebar/ProfileButton.svelte'
  import { flip } from 'svelte/animate'
  import { expoOut } from 'svelte/easing'
  import { Badge, Button } from 'mono-svelte'
  import { DEFAULT_INSTANCE_URL, LINKED_INSTANCE_URL } from '$lib/instance.js'
  import Expandable from '$lib/components/ui/Expandable.svelte'
  import EndPlaceholder from '../EndPlaceholder.svelte'

  export let route = ''
</script>

<nav
  class="flex flex-col pl-4 pr-4 py-4 overflow-auto
  gap-1 max-h-[calc(100svh-4rem)] {$$props.class}"
  style={$$props.style}
>
  <Button
    on:click={() =>
      ($userSettings.expandSidebar = !$userSettings.expandSidebar)}
    size="square-md"
    class="flex-shrink-0 lg:hidden"
  >
    <Icon src={ChevronDoubleRight} size="16" mini />
  </Button>
  <SidebarButton href="/" selected={route == '/'}>
    <Icon src={Home} solid={route == '/'} size="20" title="Frontpage" />
    <span slot="label">Frontpage</span>
  </SidebarButton>
  <SidebarButton href="/settings" selected={route == '/settings'}>
    <Icon
      src={Cog6Tooth}
      solid={route == '/settings'}
      size="20"
      title="Settings"
    />
    <span slot="label">Settings</span>
  </SidebarButton>
  <SidebarButton href="/search" selected={route == '/search'}>
    <Icon solid={route == '/search'} src={MagnifyingGlass} size="20" />
    <span slot="label">Search</span>
  </SidebarButton>
  <SidebarButton href="/communities" selected={route == '/communities'}>
    <Icon solid={route == '/communities'} src={GlobeAlt} size="20" />
    <span slot="label">Communities</span>
  </SidebarButton>
  {#if $profile?.jwt}
    <SidebarButton href="/inbox" selected={route == '/inbox'}>
      <Icon solid={route == '/inbox'} src={Inbox} size="20" />
      <span slot="label" class="inline-flex items-center flex-1">
        <span class="flex-shrink-0 flex-1">Inbox</span>
        {#if ($profile?.user?.notifications.inbox ?? 0) > 0}
          <Badge
            color="red-subtle"
            class="w-5 h-5 !p-0 grid place-items-center"
          >
            {$profile?.user?.notifications.inbox}
          </Badge>
        {/if}
      </span>
    </SidebarButton>
  {/if}
  {#if $profileData.profiles.length >= 1}
    <hr class="border-slate-200 dark:border-zinc-900 my-1" />
    {#each [...$profileData.profiles] as prof, index (prof.id)}
      <div animate:flip={{ duration: 300, easing: expoOut }} class="w-full">
        <ProfileButton {index} {prof} />
      </div>
    {/each}
    <ProfileButton
      index={0}
      prof={{
        id: -1,
        instance: $profileData?.defaultInstance ?? DEFAULT_INSTANCE_URL,
        username: 'Guest',
      }}
      guest
    />
    <SidebarButton href="/accounts" selected={route == '/accounts'}>
      <Icon src={UserGroup} mini={route == '/accounts'} size="20" />
      <span slot="label">Accounts</span>
    </SidebarButton>
  {/if}
  <hr class="border-slate-200 dark:border-zinc-900 my-1" />
  {#if $profile?.user}
    {#if $profile?.user.moderates.length > 0}
      <CommunityList items={$profile.user.moderates.map((i) => i.community)} />
      <hr class="border-slate-200 dark:border-zinc-900 my-1" />
    {/if}

    <Expandable bind:open={$userSettings.expandCommunities}>
      <span
        slot="title"
        class="px-2 py-1 w-full {$userSettings.expandSidebar
          ? ''
          : 'max-lg:hidden'}"
      >
        <EndPlaceholder>
          Subscribed
          <span slot="action" class="dark:text-white text-black">
            {$profile.user.follows.length}
          </span>
        </EndPlaceholder>
      </span>
      <CommunityList items={$profile.user.follows.map((i) => i.community)} />
    </Expandable>
  {:else}
    <SidebarButton href="/login" title="Log In">
      <Icon mini src={ArrowLeftOnRectangle} size="20" />
      <span slot="label">Log In</span>
    </SidebarButton>
    <SidebarButton href="/signup" title="Sign Up">
      <Icon mini src={Identification} size="20" />
      <span slot="label">Sign Up</span>
    </SidebarButton>
    {#if LINKED_INSTANCE_URL === undefined}
      <SidebarButton href="/accounts" title="Change Instance">
        <Icon mini src={ServerStack} size="20" />
        <span slot="label">Change Instance</span>
      </SidebarButton>
    {/if}
  {/if}
</nav>
