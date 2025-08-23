<script lang="ts">
  import { env } from '$env/dynamic/public'
  import { notifications, profile } from '$lib/auth.svelte'

  import SiteCard from '$lib/components/lemmy/SiteCard.svelte'
  import { t } from '$lib/i18n/translations'
  import { site } from '$lib/lemmy.svelte'
  import { settings } from '$lib/settings.svelte'
  import { theme } from '$lib/ui/colors.svelte'
  import {
    Badge,
    Button,
    MenuButton,
    MenuDivider,
    Modal,
    Option,
    Select,
    Spinner,
    toast,
  } from 'mono-svelte'
  import {
    ArrowLeftOnRectangle,
    Bookmark,
    BugAnt,
    CodeBracketSquare,
    Cog6Tooth,
    ComputerDesktop,
    Icon,
    Identification,
    Inbox,
    Moon,
    ServerStack,
    Sun,
    Swatch,
    UserCircle,
    UserGroup,
  } from 'svelte-hero-icons'

  let showInstance = $state(false)
</script>

{#if showInstance}
  <Modal bind:open={showInstance} title="Instance">
    {#if site.data}
      <SiteCard
        site={site.data.site_view}
        admins={site.data.admins}
        taglines={site.data.taglines}
        version={site.data.version}
      />
    {:else}
      <Spinner />
    {/if}
  </Modal>
{/if}

{#if profile.current?.jwt}
  <MenuButton href="/profile">
    {#snippet prefix()}
      <Icon src={UserCircle} micro size="16" />
    {/snippet}
    {$t('profile.profile')}
  </MenuButton>
  <MenuButton href="/inbox">
    {#snippet prefix()}
      <Icon src={Inbox} micro size="16" />
    {/snippet}
    {$t('profile.inbox')}
    {#if $notifications.inbox > 0}
      <Badge color="red-subtle" class="text-xs ml-auto font-bold py-0.5!">
        {$notifications.inbox > 99 ? '∞' : $notifications.inbox}
      </Badge>
    {/if}
  </MenuButton>
  <MenuButton href="/saved">
    {#snippet prefix()}
      <Icon src={Bookmark} micro size="16" />
    {/snippet}
    {$t('profile.saved')}
  </MenuButton>
{:else}
  <MenuButton href="/accounts/login">
    {#snippet prefix()}
      <Icon src={ArrowLeftOnRectangle} mini size="16" />
    {/snippet}
    {$t('account.login')}
  </MenuButton>
  <MenuButton href="/signup">
    {#snippet prefix()}
      <Icon src={Identification} micro size="16" />
    {/snippet}
    {$t('account.signup')}
  </MenuButton>
{/if}
<MenuButton href="/accounts">
  {#snippet prefix()}
    <Icon src={UserGroup} micro size="16" />
  {/snippet}
  {$t('account.accounts')}
</MenuButton>
<MenuDivider>{$t('nav.menu.app')}</MenuDivider>
<MenuButton href="/settings">
  {#snippet prefix()}
    <Icon src={Cog6Tooth} micro size="16" />
  {/snippet}
  {$t('nav.menu.settings')}
</MenuButton>
<MenuButton class="py-0!" onclick={e => e.stopPropagation()}>
  {#snippet prefix()}
    <Icon
      src={theme.colorScheme == 'system'
        ? ComputerDesktop
        : theme.colorScheme == 'light'
          ? Sun
          : theme.colorScheme == 'dark'
            ? Moon
            : Moon}
      micro
      size="16"
    />
  {/snippet}
  <span>{$t('nav.menu.colorscheme.label')}</span>
  <Select bind:value={theme.colorScheme} class="ml-auto my-auto w-24" size="sm">
    <Option value="system" icon={ComputerDesktop}>
      {$t('nav.menu.colorscheme.system')}
    </Option>
    <Option value="light" icon={Sun}>
      {$t('nav.menu.colorscheme.light')}
    </Option>
    <Option value="dark" icon={Moon}>
      {$t('nav.menu.colorscheme.dark')}
    </Option>
  </Select>
</MenuButton>
<MenuButton href="/theme">
  {#snippet prefix()}
    <Icon src={Swatch} size="16" micro />
  {/snippet}
  {$t('nav.menu.theme')}
</MenuButton>
{#if settings.debugInfo}
  <MenuButton href="/util">
    {#snippet prefix()}
      <Icon src={BugAnt} mini size="16" />
    {/snippet}
    Debug
  </MenuButton>
{/if}
<li class="flex flex-col px-2 py-1 mx-auto my-1 text-xs w-full">
  <div class="flex flex-row gap-2 w-full items-center">
    <div class="flex-1">
      <button
        class="hover:brightness-110 transition-all"
        onclick={() => {
          navigator?.clipboard?.writeText(__VERSION__)
          toast({ content: $t('toast.copied') })
        }}
      >
        <Badge color="blue-subtle">{__VERSION__}</Badge>
      </button>
    </div>
    <Button
      onclick={e => {
        e.stopPropagation()
        showInstance = !showInstance
      }}
      color="tertiary"
      title={$t('nav.menu.instance')}
      size="square-md"
    >
      <Icon src={ServerStack} size="16" micro />
    </Button>
    {#if env.PUBLIC_XYLIGHT_MODE.toLowerCase() == 'true'}
      <Button
        color="tertiary"
        href="https://github.com/Xyphyn/Photon"
        title={$t('nav.menu.source')}
        size="square-md"
      >
        <Icon src={CodeBracketSquare} size="16" micro />
      </Button>
    {/if}
  </div>
</li>
