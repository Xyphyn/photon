<script lang="ts">
  import {
    ArrowLeftOnRectangle,
    Bookmark,
    ChevronDoubleRight,
    Cog6Tooth,
    GlobeAlt,
    Home,
    Icon,
    Identification,
    Inbox,
    MagnifyingGlass,
    ServerStack,
    UserCircle,
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
  import Application from '../../../../routes/admin/applications/Application.svelte'
</script>

<nav
  class="flex flex-col p-4 overflow-auto
  gap-1 h-fit max-h-screen {$$props.class}"
  style={$$props.style}
>
  {#if $profile?.jwt}
    <SidebarButton icon={UserCircle} href="/profile/user">
      <span slot="label">Profile</span>
    </SidebarButton>
    <SidebarButton icon={Inbox} href="/inbox">
      <span slot="label">
        Inbox
        {#if $profile?.user?.notifications.inbox}
          <Badge
            class="w-5 h-5 !p-0 grid place-items-center ml-auto"
            color="red-subtle"
          >
            {$profile?.user?.notifications.inbox}
          </Badge>
        {/if}
      </span>
    </SidebarButton>
    <SidebarButton icon={Bookmark} href="/saved">
      <span slot="label">Saved</span>
    </SidebarButton>
  {:else}
    <SidebarButton href="/login" title="Log In" icon={ArrowLeftOnRectangle}>
      <span slot="label">Log In</span>
    </SidebarButton>
    <SidebarButton href="/signup" title="Sign Up" icon={Identification}>
      <span slot="label">Sign Up</span>
    </SidebarButton>
    {#if LINKED_INSTANCE_URL === undefined}
      <SidebarButton
        href="/accounts"
        title="Change Instance"
        icon={ServerStack}
      >
        <span slot="label">Change Instance</span>
      </SidebarButton>
    {/if}
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
    <SidebarButton href="/accounts" icon={UserGroup}>
      <span slot="label">Accounts</span>
    </SidebarButton>
  {/if}
  <hr class="border-slate-200 dark:border-zinc-900 my-1" />
  {#if $profile?.user}
    {#if $profile?.user.moderates.length > 0}
      <CommunityList items={$profile.user.moderates.map((i) => i.community)} />
      <hr class="border-slate-200 dark:border-zinc-900 my-1" />
    {/if}

    <Expandable
      class="max-w-full min-w-0 w-full"
      bind:open={$userSettings.expandCommunities}
    >
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
  {/if}
</nav>
