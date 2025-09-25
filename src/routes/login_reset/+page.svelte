<script lang="ts">
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

  let instance = $state(LINKED_INSTANCE_URL || profile.current.instance || '')
  let email = $state('')
  let loading = $state(false)

  async function submit() {
    loading = true
    try {
      if (!(await validateInstance(instance)))
        throw new Error($t('toast.failInstanceURL'))

      await getClient(instance).passwordReset({
        email: email,
      })

      toast({
        content: $t('toast.resetLink'),
        type: 'success',
      })
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
  <Header>{$t('routes.resetLogin.title')}</Header>
  <p>
    {$t('routes.resetLogin.description')}
  </p>
  <form class="mt-2 flex flex-col gap-4" onsubmit={preventDefault(submit)}>
    {#if !LINKED_INSTANCE_URL}
      <TextInput
        bind:value={instance}
        label={$t('form.instance')}
        placeholder={DEFAULT_INSTANCE_URL}
        required
      />
    {/if}
    <TextInput
      bind:value={email}
      label={$t('form.email')}
      type="email"
      required
      placeholder="example@example.com"
    />
    <Button color="primary" size="lg" {loading} disabled={loading} submit>
      {$t('form.submit')}
    </Button>
  </form>
</div>
