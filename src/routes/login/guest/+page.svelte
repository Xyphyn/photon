<script lang="ts">
  import { site, validateInstance } from '$lib/lemmy.js'
  import { Button, Note, TextInput, toast } from 'mono-svelte'
  import { MINIMUM_VERSION } from '$lib/version'
  import { mayBeIncompatible } from '$lib/lemmy'
  import { DOMAIN_REGEX_FORMS } from '$lib/util'
  import { profile, profileData, type Profile } from '$lib/auth'
  import { LINKED_INSTANCE_URL } from '$lib/instance'

  let form = {
    instance: '',
    username: 'Guest',
    loading: false,
  }

  async function addGuest() {
    form.loading = true
    if (!(await validateInstance(form.instance))) {
      toast({ content: 'Failed to contact that instance URL.', type: 'error' })
      form.loading = false
      return
    }

    profileData.update((pd) => {
      // too lazy to make a decent system
      const id = Math.floor(Math.random() * 100000)

      const newProfile: Profile = {
        id: id,
        instance: form.instance,
        username: form.username,
      }

      profile.set({
        ...newProfile,
      })

      return {
        profile: id,
        profiles: [newProfile, ...pd.profiles],
      }
    })

    toast({ content: 'Added that account.', type: 'success' })

    form.loading = false
  }
</script>

<div class="max-w-xl w-full mx-auto h-max my-auto">
  <form on:submit|preventDefault={addGuest} class="flex flex-col gap-5">
    <div class="flex flex-col gap-2">
      <h1 class="font-bold text-3xl">Add Guest</h1>
      {#if $site && mayBeIncompatible(MINIMUM_VERSION, $site.version.replace('v', ''))}
        <Note>
          This version of Photon supports instances running
          <span style="font-family: monospace;">
            v{MINIMUM_VERSION}
          </span>
          or higher.
        </Note>
      {/if}
    </div>
    <div class="inline-flex items-center gap-2">
      <TextInput
        required
        label="Name"
        bind:value={form.username}
        placeholder="Guest 2"
        minlength={1}
        class="flex-1"
      ></TextInput>
      {#if !LINKED_INSTANCE_URL}
        <TextInput
          required
          label="Instance URL"
          bind:value={form.instance}
          pattern={DOMAIN_REGEX_FORMS}
          placeholder="example.com"
          class="flex-1"
        />
      {/if}
    </div>
    <Button
      submit
      class="w-full"
      color="primary"
      size="lg"
      loading={form.loading}
      disabled={form.loading}
    >
      Submit
    </Button>
  </form>
</div>
