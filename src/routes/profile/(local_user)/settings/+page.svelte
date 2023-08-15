<script lang="ts">
  import { profile } from '$lib/auth.js'
  import Button from '$lib/components/input/Button.svelte'
  import Checkbox from '$lib/components/input/Checkbox.svelte'
  import FileInput from '$lib/components/input/FileInput.svelte'
  import TextInput from '$lib/components/input/TextInput.svelte'
  import MarkdownEditor from '$lib/components/markdown/MarkdownEditor.svelte'
  import Card from '$lib/components/ui/Card.svelte'
  import { toast } from '$lib/components/ui/toasts/toasts.js'
  import { getClient, uploadImage } from '$lib/lemmy.js'
  import type { SaveUserSettings } from 'lemmy-js-client'

  export let data

  let formData: Omit<SaveUserSettings, 'auth'> | undefined = {
    ...data.local_user_view?.local_user,
    ...data.local_user_view?.person,
  }

  let profileImage: FileList | undefined

  async function save() {
    if (!formData || !$profile?.jwt) return

    loading = true

    try {
      let pfp = profileImage ? await uploadImage(profileImage[0]) : undefined
      const res = await getClient().saveUserSettings({
        auth: $profile.jwt,
        ...formData,
        avatar: pfp,
      })
      toast({
        content: 'Saved your user settings.',
        type: 'success',
      })
      if (res.verify_email_sent) {
        toast({
          content: 'A verification email was sent.',
          type: 'info',
        })
      }
    } catch (err) {
      toast({
        content: err as any,
        type: 'error',
      })
    }
    loading = false
  }

  let loading = false
</script>

<form class="flex flex-col gap-4 h-full" on:submit|preventDefault={save}>
  <h1 class="font-bold text-2xl">User settings</h1>
  {#if data.local_user_view?.local_user && formData}
    <TextInput
      label="Display name"
      bind:value={formData.display_name}
      placeholder="Optional"
    />
    <MarkdownEditor
      images={false}
      bind:value={formData.bio}
      label="Bio"
      previewButton
    />
    <FileInput label="Profile image" image bind:files={profileImage} />
    <TextInput label="Email" bind:value={formData.email} />
    <TextInput
      label="Matrix User"
      bind:value={formData.matrix_user_id}
      placeholder="@user:example.com"
    />
    <Checkbox bind:checked={formData.show_nsfw}>Show NSFW content</Checkbox>
    <Checkbox bind:checked={formData.show_scores}>Show Scores</Checkbox>
    <Checkbox bind:checked={formData.bot_account}>Bot Account</Checkbox>
    <Checkbox bind:checked={formData.show_bot_accounts}>
      Show Bot Accounts
    </Checkbox>
    <Checkbox bind:checked={formData.show_read_posts}>Show Read Posts</Checkbox>

    <Button
      submit
      size="lg"
      color="primary"
      class="mt-auto"
      {loading}
      disabled={loading}
    >
      Save
    </Button>
  {:else}
    <Card cardColor="warning" class="p-5">
      The API didn't return your user settings.
    </Card>
  {/if}
</form>
