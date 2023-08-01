<script lang="ts">
  import {
    profileData,
    setUserID,
    profile as currentProfile,
    resetProfile,
    deleteProfile,
  } from '$lib/auth.js'
  import Button from '$lib/components/input/Button.svelte'
  import EditableList from '$lib/components/ui/list/EditableList.svelte'
  import { ArrowLeftOnRectangle, Icon, Plus, Trash } from 'svelte-hero-icons'
  import { flip } from 'svelte/animate'
</script>

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
    </EditableList>
    <Button href="/login" size="lg" class="mt-auto">
      <Icon slot="icon" src={Plus} size="16" mini />
      Add more
    </Button>
  </div>
{/if}
