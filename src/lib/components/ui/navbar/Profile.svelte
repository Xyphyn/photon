<script lang="ts">
  import { profile } from '$lib/auth'

  import {
    Badge,
    Button,
    Menu,
    MenuButton,
    MenuDivider,
    Modal,
    Select,
    Spinner,
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
    ServerStack,
    Sun,
    Swatch,
    UserCircle,
    UserGroup,
  } from 'svelte-hero-icons'
  import { legacyTheme } from '$lib/ui/colors'
  import { userSettings } from '$lib/settings'
  import { site } from '$lib/lemmy'
  import SiteCard from '$lib/components/lemmy/SiteCard.svelte'
  import { t } from '$lib/translations'

  let showInstance = false
</script>

{#if showInstance}
  <Modal bind:open={showInstance} title="Instance">
    {#if $site}
      <SiteCard
        site={$site.site_view}
        admins={$site.admins}
        taglines={$site.taglines}
        version={$site.version}
      />
    {:else}
      <Spinner />
    {/if}
  </Modal>
{/if}

<Menu {...$$restProps}>
  <button
    class="w-10 h-10 rounded-full ring-1 ring-slate-200 dark:ring-zinc-700
    transition-all bg-slate-50 dark:bg-zinc-900 relative
    hover:dark:brightness-125 hover:brightness {$$props.buttonClass}"
    title={$t('profile.profile')}
    slot="target"
  >
    {#if $profile?.user}
      <div
        class="w-10 h-10 aspect-square object-cover rounded-full grid place-items-center"
      >
        <Avatar
          url={$profile.user.local_user_view.person.avatar}
          width={38}
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
    <MenuDivider>{$t('nav.menu.label')}</MenuDivider>
  {/if}
  {#if $profile?.user}
    <MenuButton link href="/profile">
      <Icon src={UserCircle} mini width={16} slot="prefix" />
      {$t('profile.profile')}
    </MenuButton>
    <MenuButton link href="/inbox">
      <Icon src={Inbox} mini width={16} slot="prefix" />
      {$t('profile.inbox')}
      {#if $profile.user.notifications.inbox > 0}
        <Badge color="red-subtle" class="text-xs ml-auto font-bold !py-0.5">
          {$profile.user.notifications.inbox}
        </Badge>
      {/if}
    </MenuButton>
    <MenuButton link href="/saved">
      <Icon src={Bookmark} mini width={16} slot="prefix" />
      {$t('profile.saved')}
    </MenuButton>
  {/if}
  <MenuButton link href="/accounts">
    <Icon src={UserGroup} mini width={16} slot="prefix" />
    {$t('account.accounts')}
  </MenuButton>
  <hr class="dark:opacity-10 w-[90%] my-2 mx-auto" />
  <MenuDivider>{$t('nav.menu.app')}</MenuDivider>
  <MenuButton link href="/settings">
    <Icon src={Cog6Tooth} mini width={16} slot="prefix" />
    {$t('nav.menu.settings')}
  </MenuButton>
  <MenuButton class="!py-0">
    <Icon
      src={$legacyTheme == 'system'
        ? ComputerDesktop
        : $legacyTheme == 'light'
          ? Sun
          : $legacyTheme == 'dark'
            ? Moon
            : Moon}
      mini
      size="16"
      slot="prefix"
    />
    <span>{$t('nav.menu.colorscheme.label')}</span>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="contents" on:click|stopPropagation={() => {}}>
      <Select bind:value={$legacyTheme} class="ml-auto my-auto w-24" size="sm">
        <option value="system">{$t('nav.menu.colorscheme.system')}</option>
        <option value="light">{$t('nav.menu.colorscheme.light')}</option>
        <option value="dark">{$t('nav.menu.colorscheme.dark')}</option>
      </Select>
    </div>
  </MenuButton>
  <MenuButton href="/theme">
    <Icon src={Swatch} size="16" mini slot="prefix" />
    {$t('nav.menu.theme')}
  </MenuButton>
  {#if $userSettings.debugInfo}
    <MenuButton link href="/util">
      <Icon src={BugAnt} mini width={16} slot="prefix" />
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
            toast({ content: $t('toast.copied') })
          }}
        >
          <Badge color="blue-subtle">{__VERSION__}</Badge>
        </button>
      </div>
      <Button
        on:click={() => (showInstance = !showInstance)}
        color="tertiary"
        title={$t('nav.menu.instance')}
        size="square-md"
      >
        <Icon src={ServerStack} size="16" mini />
      </Button>
      <Button
        color="tertiary"
        href="https://buymeacoffee.com/xylight"
        title={$t('nav.menu.donate')}
        size="square-md"
      >
        <Icon src={Heart} size="16" mini />
      </Button>
      <Button
        color="tertiary"
        href="https://github.com/Xyphyn/Photon"
        title={$t('nav.menu.source')}
        size="square-md"
      >
        <Icon src={CodeBracketSquare} size="16" mini />
      </Button>
    </div>
  </li>
</Menu>
