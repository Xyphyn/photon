<script lang="ts">
  import { goto } from '$app/navigation'
  import Button from '$lib/components/input/Button.svelte'
  import TextInput from '$lib/components/input/TextInput.svelte'
  import Card from '$lib/components/ui/Card.svelte'
  import {
    ToastType,
    addToast,
    toast,
  } from '$lib/components/ui/toasts/toasts.js'
  import { DEFAULT_INSTANCE_URL, authData, getClient } from '$lib/lemmy.js'
  import { Color } from '$lib/ui/colors.js'

  let data = {
    instance: '',
    username: '',
    password: '',
    totp: '',
    loading: false,
  }

  async function validateURL(instance: string): Promise<boolean> {
    if (instance == '') return false

    try {
      await getClient(instance).getSite({})
    } catch (err) {
      throw new Error('Failed to contact that instance. Is it down?')
    }

    return true
  }

  async function logIn() {
    data.loading = true
    try {
      if (!(await validateURL(data.instance))) {
        throw new Error('Failed to contact that instance. Is it down?')
      }

      const response = await getClient(data.instance).login({
        username_or_email: data.username,
        password: data.password,
        totp_2fa_token: data.totp,
      })

      if (response?.jwt) {
        authData.set({
          instance: data.instance,
          token: response.jwt,
          username: data.username,
        })

        toast({ content: 'Successfully logged in.', type: ToastType.success })
        goto('/')
      } else {
        throw new Error('Invalid credentials')
      }
    } catch (error) {
      toast({
        content: error as any,
        type: ToastType.error,
      })
    }
    data.loading = false
  }
</script>

<svelte:head>
  <title>Login</title>
</svelte:head>

<!-- <div
  class="p-4 absolute top-[50%] left-[50%] translate-x-[-50%]
translate-y-[-50%] w-full flex flex-col items-center justify-center"
> -->
<Card class="p-6 max-w-lg w-full mx-auto">
  <form on:submit|preventDefault={logIn} class="flex flex-col gap-4">
    <h1 class="font-bold text-2xl">Log in</h1>
    <div class="flex flex-row w-full items-center gap-2">
      <TextInput
        id="username"
        bind:value={data.username}
        label="Username"
        placeholder="Example"
        class="flex-1"
        on:input={(e) => {
          if (e.detail.data == '@') {
            document.getElementById('instance_url')?.focus()
            data.username = data.username.replace('@', '')
          }
        }}
        required
      />
      <span class="mt-5 font-bold">@</span>
      <TextInput
        id="instance_url"
        label="Instance URL"
        placeholder={DEFAULT_INSTANCE_URL}
        bind:value={data.instance}
        class="flex-1"
        required
        pattern={'(?!-)[A-Za-z0-9-]+([-.]{1}[a-z0-9]+)*.[A-Za-z]{2,6}'}
      />
    </div>
    <TextInput
      id="password"
      bind:value={data.password}
      label="Password"
      type="password"
      required
    />
    <TextInput
      id="totp"
      bind:value={data.totp}
      label="2FA Code"
      placeholder="123456"
      pattern={'\\d{6}'}
      minlength={6}
      maxlength={6}
    />
    <Button
      loading={data.loading}
      disabled={data.loading}
      large
      color={Color.accent}
      submit
    >
      Submit
    </Button>
  </form>
</Card>
<!-- </div> -->
