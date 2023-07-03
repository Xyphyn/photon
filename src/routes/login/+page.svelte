<script lang="ts">
  import Button from '$lib/components/input/Button.svelte'
  import TextInput from '$lib/components/input/TextInput.svelte'
  import Card from '$lib/components/ui/Card.svelte'
  import { DEFAULT_INSTANCE_URL, authData, getClient } from '$lib/lemmy.js'
  import { Color } from '$lib/ui/colors.js'

  let data = {
    username: '',
    password: '',
    loading: false,
  }

  async function logIn() {
    data.loading = true
    try {
      const response = await getClient().login({
        username_or_email: data.username,
        password: data.password,
      })

      if (response.jwt) {
        authData.set({
          instance: DEFAULT_INSTANCE_URL,
          token: response.jwt,
          username: data.username,
        })
      }
    } catch (error) {
      alert('failed')
    }
    data.loading = false
  }
</script>

<Card class="mx-auto p-6">
  <form on:submit|preventDefault={logIn} class="flex flex-col gap-4">
    <h1 class="font-bold text-lg">Log in</h1>
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
    >
      Submit
    </Button>
  </form>
</Card>
