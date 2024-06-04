<script lang="ts">
  import { goto } from '$app/navigation'
  import { setUser } from '$lib/auth.js'
  import { Note, toast } from 'mono-svelte'
  import { DEFAULT_INSTANCE_URL, LINKED_INSTANCE_URL } from '$lib/instance.js'
  import {
    getClient,
    mayBeIncompatible,
    site,
    validateInstance,
  } from '$lib/lemmy.js'
  import { Button, TextInput } from 'mono-svelte'
  import {
    Icon,
    Identification,
    QuestionMarkCircle,
    UserCircle,
  } from 'svelte-hero-icons'
  import { DOMAIN_REGEX_FORMS } from '$lib/util.js'
  import { MINIMUM_VERSION } from '$lib/version.js'
  import { t } from '$lib/translations'
  import Header from '$lib/components/ui/layout/pages/Header.svelte'

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
        const result = await setUser(response.jwt, data.instance, data.username)

        if (result) {
          toast({ content: $t('toast.logIn'), type: 'success' })
          goto('/')
        }
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

<div class="max-w-xl w-full mx-auto h-max my-auto">
  <form on:submit|preventDefault={logIn} class="flex flex-col gap-5">
    <div class="flex flex-col gap-2">
      <Header>{$t('account.login')}</Header>
      {#if $site && mayBeIncompatible(MINIMUM_VERSION, $site.version.replace('v', ''))}
        <Note>
          {$t('account.versionGate', {
            //@ts-ignore
            version: `v${MINIMUM_VERSION}`,
          })}
        </Note>
      {/if}
    </div>
    <div class="flex flex-row w-full items-center gap-2">
      <TextInput
        id="username"
        bind:value={data.username}
        label={$t('form.username')}
        class="flex-1"
        required
      />
      {#if !LINKED_INSTANCE_URL}
        <TextInput
          id="instance_url"
          label={$t('form.instance')}
          placeholder={DEFAULT_INSTANCE_URL}
          disabled={LINKED_INSTANCE_URL != undefined}
          bind:value={data.instance}
          class="flex-1"
          required
          pattern={DOMAIN_REGEX_FORMS}
        />
      {/if}
    </div>
    <div class="flex flex-row gap-2">
      <TextInput
        id="password"
        bind:value={data.password}
        label={$t('form.password')}
        type="password"
        minlength={10}
        maxlength={60}
        required
        class="w-full"
      />
      <TextInput
        id="totp"
        bind:value={data.totp}
        label={$t('form.2fa')}
        placeholder="123456"
        pattern={'\\d{6}'}
        minlength={6}
        maxlength={6}
        class="w-24"
      />
    </div>
    <Button
      loading={data.loading}
      disabled={data.loading}
      color="primary"
      size="lg"
      submit
    >
      {$t('account.login')}
    </Button>
    <hr class="dark:border-zinc-700" />
    <div class="flex flex-row items-center gap-2">
      <Button color="tertiary" href="/signup">
        <Icon src={Identification} mini size="16" />
        {$t('account.signup')}
      </Button>
      <Button color="tertiary" href="/login_reset">
        <Icon src={QuestionMarkCircle} mini size="16" />
        {$t('form.forgotpassword')}
      </Button>
      <Button color="tertiary" href="/login/guest">
        <Icon src={UserCircle} mini size="16" />
        {$t('account.guest')}
      </Button>
    </div>
  </form>
</div>
