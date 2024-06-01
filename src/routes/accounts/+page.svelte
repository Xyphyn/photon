<script lang="ts">
  import {
    profileData,
    setUserID,
    profile as currentProfile,
    deleteProfile,
    moveProfile,
    type Profile,
    profile,
  } from '$lib/auth.js'
  import EditableList from '$lib/components/ui/list/EditableList.svelte'
  import { Menu, MenuButton, Modal, toast } from 'mono-svelte'
  import DebugObject from '$lib/components/util/debug/DebugObject.svelte'
  import {
    DEFAULT_INSTANCE_URL,
    LINKED_INSTANCE_URL,
    instance,
  } from '$lib/instance.js'
  import { validateInstance } from '$lib/lemmy.js'
  import ProfileAvatar from '$lib/lemmy/ProfileAvatar.svelte'
  import { userSettings } from '$lib/settings.js'
  import { Button, TextInput } from 'mono-svelte'
  import {
    ArrowLeftOnRectangle,
    ArrowRightOnRectangle,
    ArrowUturnLeft,
    BugAnt,
    Check,
    ChevronDown,
    ChevronUp,
    EllipsisHorizontal,
    ExclamationTriangle,
    Icon,
    Identification,
    PaintBrush,
    Plus,
    Trash,
  } from 'svelte-hero-icons'
  import { flip } from 'svelte/animate'
  import { expoInOut, expoOut } from 'svelte/easing'

  let newInstance: string = $profileData.defaultInstance ?? DEFAULT_INSTANCE_URL
  let loading = false

  async function changeGuestInstance() {
    loading = true
    try {
      const valid = await validateInstance(newInstance.trim())

      if (!valid) {
        throw new Error('invalid instance')
      }

      toast({
        content: 'Changed guest instance.',
        type: 'success',
      })
    } catch (err) {
      toast({
        content: 'Failed to contact that instance URL. Is it down?',
        type: 'error',
      })

      loading = false

      return
    }

    $profileData.defaultInstance = newInstance
    if ($currentProfile && $currentProfile.id == -1) {
      $instance = newInstance
    }
    loading = false
  }

  let debugging = false
  let debugProfile: Profile | undefined = undefined

  let removing = {
    shown: false,
    account: undefined as Profile | undefined,
  }

  let switching = -69
</script>

<svelte:head>
  <title>Accounts</title>
</svelte:head>

