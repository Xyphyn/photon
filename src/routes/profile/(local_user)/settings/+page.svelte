<script lang="ts">
  import { goto } from '$app/navigation'
  import { profile, profileData, setUserID } from '$lib/auth.js'
  import MarkdownEditor from '$lib/components/markdown/MarkdownEditor.svelte'
  import { ImageInput, Material, removeToast, toast } from 'mono-svelte'
  import { getClient } from '$lib/lemmy.js'
  import type { SaveUserSettings } from 'lemmy-js-client'
  import { Button, Checkbox, Modal, TextInput } from 'mono-svelte'
  import { uploadImage } from '$lib/util.js'

  export let data

  let formData: Omit<SaveUserSettings, 'auth'> | undefined = {
    ...data.my_user?.local_user_view?.local_user,
    ...data.my_user?.local_user_view?.person,
  }

  let profileImage: FileList | undefined

  async function save() {
    if (!formData || !$profile?.jwt) return

    loading = true

    try {
      let pfp = profileImage
        ? await uploadImage(profileImage[0], $profile.instance, $profile.jwt)
        : undefined

      const res = await getClient().saveUserSettings({
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

  let deletion = {
    modal: false,
    password: '',
    deleteContent: false,
  }

  async function deleteAccount(level: number) {
    if (!$profile?.jwt) return
    switch (level) {
      case 0: {
        toast({
          content: 'Are you sure you want to delete your account?',
          action: () => deleteAccount(1),
        })
        return
      }
      case 1: {
        toast({
          content: 'Are you really sure?',
          action: () => deleteAccount(2),
        })
        return
      }
      case 2: {
        toast({
          content: 'Final warning. Are you reeeeeeally sure?',
          action: () => deleteAccount(3),
        })
        return
      }
      case 3: {
        deletion.modal = true
        deletion.password = ''
        return
      }
    }

    if (!(deletion.password || null)) {
      toast({
        content: 'You must provide your password.',
        type: 'warning',
      })
    }

    const id = toast({
      content: 'You did this. Deleting account...',
      loading: true,
    })

    try {
      await getClient().deleteAccount({
        password: deletion.password,

        delete_content: deletion.deleteContent,
      })

      profileData.update((pd) => {
        pd.profiles.splice(
          pd.profiles.findIndex((p) => pd.profile == p.id),
          1
        )

        return pd
      })

      setUserID(-1)
      toast({
        content: 'Your account was deleted.',
      })
      goto('/')
    } catch (err) {
      toast({
        content: err as any,
        type: 'error',
      })
    } finally {
      removeToast(id)
    }
  }

  let loading = false
</script>

{#if deletion.modal}
  <Modal
    bind:open={deletion.modal}
    action="Submit"
    on:action={() => deleteAccount(4)}
  >
    <span slot="title">Delete account</span>
    <TextInput
      label="Password"
      type="password"
      bind:value={deletion.password}
    />
    <Checkbox bind:checked={deletion.deleteContent}>
      Delete content
      <span slot="description">
        This will delete ALL of your account's posts and comments.
      </span>
    </Checkbox>
  </Modal>
{/if}

<form class="flex flex-col gap-4 h-full" on:submit|preventDefault={save}>
  <h1 class="font-bold text-2xl">User settings</h1>
  {#if data.my_user?.local_user_view?.local_user && formData}
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
    <ImageInput label="Profile image" bind:files={profileImage} />
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
    <Material padding="lg">The API didn't return your user settings.</Material>
  {/if}
  <Button
    on:click={() => deleteAccount(0)}
    color="danger"
    size="lg"
    class="ml-auto"
  >
    Delete account
  </Button>
</form>
