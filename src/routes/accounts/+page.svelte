<script lang="ts">
  import {
    profileData,
    setUserID,
    profile as currentProfile,
    resetProfile,
    deleteProfile,
  } from '$lib/auth.js'
  import Button from '$lib/components/input/Button.svelte'
  import TextInput from '$lib/components/input/TextInput.svelte'
  import EditableList from '$lib/components/ui/list/EditableList.svelte'
  import { toast } from '$lib/components/ui/toasts/toasts.js'
  import {
    DEFAULT_INSTANCE_URL,
    LINKED_INSTANCE_URL,
    instance,
  } from '$lib/instance.js'
  import { validateInstance } from '$lib/lemmy.js'
  import { ArrowLeftOnRectangle, Icon, Plus, Trash } from 'svelte-hero-icons'
  import { flip } from 'svelte/animate'

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
</script>

<svelte:head>
  <title>Accounts</title>
</svelte:head>

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
        <Icon slot="icon" src={ArrowLeftOnRectangle} size="16" mini />
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
      <Button
        on:click={() => {
          $profileData.profiles = []
          resetProfile()
        }}
      >
        Delete all
      </Button>
    </div>
    <EditableList
      on:action={(id) => {
        deleteProfile(id.detail)
      }}
      let:action
    >
      {#each $profileData.profiles as profile (profile.id)}
        <div
          class="flex flex-row gap-4 items-center py-4"
          animate:flip={{ duration: 250 }}
        >
          <div class="flex flex-col">
            <span class="font-bold">{profile.username}</span>
            <span class="text-sm text-slate-600 dark:text-zinc-400">
              {profile.instance}
            </span>
          </div>
          <div class="ml-auto" />
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
            <Icon slot="icon" src={Trash} size="16" mini />
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
      <Icon slot="icon" src={Plus} size="16" mini />
      Add more
    </Button>
  </div>
{/if}
