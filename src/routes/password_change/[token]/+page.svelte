<script lang="ts">
  import { goto } from '$app/navigation'
  import {
    DEFAULT_INSTANCE_URL,
    LINKED_INSTANCE_URL,
    instance as currentInstance,
  } from '$lib/instance.js'
  import { getClient, validateInstance } from '$lib/lemmy.js'
  import { Button, TextInput, toast } from 'mono-svelte'

  export let data: {
    token: string
  }

  let instance = LINKED_INSTANCE_URL || $currentInstance || ''
  let password = '',
    password_verify = ''
  let loading = false

  async function submit() {
    loading = true
    try {
      if (!(await validateInstance(instance)))
        throw new Error('Failed to contact instance url')

      await getClient(instance).passwordChangeAfterReset({
        password: password,
        password_verify: password_verify,
        token: data.token,
      })

      toast({
        content: 'Your password was reset.',
        type: 'success',
      })

      goto('/login')
    } catch (err) {
      toast({
        content: err as any,
        type: 'error',
      })
    }
    loading = false
  }
</script>

<div class="my-auto max-w-xl mx-auto flex flex-col gap-2">
  <h1 class="font-bold text-3xl">Reset Password</h1>
  <p>
    You've clicked an email with the password reset link in it. Now, choose your
    new password.
  </p>
  <form class="mt-2 flex flex-col gap-4" on:submit|preventDefault={submit}>
    {#if !LINKED_INSTANCE_URL}
      <TextInput
        bind:value={instance}
        label="Instance URL"
        placeholder={DEFAULT_INSTANCE_URL}
        required
      >
        <span class="font-normal text-xs">
          What instance did you reset your password for?
        </span>
      </TextInput>
    {/if}
    <TextInput
      bind:value={password}
      label="New Password"
      type="password"
      required
    />
    <TextInput
      bind:value={password_verify}
      label="New Password (Verify)"
      type="password"
      required
    />
    <Button color="primary" size="lg" {loading} disabled={loading} submit>
      Submit
    </Button>
  </form>
</div>
