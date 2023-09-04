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
  import Menu from '$lib/components/ui/menu/Menu.svelte'
  import MenuButton from '$lib/components/ui/menu/MenuButton.svelte'
  import { toast } from '$lib/components/ui/toasts/toasts.js'
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
    ArrowUturnLeft,
    BugAnt,
    ChevronDown,
    ChevronUp,
    EllipsisHorizontal,
    Icon,
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

{#if $profileData.profiles.length == 0}
  <div class="h-full flex items-center justify-center">
    <div
      class="text-slate-600 dark:text-zinc-400 flex flex-col justify-center items-center py-8 gap-4"
    >
      <div class="flex flex-col items-center">
        <Icon src={ArrowLeftOnRectangle} size="48" solid />
        <h1 class="font-bold text-3xl">No accounts</h1>
      </div>
      <Button href="/login" size="lg">
        <Icon slot="prefix" src={ArrowLeftOnRectangle} size="16" mini />
        Log in
      </Button>
      <div class="flex flex-row font-normal gap-2">
        <TextInput
          label="Guest instance"
          on:change={changeGuestInstance}
          placeholder="Instance URL"
          bind:value={newInstance}
          disabled={LINKED_INSTANCE_URL != undefined}
        />
        <Button
          color="primary"
          class="h-max self-end"
          size="lg"
          {loading}
          disabled={loading || LINKED_INSTANCE_URL != undefined}
        >
          Change
        </Button>
      </div>
    </div>
  </div>
{:else}
  <div class="flex flex-col h-full gap-4">
    <div class="flex flex-row justify-between">
      <h1 class="text-2xl font-bold">Accounts</h1>
    </div>
    <EditableList
      on:action={(id) => {
        deleteProfile(id.detail)
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
              <span class="font-bold">{profile.username}</span>
              <span class="text-sm text-slate-600 dark:text-zinc-400">
                {profile.instance}
              </span>
            </div>
          </div>
          <div class="ml-auto" />
          <Menu alignment="bottom-right">
            <Button let:toggleOpen on:click={toggleOpen} size="square-md" slot="button">
              <Icon src={EllipsisHorizontal} mini size="16" slot="prefix" />
            </Button>
            <MenuButton on:click={() => moveProfile(profile.id, true)}>
              <Icon src={ChevronUp} size="16" mini slot="icon" />
              Move Up
            </MenuButton>
            <MenuButton on:click={() => moveProfile(profile.id, false)}>
              <Icon src={ChevronDown} size="16" mini slot="icon" />
              Move Down
            </MenuButton>
            <MenuButton
              disabled={!profile.color}
              on:click={() => (profile.color = undefined)}
            >
              <Icon src={ArrowUturnLeft} size="16" mini slot="icon" />
              Reset Color
            </MenuButton>
            {#if $userSettings.debugInfo}
              <MenuButton
                on:click={() => {
                  debugProfile = profile
                  debugging = !debugging
                }}
              >
                <Icon src={BugAnt} size="16" mini slot="icon" />
                Debug Info
              </MenuButton>
            {/if}
          </Menu>
          <Button
            on:click={() => {
              if (profile.id == $currentProfile?.id) {
                setUserID(-1)
              } else {
                setUserID(profile.id)
              }
            }}
            color={profile.id == $currentProfile?.id ? 'primary' : 'secondary'}
          >
            {profile.id == $currentProfile?.id ? 'Current' : 'Switch to'}
          </Button>
          <Button
            on:click={() => action(profile.id)}
            class="!p-2"
            color="danger"
          >
            <Icon slot="prefix" src={Trash} size="16" mini />
          </Button>
        </div>
      {/each}
      <div class="flex flex-row gap-4 items-center py-4">
        <span class="font-bold flex flex-col">Guest</span>
        <div class="ml-auto" />

        <Button
          on:click={() => {
            setUserID(-1)
          }}
          color={$currentProfile?.id == -1 ? 'primary' : 'secondary'}
        >
          {$currentProfile?.id == -1 ? 'Current' : 'Switch to'}
        </Button>
      </div>
    </EditableList>
    <div class="mt-auto" />
    <div class="flex flex-row font-normal gap-2">
      <TextInput
        on:change={changeGuestInstance}
        placeholder="Instance URL"
        label="Guest instance"
        bind:value={newInstance}
        disabled={LINKED_INSTANCE_URL != undefined}
      />
      <Button
        color="primary"
        {loading}
        disabled={loading || LINKED_INSTANCE_URL != undefined}
        class="h-[42px] self-end"
      >
        Change
      </Button>
    </div>
    <Button href="/login" size="lg">
      <Icon slot="prefix" src={Plus} size="16" mini />
      Add more
    </Button>
  </div>
{/if}
