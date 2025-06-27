<script lang="ts">
  import { goto } from '$app/navigation'
  import { profileData, setUserID } from '$lib/auth.svelte'
  import { t } from '$lib/i18n/translations'
  import { client } from '$lib/lemmy.svelte'
  import { Button, Checkbox, removeToast, TextInput, toast } from 'mono-svelte'

  let deletion = $state({
    modal: false,
    password: '',
    deleteContent: false,
  })

  async function deleteAccount(level: number) {
    switch (level) {
      case 0: {
        toast({
          content: $t('toast.confirmDelete1'),
          action: () => deleteAccount(1),
        })
        return
      }
      case 1: {
        toast({
          content: $t('toast.confirmDelete2'),
          action: () => deleteAccount(2),
        })
        return
      }
      case 2: {
        toast({
          content: $t('toast.confirmDelete3'),
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
        content: $t('toast.needPassword'),
        type: 'warning',
      })
    }

    const id = toast({
      content: $t('toast.deleting'),
      loading: true,
    })

    try {
      await client().deleteAccount({
        password: deletion.password,

        delete_content: deletion.deleteContent,
      })

      profileData.profiles.splice(
        profileData.profiles.findIndex(p => profileData.profile == p.id),
      )

      setUserID(-1)
      toast({
        content: $t('toast.deleted'),
      })
      goto('/')
    } catch (err) {
      toast({
        content: err as string,
        type: 'error',
      })
    } finally {
      removeToast(id)
    }
  }
</script>

<form
  onsubmit={e => {
    e.preventDefault()
    deleteAccount(4)
  }}
  class="w-full flex flex-col gap-4"
>
  <TextInput
    label={$t('form.password')}
    type="password"
    bind:value={deletion.password}
  />
  <Checkbox bind:checked={deletion.deleteContent}>
    {$t('form.profile.deleteAccount.deleteContent')}
    {#snippet description()}
      <span>
        {$t('form.profile.deleteAccount.warning')}
      </span>
    {/snippet}
  </Checkbox>
  <Button submit color="primary" size="lg">
    {$t('form.submit')}
  </Button>
</form>
