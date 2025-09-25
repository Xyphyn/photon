<script lang="ts">
  import { profile } from '$lib/app/auth.svelte'
  import { t } from '$lib/app/i18n'
  import { client } from '$lib/api/client.svelte'
  import { errorMessage } from '$lib/lemmy/error'
  import { Button, TextInput, toast } from 'mono-svelte'

  let oldPassword = $state(''),
    newPassword = $state(''),
    newPasswordVerify = $state('')
  let loading = $state(false)

  async function changePassword() {
    try {
      loading = true
      const res = await client().changePassword({
        new_password: newPassword,
        new_password_verify: newPasswordVerify,
        old_password: oldPassword,
      })
      if (res?.jwt) {
        const { instance } = profile.current
        profile.remove(profile.current.id)
        await profile.add(res.jwt, instance)

        toast({ content: $t('toast.loginRefresh'), type: 'success' })
      } else {
        throw new Error($t('toast.invalidLogin'))
      }

      toast({ content: $t('toast.passwordReset') })
    } catch (e) {
      toast({
        content: errorMessage(e as string),
        type: 'error',
      })
    }

    loading = false
  }
</script>

<form
  onsubmit={(e) => {
    e.preventDefault()
    changePassword()
  }}
  class="flex flex-col gap-4 w-full max-w-xl"
>
  <TextInput
    bind:value={oldPassword}
    label={$t('form.profile.currentPassword')}
    type="password"
    minlength={10}
    required
  />
  <TextInput
    bind:value={newPassword}
    label={$t('form.profile.newPassword')}
    type="password"
    minlength={10}
    required
  />
  <TextInput
    bind:value={newPasswordVerify}
    label={$t('form.profile.verifyNewPassword')}
    type="password"
    minlength={10}
    required
  />
  <Button size="lg" color="primary" submit {loading} disabled={loading}>
    {$t('form.submit')}
  </Button>
</form>
