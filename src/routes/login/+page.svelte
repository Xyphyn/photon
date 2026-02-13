<script lang="ts">
  import { goto } from '$app/navigation'
  import { page } from '$app/state'
  import {
    BaseClient,
    type ClientType,
    DEFAULT_CLIENT_TYPE,
  } from '$lib/api/base'
  import { client } from '$lib/api/client.svelte'
  import { LemmyClient } from '$lib/api/lemmy/adapter'
  import { PiefedClient } from '$lib/api/piefed/adapter'
  import { profile } from '$lib/app/auth'
  import { errorMessage } from '$lib/app/error'
  import { t } from '$lib/app/i18n'
  import {
    DEFAULT_INSTANCE_URL,
    LINKED_INSTANCE_URL,
  } from '$lib/app/instance.svelte'
  import { DOMAIN_REGEX_FORMS, instanceToURL } from '$lib/app/util.svelte'
  import ErrorContainer, {
    clearErrorScope,
    pushError,
  } from '$lib/ui/info/ErrorContainer.svelte'
  import { Header } from '$lib/ui/layout'
  import {
    Button,
    ButtonGroup,
    Note,
    Spinner,
    TextInput,
    toast,
  } from 'mono-svelte'
  import { debounce } from 'mono-svelte/util/time'
  import {
    Identification,
    QuestionMarkCircle,
    UserCircle,
  } from 'svelte-hero-icons/dist'
  import { expoOut } from 'svelte/easing'
  import { fly } from 'svelte/transition'

  interface Props {
    ref?: string
    children?: import('svelte').Snippet
  }

  let { ref = page.url.searchParams.get('redirect') ?? '/', children }: Props =
    $props()

  let form = $state<{
    instance: string
    username: string
    password: string
    totp: string
    loading: boolean
    attempts: number
    client: ClientType
  }>({
    instance: DEFAULT_INSTANCE_URL,
    username: '',
    password: '',
    totp: '',
    loading: false,
    attempts: 0,
    client: DEFAULT_CLIENT_TYPE,
  })

  async function checkInstance() {
    const type = await BaseClient.fetchInfo(
      new URL(instanceToURL(form.instance)),
    )
    if (type == null) throw Error('not_live_supported')
    form.client = type?.type
  }

  async function logIn() {
    form.loading = true
    clearErrorScope(page.route.id)

    try {
      // leading HTTPS is redundant
      form.instance = form.instance.trim().replace(/^https:\/\//, '')

      if (!LINKED_INSTANCE_URL) await checkInstance()

      const response = await client({
        instanceURL: form.instance,
        clientType: form.client,
        auth: '',
      }).login({
        username_or_email: form.username.trim(),
        password: form.password,
        totp_2fa_token: form.totp,
      })

      if (response?.jwt) {
        const result = await profile.add(
          response.jwt,
          form.instance,
          form.client,
        )

        if (result) {
          toast({ content: $t('toast.logIn'), type: 'success' })
          goto(ref)
        }
      } else {
        throw new Error('Invalid credentials')
      }
    } catch (error) {
      pushError({
        message:
          // @ts-expect-error cursed json hack
          JSON.parse((error as object)?.body?.message ?? '{}')?.error ==
          'incorrect_login'
            ? errorMessage(
                'incorrect_login' +
                  (form.attempts == 0 || form.attempts >= 12
                    ? ''
                    : `_${form.attempts + 1}`),
              )
            : errorMessage(error),
        scope: page.route.id!,
      })
      form.attempts++
    }
    form.loading = false
  }

  let detectedClient = $state<string | null | undefined>()

  const checkDebounce = debounce(async () => {
    const startingText = form.instance
    try {
      detectedClient = null
      await checkInstance()
      // so that debounce desync thing doesnt happen
      if (startingText == form.instance) detectedClient = form.client.name
    } catch {
      if (startingText == form.instance) detectedClient = undefined
    }
  }, 500)

  $effect(() => {
    if (form.instance) checkDebounce()
  })
</script>

<svelte:head>
  <title>{$t('account.login')}</title>
</svelte:head>

<div class="max-w-xl w-full mx-auto h-max my-auto">
  <form
    onsubmit={(e) => {
      e.preventDefault()
      logIn()
    }}
    class="flex flex-col gap-5"
  >
    <div class="flex flex-col">
      {@render children?.()}
      <Header>{$t('account.login')}</Header>
      <ErrorContainer class="pt-2" scope={page.route.id} />
    </div>
    {#if form.client.name == 'piefed'}
      <Note>
        {$t('account.piefedGate')}
      </Note>
    {/if}
    <div class="flex flex-row w-full items-center gap-2">
      <TextInput
        id="username"
        bind:value={form.username}
        label={$t('form.username')}
        class="flex-1"
        required
      />
      {#if !LINKED_INSTANCE_URL}
        <TextInput
          id="instance_url"
          placeholder={DEFAULT_INSTANCE_URL}
          disabled={LINKED_INSTANCE_URL != undefined}
          bind:value={form.instance}
          class="flex-1 overflow-hidden"
          required
          pattern={DOMAIN_REGEX_FORMS}
          autocorrect="off"
          autocapitalize="off"
        >
          {#snippet customLabel()}
            {$t('form.instance')}
            <span class="absolute right-0">
              {#if detectedClient}
                <span
                  class="capitalize font-normal"
                  in:fly={{ duration: 300, y: 2, easing: expoOut }}
                >
                  {detectedClient}
                </span>
              {:else if detectedClient === null}
                <Spinner />
              {/if}
            </span>
          {/snippet}
        </TextInput>
      {/if}
    </div>
    <div role="presentation" class="flex flex-row gap-2">
      <TextInput
        id="password"
        bind:value={form.password}
        label={$t('form.password')}
        type="password"
        minlength={form.client.name == 'piefed'
          ? PiefedClient.constants.password.minLength
          : LemmyClient.constants.password.minLength}
        maxlength={form.client.name == 'piefed'
          ? PiefedClient.constants.password.maxLength
          : LemmyClient.constants.password.maxLength}
        required
        class="w-full"
      />
      <TextInput
        id="totp"
        bind:value={form.totp}
        label={$t('form.2fa')}
        placeholder="123456"
        pattern={'\\d{6}'}
        minlength={6}
        maxlength={6}
        class="w-24"
      />
    </div>
    <Button
      loading={form.loading}
      disabled={form.loading}
      color="primary"
      size="lg"
      submit
    >
      {$t('account.login')}
    </Button>
    <hr class="border-slate-200 dark:border-zinc-800" />
    <ButtonGroup orientation="horizontal" class="flex overflow-auto">
      <Button href="/signup" icon={Identification}>
        {$t('account.signup')}
      </Button>
      <Button href="/login_reset" icon={QuestionMarkCircle}>
        {$t('form.forgotpassword')}
      </Button>
      {#if !LINKED_INSTANCE_URL}
        <Button href="/login/guest" icon={UserCircle}>
          {$t('account.guest')}
        </Button>
      {/if}
    </ButtonGroup>
  </form>
</div>
