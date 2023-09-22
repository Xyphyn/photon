<script lang="ts">
  import {
    ArrowLeftOnRectangle,
    ChevronDoubleLeft,
    Cog6Tooth,
    ComputerDesktop,
    GlobeAlt,
    Home,
    Icon,
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
  import { Button } from 'mono-svelte'
  import { site } from '$lib/lemmy.js'
</script>

<aside
  class="hidden sm:flex flex-col pl-4 pr-4 py-4 overflow-auto top-16 bottom-0
  gap-1 max-h-[calc(100svh-4rem)] w-full bg-slate-50 dark:bg-black
  {$userSettings.expandSidebar
    ? 'max-w-[35vw] w-[25vw] resize-x min-w-[15vw]'
    : 'w-max max-w-max min-w-max'} {$$props.class}"
  style="grid-area: b;"
>
  <Button
    on:click={() =>
      ($userSettings.expandSidebar = !$userSettings.expandSidebar)}
    class="w-max !p-2"
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
    <Icon src={Home} mini size="20" title="Frontpage" />
    <span class:hidden={!$userSettings.expandSidebar}>Frontpage</span>
  </SidebarButton>
  <SidebarButton href="/settings" expanded={$userSettings.expandSidebar}>
    <Icon src={Cog6Tooth} mini size="20" title="Settings" />
    <span class:hidden={!$userSettings.expandSidebar}>Settings</span>
  </SidebarButton>
  <SidebarButton expanded={$userSettings.expandSidebar} href="/communities">
    <Icon mini src={GlobeAlt} size="20" />
    <span class:hidden={!$userSettings.expandSidebar}>Communities</span>
  </SidebarButton>
  {#if $profileData.profiles.length >= 1}
    <hr class="border-slate-300 dark:border-zinc-800 my-1" />
    {#each $profileData.profiles as prof, index (prof.id)}
      <div animate:flip={{ duration: 300, easing: expoOut }} class="w-full">
        <ProfileButton {index} {prof} expanded={$userSettings.expandSidebar} />
      </div>
    {/each}
    <SidebarButton href="/accounts" expanded={$userSettings.expandSidebar}>
      <Icon src={UserGroup} mini size="20" />
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
  {:else}
    <Button
      class="hover:bg-slate-200 {$userSettings.expandSidebar ? '' : '!p-1.5'}"
      href="/accounts"
      color="tertiary"
      alignment="left"
    >
      <Icon mini src={ArrowLeftOnRectangle} size="20" />
      <span class:hidden={!$userSettings.expandSidebar}>Log in</span>
    </Button>
  {/if}
  {#if $userSettings.expandSidebar}
    <div
      class="mt-4 text-slate-600 dark:text-zinc-400 text-sm flex flex-row
    items-center gap-4 flex-wrap"
    >
      <span class="flex gap-1 items-center" title="Lemmy version">
        <Icon src={ServerStack} size="16" mini />
        {$site?.version}
      </span>
      <!-- svelte-ignore missing-declaration -->
      <span class="flex gap-1 items-center" title="Photon version">
        <Icon src={ComputerDesktop} size="16" mini />
        {__VERSION__}
      </span>
    </div>
  {/if}
</aside>
