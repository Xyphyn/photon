<script lang="ts">
  import {
    DEFAULT_INSTANCE_URL,
    LINKED_INSTANCE_URL,
    instance as currentInstance,
  } from '$lib/instance.js'
  import { getClient, validateInstance } from '$lib/lemmy.js'
  import { Button, TextInput, toast } from 'mono-svelte'

  let instance = LINKED_INSTANCE_URL || $currentInstance || ''
  let email = ''
  let loading = false

  async function submit() {
    loading = true
    try {
      if (!(await validateInstance(instance)))
        throw new Error('Failed to contact instance url')

      await getClient(instance).passwordReset({
        email: email,
      })

      toast({
        content: 'A password reset link was sent to your email.',
        type: 'success',
      })
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
    Enter the email of your account, and a password reset link will be sent. If
    you did not have an email set up, contact your instance admins.
  </p>
  <form class="mt-2 flex flex-col gap-4" on:submit|preventDefault={submit}>
    {#if !LINKED_INSTANCE_URL}
      <TextInput
        bind:value={instance}
        label="Instance URL"
        placeholder={DEFAULT_INSTANCE_URL}
        required
      />
    {/if}
    <TextInput
      bind:value={email}
      label="Email"
      type="email"
      required
      placeholder="example@example.com"
    />
    <Button color="primary" size="lg" {loading} disabled={loading} submit>
      Submit
    </Button>
  </form>
</div>
