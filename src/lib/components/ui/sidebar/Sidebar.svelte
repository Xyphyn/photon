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
  class="flex flex-col p-4 overflow-auto
  gap-1 h-screen {$$props.class}"
  style={$$props.style}
>
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
