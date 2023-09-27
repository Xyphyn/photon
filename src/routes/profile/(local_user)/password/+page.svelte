<script lang="ts">
  import { profile, setUser, setUserID, updateJwt } from '$lib/auth.js'
  import { getClient } from '$lib/lemmy.js'
  import { trycatch } from '$lib/util.js'
  import { Button, TextInput, toast } from 'mono-svelte'

  let oldPassword = '',
    newPassword = '',
    newPasswordVerify = ''

  async function submit() {
    const res = await trycatch(async () => {
      if (!$profile?.jwt) return
      const res = await getClient().changePassword({
        auth: $profile?.jwt,
        new_password: newPassword,
        new_password_verify: newPasswordVerify,
        old_password: oldPassword,
      })
      if (res?.jwt) {
        updateJwt($profile.id, res.jwt)
        await setUserID($profile.id)

        toast({ content: 'Your login was refreshed.', type: 'success' })
      } else {
        throw new Error('Invalid credentials')
      }
    })

    if (res) toast({ content: 'Successfully changed your password. ' })
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
  <Button size="lg" color="primary" submit>Submit</Button>
</form>
