<script lang="ts">
  import {
    profile as currentProfile,
    deleteProfile,
    moveProfile,
    type Profile,
    profile,
    profileData,
    setUserID,
  } from '$lib/auth.svelte.js'
  import Header from '$lib/components/ui/layout/pages/Header.svelte'
  import DebugObject from '$lib/components/util/debug/DebugObject.svelte'
  import { t } from '$lib/i18n/translations'
  import { LINKED_INSTANCE_URL } from '$lib/instance.svelte.js'
  import ProfileAvatar from '$lib/lemmy/ProfileAvatar.svelte'
  import { settings } from '$lib/settings.svelte.js'
  import { Badge, Button, Material, Menu, MenuButton, Modal } from 'mono-svelte'
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
  let debugProfile: Profile | undefined = $state(undefined)

  let removing = $state({
    shown: false,
    account: undefined as Profile | undefined,
  })

  let switching = $state(-1)

  let radioSelected = $state(profile.data.id)
  $effect(() => {
    switching = radioSelected
    setUserID(radioSelected)
  })

  $effect(() => {
    if (profile.data.user) switching = -1
  })
</script>

<svelte:head>
  <title>{$t('routes.accounts')}</title>
</svelte:head>

{#if debugging}
  <DebugObject
    object={debugProfile?.id == profile.data?.id ? profile.data : debugProfile}
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
          if (removing.account) deleteProfile(removing.account.id)
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
  {#each profileData.profiles as profile, index (profile.id)}
    <label>
      <input
        type="radio"
        id={profile.id.toString()}
        name="profile"
        value={profile.id}
        class="hidden peer"
        bind:group={radioSelected}
      />
      <Material
        rounding="2xl"
        color="uniform"
        padding="none"
        class={[
          'flex flex-row items-center px-3 py-3 gap-2 transition-all duration-75 cursor-pointer relative',
          'peer-checked:ring-2',
          switching == profile.id && 'ring-slate-400 dark:ring-zinc-600',
        ]}
      >
        <ProfileAvatar
          {profile}
          {index}
          selected={currentProfile?.data.id == profile.id}
          size={40}
        />
        <div class="flex flex-col overflow-hidden">
          <span class="break-words font-medium text-base">
            {profile.username}
            {#if !profile.jwt}
              <Badge class="inline-grid w-6 h-6 p-0! place-items-center">
                <Icon src={QuestionMarkCircle} size="16" micro />
              </Badge>
            {/if}
          </span>
          <span class="text-sm text-slate-600 dark:text-zinc-400">
            {profile.instance}
          </span>
        </div>
        <Menu placement="bottom-end">
          {#snippet target()}
            <Button
              size="custom"
              class="absolute top-0 right-0 w-6 h-6 m-1"
              color="tertiary"
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
              onclick={() => moveProfile(profile.id, true)}
            >
              {#snippet prefix()}
                <Icon src={ChevronUp} size="16" mini />
              {/snippet}
            </Button>
            <Button
              size="square-md"
              color="secondary"
              title={$t('account.moveDown')}
              onclick={() => moveProfile(profile.id, false)}
            >
              {#snippet prefix()}
                <Icon src={ChevronDown} size="16" mini />
              {/snippet}
            </Button>
          </div>
          {#if settings.debugInfo}
            <MenuButton
              onclick={() => {
                debugProfile = profile
                debugging = !debugging
              }}
            >
              {#snippet prefix()}
                <Icon src={BugAnt} size="16" mini />
              {/snippet}
              {$t('common.debug')}
            </MenuButton>
          {/if}
          {#if !LINKED_INSTANCE_URL || profile.user}
            <MenuButton
              onclick={() => {
                removing.account = profile
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
      </Material>
    </label>
  {/each}
</form>

<style>
  .accounts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
</style>
