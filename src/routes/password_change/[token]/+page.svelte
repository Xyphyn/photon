<script lang="ts">
  import { goto } from '$app/navigation'
  import { getClient, validateInstance } from '$lib/api/client.svelte'
  import { profile } from '$lib/app/auth.svelte'
  import { errorMessage } from '$lib/app/error'
  import { t } from '$lib/app/i18n'
  import {
    DEFAULT_INSTANCE_URL,
    LINKED_INSTANCE_URL,
  } from '$lib/app/instance.svelte'
  import { Header } from '$lib/ui/layout'
  import { Button, TextInput, toast } from 'mono-svelte'
  import { preventDefault } from 'svelte/legacy'

  interface Props {
    data: {
      token: string
    }
  }

  let { data }: Props = $props()

  let instance = $state(LINKED_INSTANCE_URL || profile.current.instance || '')
  let password = $state(''),
    password_verify = $state('')
  let loading = $state(false)

  async function submit() {
    loading = true
    try {
      if (!(await validateInstance(instance)))
        throw new Error($t('toast.failInstanceURL'))

      await getClient(instance).passwordChangeAfterReset({
        password: password,
        password_verify: password_verify,
        token: data.token,
      })

      toast({
        content: $t('toast.passwordReset'),
        type: 'success',
      })

      goto('/login')
    } catch (err) {
      toast({
        content: errorMessage(err as string),
        type: 'error',
      })
    }
    loading = false
  }
</script>

<div class="my-auto max-w-xl mx-auto flex flex-col gap-2">
  <Header>{$t('routes.passwordChange.title')}</Header>
  <p>
    {$t('routes.passwordChange.description')}
  </p>
  <form class="mt-2 flex flex-col gap-4" onsubmit={preventDefault(submit)}>
    {#if !LINKED_INSTANCE_URL}
      <TextInput
        bind:value={instance}
        label={$t('form.password')}
        placeholder={DEFAULT_INSTANCE_URL}
        required
      >
        <span class="font-normal text-xs">
          {$t('routes.passwordChange.instance')}
        </span>
      </TextInput>
    {/if}
    <TextInput
      bind:value={password}
      label={$t('form.profile.newPassword')}
      type="password"
      required
    />
    <TextInput
      bind:value={password_verify}
      label={$t('form.profile.verifyNewPassword')}
      type="password"
      required
    />
    <Button color="primary" size="lg" {loading} disabled={loading} submit>
      {$t('form.submit')}
    </Button>
  </form>
</div>
