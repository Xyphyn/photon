<script>
  import { profile } from '$lib/auth'

  import {
    Badge,
    Button,
    Menu,
    MenuButton,
    MenuDivider,
    Select,
    toast,
  } from 'mono-svelte'
  import Avatar from '../Avatar.svelte'
  import {
    Bars3,
    Bookmark,
    BugAnt,
    CodeBracketSquare,
    Cog6Tooth,
    ComputerDesktop,
    Heart,
    Icon,
    Inbox,
    InformationCircle,
    Moon,
    Sun,
    UserCircle,
    UserGroup,
  } from 'svelte-hero-icons'
  import { theme } from '$lib/ui/colors'
  import { userSettings } from '$lib/settings'
</script>

<Menu {...$$restProps}>
  <button
    class="w-8 h-8 rounded-full ring-1 ring-slate-200 dark:ring-zinc-700
    transition-all bg-slate-50 dark:bg-zinc-900 relative
    hover:dark:brightness-125 hover:brightness-95"
    aria-label="Profile"
    slot="target"
  >
    {#if $profile?.user}
      <div class="w-8 h-8 aspect-square object-cover rounded-full">
        <Avatar
          url={$profile.user.local_user_view.person.avatar}
          width={32}
          alt={$profile.user.local_user_view.person.name}
        />
      </div>
      {#if $profile.user.notifications.inbox > 0}
        <div
          class="rounded-full w-2 h-2 bg-red-500 absolute top-0 left-0 z-10"
        />
      {/if}
    {:else}
      <div class="w-full h-full grid place-items-center">
        <Icon src={Bars3} mini size="18" />
      </div>
    {/if}
  </button>
  {#if $profile?.user}
    <div class="flex flex-row gap-2 items-center py-2 mx-4 font-medium">
      <Avatar
        width={22}
        url={$profile?.user?.local_user_view.person.avatar}
        alt={$profile?.username}
      />
      {$profile?.user?.local_user_view?.person.name}
    </div>
  {:else}
    <MenuDivider>Profile</MenuDivider>
  {/if}
  {#if $profile?.user}
    <MenuButton link href="/profile">
      <Icon src={UserCircle} mini width={16} /> Profile
    </MenuButton>
    <MenuButton link href="/inbox">
      <Icon src={Inbox} mini width={16} />
      Inbox
      {#if $profile.user.notifications.inbox > 0}
        <Badge color="red-subtle" class="text-xs ml-auto font-bold !py-0.5">
          {$profile.user.notifications.inbox}
        </Badge>
      {/if}
    </MenuButton>
    <MenuButton link href="/saved">
      <Icon src={Bookmark} mini width={16} /> Saved
    </MenuButton>
  {/if}
  <MenuButton link href="/accounts">
    <Icon src={UserGroup} mini width={16} />
    Accounts
  </MenuButton>
  <hr class="dark:opacity-10 w-[90%] my-2 mx-auto" />
  <MenuDivider>Photon</MenuDivider>
  <MenuButton link href="/settings">
    <Icon src={Cog6Tooth} mini width={16} />
    Settings
  </MenuButton>
  <MenuButton class="!py-0">
    <Icon
      src={$theme == 'system'
        ? ComputerDesktop
        : $theme == 'light'
          ? Sun
          : $theme == 'dark'
            ? Moon
            : Moon}
      mini
      size="16"
    />
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
      class="flex flex-row flex-wrap justify-between w-full items-center"
      on:click|stopPropagation
    >
      <span>Theme</span>
      <Select bind:value={$theme} class="ml-auto my-auto w-24" size="sm">
        <option value="system">System</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </Select>
    </div>
  </MenuButton>
  {#if $userSettings.debugInfo}
    <MenuButton link href="/util">
      <Icon src={BugAnt} mini width={16} />
      Debug
    </MenuButton>
  {/if}
  <hr class="dark:opacity-10 w-[90%] my-2 mx-auto" />
  <li class="flex flex-col px-4 py-1 mx-auto my-1 text-xs w-full">
    <div class="flex flex-row gap-2 w-full items-center">
      <!-- svelte-ignore missing-declaration -->
      <div class="flex-1">
        <button
          class="hover:brightness-110 transition-all"
          on:click={() => {
            navigator?.clipboard?.writeText(__VERSION__)
            toast({ content: 'Copied version to clipboard.' })
          }}
        >
          <Badge>{__VERSION__}</Badge>
        </button>
      </div>
      <Button
        color="tertiary"
        href="https://buymeacoffee.com/xylight"
        title="Donate"
        size="square-md"
      >
        <Icon src={Heart} size="16" mini />
      </Button>
      <Button
        color="tertiary"
        href="https://github.com/Xyphyn/Photon"
        title="GitHub"
        size="square-md"
      >
        <Icon src={CodeBracketSquare} size="16" mini />
      </Button>
      <Button color="tertiary" href="/about" title="About" size="square-md">
        <Icon src={InformationCircle} size="16" mini />
      </Button>
    </div>
  </li>
</Menu>
