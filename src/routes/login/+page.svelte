<script lang="ts">
  import { goto } from '$app/navigation'
  import Button from '$lib/components/input/Button.svelte'
  import TextInput from '$lib/components/input/TextInput.svelte'
  import Card from '$lib/components/ui/Card.svelte'
  import { ToastType, addToast } from '$lib/components/ui/toasts/toasts.js'
  import { DEFAULT_INSTANCE_URL, authData, getClient } from '$lib/lemmy.js'
  import { Color } from '$lib/ui/colors.js'

  let data = {
    instance: DEFAULT_INSTANCE_URL,
    username: '',
    password: '',
    loading: false,
  }

  async function validateURL(instance: string): Promise<boolean> {
    if (instance == '') return false

    try {
      await getClient(instance).getSite({})
    } catch (err) {
      throw new Error('Invalid instance URL')
    }

    return true
  }

  async function logIn() {
    data.loading = true
    try {
      if (!(await validateURL(data.instance))) {
        throw new Error('Invalid instance URL')
      }

      const response = await getClient(data.instance).login({
        username_or_email: data.username,
        password: data.password,
      })

      if (response?.jwt) {
        authData.set({
          instance: data.instance,
          token: response.jwt,
          username: data.username,
        })

        addToast('Success', 'Successfully logged in.', ToastType.success)
        goto('/')
      } else {
        throw new Error('Invalid credentials')
      }
    } catch (error) {
      addToast('Error', error as any, ToastType.error)
    }
    data.loading = false
  }
</script>

<svelte:head>Login</svelte:head>

<Card class="mx-auto p-6 max-w-lg">
  <form on:submit|preventDefault={logIn} class="flex flex-col gap-4">
    <h1 class="font-bold text-lg">Log in</h1>
    <TextInput
      bind:value={data.instance}
      label="Instance URL"
      placeholder="lemmy.world"
    />
    <TextInput
      bind:value={data.username}
      label="Username"
      placeholder="Example"
    />
    <TextInput bind:value={data.password} label="Password" type="password" />
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
