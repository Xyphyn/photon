<script lang="ts">
  import { goto } from '$app/navigation'
  import { setUser } from '$lib/auth.js'
  import Button from '$lib/components/input/Button.svelte'
  import Link from '$lib/components/input/Link.svelte'
  import TextInput from '$lib/components/input/TextInput.svelte'
  import Card from '$lib/components/ui/Card.svelte'
  import { toast } from '$lib/components/ui/toasts/toasts.js'
  import { DEFAULT_INSTANCE_URL, LINKED_INSTANCE_URL } from '$lib/instance.js'
  import { getClient, validateInstance } from '$lib/lemmy.js'

  let data = {
    instance: DEFAULT_INSTANCE_URL,
    username: '',
    password: '',
    totp: '',
    loading: false,
  }

  async function logIn() {
    data.loading = true

    try {
      data.instance = data.instance.trim()
      if (!(await validateInstance(data.instance))) {
        throw new Error('Failed to contact that instance. Is it down?')
      }

      const response = await getClient(data.instance).login({
        username_or_email: data.username.trim(),
        password: data.password,
        totp_2fa_token: data.totp,
      })

      if (response?.jwt) {
        await setUser(response.jwt, data.instance, data.username)

        toast({ content: 'Successfully logged in.', type: 'success' })
        goto('/')
      } else {
        throw new Error('Invalid credentials')
      }
    } catch (error) {
      toast({
        content: error as any,
        type: 'error',
      })
    }
    data.loading = false
  }
</script>

<svelte:head>
  <title>Login</title>
</svelte:head>

<div class="max-w-lg w-full mx-auto">
  <form on:submit|preventDefault={logIn} class="flex flex-col gap-6">
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
        disabled={LINKED_INSTANCE_URL != undefined}
        bind:value={data.instance}
        class="flex-1"
        required
        pattern={'(?!-)[A-Za-z0-9-]+([-.]{1}[a-z0-9]+)*.[A-Za-z]{2,6}'}
      />
    </div>
    <div class="flex flex-row gap-2">
      <TextInput
        id="password"
        bind:value={data.password}
        label="Password"
        type="password"
        required
        class="w-full"
      />
      <TextInput
        id="totp"
        bind:value={data.totp}
        label="2FA Code"
        placeholder="123456"
        pattern={'\\d{6}'}
        minlength={6}
        maxlength={6}
        class="w-20"
        on:input={(e) => {
          if (!Number.isInteger(Number(e.detail.data))) {
            e.preventDefault()
            data.totp = data.totp.replace(e.detail.data, '')
          }
        }}
      />
    </div>
    <Button
      loading={data.loading}
      disabled={data.loading}
      color="primary"
      size="lg"
      submit
    >
      Log in
    </Button>
    <hr class="dark:border-zinc-700" />
    <p class="text-sm text-center opacity-80">
      Don't have an account? <Link href="/signup" highlight>Sign up</Link>
    </p>
  </form>
</div>
