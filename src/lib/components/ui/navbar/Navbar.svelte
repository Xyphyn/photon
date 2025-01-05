<script lang="ts">
  import { notifications, profile } from '$lib/auth.js'
  import ShieldIcon from '$lib/components/lemmy/moderation/ShieldIcon.svelte'
  import {
    amModOfAny,
    isAdmin,
  } from '$lib/components/lemmy/moderation/moderation.js'
  import Avatar from '$lib/components/ui/Avatar.svelte'
  import { site } from '$lib/lemmy.js'
  import {
    Button,
    Menu,
    MenuButton,
    MenuDivider,
    Modal,
    Spinner,
  } from 'mono-svelte'
  import {
    GlobeAlt,
    Home,
    Icon,
    MagnifyingGlass,
    PencilSquare,
    Plus,
    ServerStack,
    XMark,
    ArrowLeftOnRectangle,
    Newspaper
  } from 'svelte-hero-icons'
  import Profile from './Profile.svelte'
  import NavButton from './NavButton.svelte'
  import { scale } from 'svelte/transition'
  import { backOut } from 'svelte/easing'
  import SearchBar from '$lib/components/lemmy/util/SearchBar.svelte'
  import Logo from '../Logo.svelte'
  import { LINKED_INSTANCE_URL } from '$lib/instance'
  import { t } from '$lib/translations'
  import CommandsWrapper from './commands/CommandsWrapper.svelte'
  import { optimizeImageURL } from '$lib/components/lemmy/post/helpers'
  import { userSettings } from '$lib/settings'
  import { dockProps } from '../layout/Shell.svelte'

  let promptOpen: boolean = false
</script>

<CommandsWrapper bind:open={promptOpen} />
<nav
  class="flex flex-row gap-2 items-center w-full mx-auto z-50 box-border p-0.5
  duration-150 @container
  {$$props.class}
  "
  style={$$props.style}
>
  <NavButton
    on:contextmenu={(e) => {
      e.preventDefault()
      promptOpen = true
      return true
    }}
    href="/"
    label={$t('nav.home')}
    class="ml-2 logo"
    adaptive={false}
  >
    <svelte:fragment slot="icon">
      {#if LINKED_INSTANCE_URL}
        {#if $site}
          <Avatar
            alt={$site.site_view.site.name}
            url={$site.site_view.site.icon}
            width={32}
            circle={false}
          />
        {:else}
          <Spinner width={32} />
        {/if}
      {:else}
        <Logo width={32} />
      {/if}
    </svelte:fragment>
  </NavButton>
  <div
    class="flex flex-row gap-2 py-2 px-2 items-center w-full overflow-auto"
    style="border-radius: inherit;"
  >
    <div class="ml-auto" />
    {#if $profile?.user && isAdmin($profile.user)}
      <NavButton
        href="/admin"
        label={$t('nav.admin')}
        icon={ServerStack}
        class="relative"
        isSelectedFilter={(path) => path.startsWith('/admin')}
      >
        {#if ($notifications.applications ?? 0) > 0}
          <div
            class="rounded-full w-2 h-2 bg-red-500 absolute -top-1 -left-1"
          />
        {/if}
      </NavButton>
    {/if}
    {#if amModOfAny($profile?.user)}
      <NavButton
        href="/moderation"
        label={$t('nav.moderation')}
        class="relative"
      >
        {#if ($notifications.reports ?? 0) > 0}
          <div
            class="rounded-full w-2 h-2 bg-red-500 absolute -top-1 -left-1"
          />
        {/if}
        <ShieldIcon
          let:size
          let:isSelected
          slot="icon"
          filled={isSelected}
          width={size}
        />
      </NavButton>
    {/if}
    <NavButton 
    href="/search" 
    label={$t('nav.search')} 
    icon={MagnifyingGlass} 
  />
    <NavButton 
      href="/create/post"
      label={$t('nav.write')}
      icon={PencilSquare}
    />
    {#if $profile?.jwt}
      <Menu placement="bottom-end">
        <Button
          color="primary"
          class="border border-transparent bg-primary-900 text-white
          dark:bg-primary-100 dark:text-black hover:brightness-125 dark:hover:brightness-90 active:brightness-90
          active:dark:brightness-75 rounded-full shadow-none text-sm transition-all font-medium cursor-pointer duration-75 
          disabled:opacity-50 disabled:pointer-events-none origin-center rounded-full w-10 h-10 flex-shrink-0 
          @3xl:h-8 @3xl:px-3 @3xl:rounded-[10px] @3xl:w-auto relative"
          slot="target"
          title={$t('nav.create.label')}
          style="transition-property: background-color, filter;"
        >
          <div class="flex flex-row items-center h-full gap-1.5 button-content justify-center text-center origin-center">
            <Icon src={Plus} size="16" micro />
            <span class="hidden @3xl:block">{$t('nav.create.label')}</span>
          </div>
        </Button>
        <MenuDivider>{$t('nav.create.label')}</MenuDivider>
        <MenuButton link href="/create/post" disabled={!$profile?.jwt}>
          <Icon src={PencilSquare} size="16" micro slot="prefix" />
          {$t('nav.create.post')}
        </MenuButton>
        <MenuButton
          link
          href="/create/community"
          disabled={!$profile?.jwt ||
            !$profile?.user ||
            ($site?.site_view.local_site.community_creation_admin_only &&
              !isAdmin($profile.user))}
        >
          <Icon src={Newspaper} size="16" micro slot="prefix" />
          {$t('nav.create.community')}
        </MenuButton>
      </Menu>
    {:else}
      <Button
        href="/accounts/login"
        color="none"
        class="bg-orange-600 hover:bg-orange-700 text-white font-bold py-1 px-4 rounded-full text-sm"
        title={$t('account.login')}
      >
        {$t('account.login')}
      </Button>
    {/if}
    {#if $profile?.user?.local_user_view.person.avatar && !$dockProps.noGap}
      <div
        class="absolute right-0 -z-10 h-full
       overflow-hidden w-full ml-auto"
        style="border-radius: inherit;"
      >
        <img
          src={optimizeImageURL(
            $profile?.user?.local_user_view.person.avatar ?? '',
            32
          )}
          class="blur-2xl -z-10 object-cover w-48 h-48 opacity-20 dark:opacity-50 ml-auto"
          alt=""
        />
      </div>
    {/if}
    <Profile placement="top" />
  </div>
</nav>