{#if debugging}
  <DebugObject
    object={debugProfile?.id == $profile?.id ? $profile : debugProfile}
    bind:open={debugging}
  >
    <span slot="title" class="flex flex-col">
      <h1 class="font-bold text-2xl">Debug</h1>
      <span class="text-slate-600 dark:text-zinc-400 text-base font-normal">
        Do NOT share anything from this menu.
      </span>
    </span>
  </DebugObject>
{/if}

{#if removing.shown && removing.account}
  <Modal bind:open={removing.shown}>
    <span slot="title">Removing Account</span>
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
      <Button
        size="lg"
        class="flex-1"
        on:click={() => (removing.shown = false)}
      >
        Cancel
      </Button>
      <Button
        on:click={() => {
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

{#if $profileData.profiles.length == 0}
  <div class="h-max flex items-center justify-center my-auto">
    <div
      class="flex flex-col justify-center items-center py-8 gap-4
      my-auto"
    >
      <div class="flex flex-col items-center">
        <Icon src={ArrowLeftOnRectangle} size="48" solid />
        <h1 class="font-bold text-3xl">No accounts</h1>
      </div>
      <div class="flex flex-row items-center gap-2">
        <Button href="/login" size="lg">
          <Icon slot="prefix" src={ArrowLeftOnRectangle} size="16" mini />
          Log in
        </Button>
        <Button href="/signup" size="lg">
          <Icon slot="prefix" src={Identification} size="16" mini />
          Sign up
        </Button>
      </div>
      {#if LINKED_INSTANCE_URL === undefined}
        <div class="flex flex-row font-normal gap-2">
          <TextInput
            label="Guest instance"
            on:change={changeGuestInstance}
            placeholder="Instance URL"
            bind:value={newInstance}
          />
          <Button
            color="primary"
            class="h-max self-end"
            size="lg"
            {loading}
            disabled={loading}
          >
            Change
          </Button>
        </div>
      {/if}
    </div>
  </div>
{:else}
  <div class="flex flex-col h-full gap-4">
    <div class="flex flex-row justify-between">
      <h1 class="text-2xl font-bold">Accounts</h1>
    </div>
    <EditableList
      on:action={(acc) => {
        removing.account = acc.detail
        removing.shown = !removing.shown
      }}
      let:action
    >
      {#each $profileData.profiles as profile, index (profile.id)}
        <div
          class="flex flex-row gap-2 items-center py-4"
          animate:flip={{ duration: 250, easing: expoOut }}
        >
          <div class="flex items-center gap-2">
            <div class="relative group flex-col items-center">
              <ProfileAvatar
                {profile}
                {index}
                selected={$currentProfile?.id == profile.id}
                size={24}
              />
              <div
                class="absolute top-0 left-0 w-full h-full opacity-0
                grid group-hover:opacity-100 z-20 place-items-center
                bg-slate-200 dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800 rounded-full
                transition-all"
              >
                <Icon src={PaintBrush} mini size="14" />
              </div>
              <input
                type="color"
                class="opacity-0 absolute top-0 left-0 h-full w-full rounded-full cursor-pointer z-30"
                bind:value={profile.color}
              />
            </div>
            <div class="flex flex-col">
              <span class="font-medium">{profile.username}</span>
              <span class="text-sm text-slate-600 dark:text-zinc-400">
                {profile.instance}
              </span>
            </div>
          </div>
          <div class="ml-auto" />
          <Button
            aria-label={profile.id == $currentProfile?.id
              ? 'Switch'
              : 'Current'}
            on:click={async () => {
              if (profile.id == $currentProfile?.id) setUserID(-1)
              else {
                switching = profile.id
                await setUserID(profile.id)
                switching = -69
              }
            }}
            size="square-md"
            color={profile.id == $currentProfile?.id ? 'primary' : 'secondary'}
            loading={switching == profile.id}
            disabled={switching == profile.id}
          >
            {#if profile.id == $currentProfile?.id}
              <Icon src={Check} mini size="16" />
            {/if}
          </Button>
          <Menu placement="bottom-end">
            <Button size="square-md" slot="target">
              <Icon src={EllipsisHorizontal} mini size="16" slot="prefix" />
            </Button>
            <div class="px-4 py-2 flex items-center gap-2">
              <Button
                size="square-md"
                color="secondary"
                on:click={() => moveProfile(profile.id, true)}
              >
                <Icon src={ChevronUp} size="16" mini slot="prefix" />
              </Button>
              <Button
                size="square-md"
                color="secondary"
                on:click={() => moveProfile(profile.id, false)}
              >
                <Icon src={ChevronDown} size="16" mini slot="prefix" />
              </Button>
            </div>
            <MenuButton
              disabled={!profile.color}
              on:click={() => (profile.color = undefined)}
            >
              <Icon src={ArrowUturnLeft} size="16" mini slot="prefix" />
              Reset Color
            </MenuButton>
            {#if $userSettings.debugInfo}
              <MenuButton
                on:click={() => {
                  debugProfile = profile
                  debugging = !debugging
                }}
              >
                <Icon src={BugAnt} size="16" mini slot="prefix" />
                Debug Info
              </MenuButton>
            {/if}
            <MenuButton on:click={() => action(profile)} color="danger-subtle">
              <Icon slot="prefix" src={ArrowRightOnRectangle} size="16" mini />
              Log Out
            </MenuButton>
          </Menu>
        </div>
      {/each}
    </EditableList>
    <div class="mt-auto" />
    <div class="flex items-center gap-2">
      <Button href="/login" size="lg" class="flex-1">
        <Icon slot="prefix" src={ArrowLeftOnRectangle} size="16" mini />
        Log In
      </Button>
      <Button href="/login/guest" size="lg">
        <Icon slot="prefix" src={Plus} size="16" mini />
        Add Guest
      </Button>
    </div>
  </div>
{/if}
