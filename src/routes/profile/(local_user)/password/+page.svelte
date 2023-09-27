<script lang="ts">
  import { deleteProfile, profile, setUser } from '$lib/auth.js'
  import { getClient } from '$lib/lemmy.js'
  import { trycatch } from '$lib/util.js'
  import { Button, TextInput, toast } from 'mono-svelte'
  import { instance as currentInstance } from '$lib/instance.js'

  let oldPassword = '',
    newPassword = '',
    newPasswordVerify = ''
  let loading = false

  async function submit() {
    try {
      if (!$profile?.jwt) return
      loading = true
      const res = await getClient().changePassword({
        auth: $profile?.jwt,
        new_password: newPassword,
        new_password_verify: newPasswordVerify,
        old_password: oldPassword,
      })
      if (res?.jwt) {
        const { instance, username } = $profile
        deleteProfile($profile.id)
        await setUser(res.jwt, instance, username!)
        $currentInstance = instance

        toast({ content: 'Your login was refreshed.', type: 'success' })
      } else {
        throw new Error('Invalid credentials')
      }

      toast({ content: 'Successfully changed your password. ' })
    } catch (e) {
      toast({
        content: e as any,
        type: 'error',
      })
    }

    loading = false
  }
</script>

<h1 class="font-bold text-3xl">Change Password</h1>
<form on:submit|preventDefault={submit} class="max-w-sm flex flex-col gap-4">
  <TextInput
    bind:value={oldPassword}
    label="Current Password"
    type="password"
    required
  />
  <TextInput
    bind:value={newPassword}
    label="New Password"
    type="password"
    required
  />
  <TextInput
    bind:value={newPasswordVerify}
    label="New Password (Verify)"
    type="password"
    required
  />
  <Button size="lg" color="primary" submit {loading} disabled={loading}>
    Submit
  </Button>
</form>
