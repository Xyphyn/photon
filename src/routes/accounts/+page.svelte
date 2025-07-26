<script lang="ts">
  import { profile, type ProfileInfo } from '$lib/auth.svelte.js'
  import CommonList from '$lib/components/ui/layout/CommonList.svelte'
  import Header from '$lib/components/ui/layout/pages/Header.svelte'
  import DebugObject from '$lib/components/util/debug/DebugObject.svelte'
  import { t } from '$lib/i18n/translations'
  import { LINKED_INSTANCE_URL } from '$lib/instance.svelte.js'
  import ProfileAvatar from '$lib/lemmy/ProfileAvatar.svelte'
  import { settings } from '$lib/settings.svelte.js'
  import { Badge, Button, Menu, MenuButton, Modal } from 'mono-svelte'
  import {
    ArrowLeftOnRectangle,
    ArrowRightOnRectangle,
    BugAnt,
    ChevronDown,
    ChevronUp,
    EllipsisHorizontal,
    Icon,
    Identification,
    Plus,
    QuestionMarkCircle,
  } from 'svelte-hero-icons'

  let debugging = $state(false)
  let debugProfile: ProfileInfo | undefined = $state(undefined)

  let removing = $state({
    shown: false,
    account: undefined as ProfileInfo | undefined,
  })

  let switching = $state(-1)

  let radioSelected = $state(profile.current.id)
  $effect(() => {
    switching = radioSelected
    profile.meta.profile = radioSelected
  })

  $effect(() => {
    if (profile.current.user) switching = -1
  })
</script>

<svelte:head>
  <title>{$t('routes.accounts')}</title>
</svelte:head>

{#if debugging}
  <DebugObject
    object={debugProfile?.id == profile.current?.id
      ? profile.current
      : debugProfile}
    bind:open={debugging}
  >
    {#snippet title()}
      <span class="flex flex-col">
        <h1 class="font-bold text-2xl">Debug</h1>
        <span class="text-slate-600 dark:text-zinc-400 text-base font-normal">
          Do NOT share anything from this menu.
        </span>
      </span>
    {/snippet}
  </DebugObject>
{/if}

{#if removing.shown && removing.account}
  <Modal bind:open={removing.shown}>
    {#snippet customTitle()}
      <span>Removing Account</span>
    {/snippet}
    <div class="flex flex-row items-center gap-2">
      <ProfileAvatar profile={removing.account} selected={true} />

      <div class="flex flex-col">
        <span class="font-bold">{removing.account.username}</span>
        <span class="text-sm text-slate-600 dark:text-zinc-400">
          {removing.account.instance}
        </span>
      </div>
    </div>
    <p>This removes the account from Photon, it does not delete the account.</p>
    <div class="flex flex-row gap-2 items-center">
      <Button size="lg" class="flex-1" onclick={() => (removing.shown = false)}>
        Cancel
      </Button>
      <Button
        onclick={() => {
          removing.shown = false
          if (removing.account) profile.remove(removing.account.id)
        }}
        size="lg"
        class="flex-1"
        color="danger"
      >
        Remove
      </Button>
    </div>
  </Modal>
{/if}

<Header pageHeader>
  {$t('routes.accounts')}
  {#snippet extended()}
    <div class="flex">
      <div class="flex gap-2 mr-auto">
        <Button
          href="/accounts/login"
          rounding="pill"
          class="px-4"
          color="primary"
        >
          {#snippet prefix()}
            <Icon src={ArrowLeftOnRectangle} size="16" mini />
          {/snippet}
          {$t('account.login')}
        </Button>
        <Button href="/signup" rounding="pill" class="px-4">
          {#snippet prefix()}
            <Icon src={Identification} size="16" mini />
          {/snippet}
          {$t('account.signup')}
        </Button>
        {#if !LINKED_INSTANCE_URL}
          <Button href="/accounts/login/guest" rounding="pill">
            {#snippet prefix()}
              <Icon src={Plus} size="16" micro />
            {/snippet}
            {$t('account.addGuest')}
          </Button>
        {/if}
      </div>
    </div>
  {/snippet}
</Header>
<form class="accounts-grid mt-4 sm:mt-6 gap-4">
  <CommonList items={profile.meta.profiles}>
    {#snippet item(p, index)}
      <label class="relative">
        <input
          type="radio"
          id={p.id.toString()}
          name="profile"
          value={p.id}
          class="hidden peer"
          bind:group={radioSelected}
        />
        <div
          class={[
            'flex flex-row items-center gap-2 transition-all duration-75',
            'cursor-pointer relative ring-transparent',
            switching == p.id
              ? 'ring-slate-500 dark:ring-zinc-500'
              : 'peer-checked:ring-primary-900 peer-checked:dark:ring-primary-100',
          ]}
        >
          <div
            class="absolute -inset-2 -inset-x-3 sm:-inset-y-3 sm:-inset-x-4 group-first/li:rounded-t-2xl group-last/li:rounded-b-2xl rounded-md ring-2 ring-inherit"
          ></div>
          <ProfileAvatar
            profile={p}
            {index}
            selected={profile?.current.id == p.id}
            size={32}
          />
          <div class="flex flex-col overflow-hidden">
            <span class="break-words font-medium text-base">
              {p.username}
              {#if !p.jwt}
                <Badge class="inline-grid w-6 h-6 p-0! place-items-center">
                  <Icon src={QuestionMarkCircle} size="16" micro />
                </Badge>
              {/if}
            </span>
            <span class="text-sm text-slate-600 dark:text-zinc-400">
              {p.instance}
            </span>
          </div>
          <Menu placement="bottom-end">
            {#snippet target()}
              <Button
                size="square-md"
                color="tertiary"
                class="justify-self-end ml-auto z-50"
                aria-label={$t('post.actions.more.label')}
              >
                {#snippet prefix()}
                  <Icon src={EllipsisHorizontal} mini size="16" />
                {/snippet}
              </Button>
            {/snippet}
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div
              class="px-4 py-2 flex items-center gap-2"
              onclick={e => e.stopPropagation()}
            >
              <Button
                size="square-md"
                color="secondary"
                title={$t('account.moveUp')}
                onclick={() => profile.move(p.id, true)}
              >
                {#snippet prefix()}
                  <Icon src={ChevronUp} size="16" mini />
                {/snippet}
              </Button>
              <Button
                size="square-md"
                color="secondary"
                title={$t('account.moveDown')}
                onclick={() => profile.move(p.id, false)}
              >
                {#snippet prefix()}
                  <Icon src={ChevronDown} size="16" mini />
                {/snippet}
              </Button>
            </div>
            {#if settings.debugInfo}
              <MenuButton
                onclick={() => {
                  debugProfile = p
                  debugging = !debugging
                }}
              >
                {#snippet prefix()}
                  <Icon src={BugAnt} size="16" mini />
                {/snippet}
                {$t('common.debug')}
              </MenuButton>
            {/if}
            {#if !LINKED_INSTANCE_URL || p.user}
              <MenuButton
                onclick={() => {
                  removing.account = p
                  removing.shown = !removing.shown
                }}
                color="danger-subtle"
              >
                {#snippet prefix()}
                  <Icon src={ArrowRightOnRectangle} size="16" mini />
                {/snippet}
                {$t('account.logout')}
              </MenuButton>
            {/if}
          </Menu>
        </div>
      </label>
    {/snippet}
  </CommonList>
</form>

<style>
  .accounts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
</style>
