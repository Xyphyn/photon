<script lang="ts">
  import { goto } from '$app/navigation'
  import { page } from '$app/state'
  import { type ClientType, DEFAULT_CLIENT_TYPE } from '$lib/api/base'
  import { client } from '$lib/api/client.svelte'
  import { LemmyClient } from '$lib/api/lemmy/adapter'
  import { PiefedClient } from '$lib/api/piefed/adapter'
  import { profile } from '$lib/app/auth.svelte'
  import { errorMessage } from '$lib/app/error'
  import { t } from '$lib/app/i18n'
  import {
    DEFAULT_INSTANCE_URL,
    LINKED_INSTANCE_URL,
  } from '$lib/app/instance.svelte'
  import { DOMAIN_REGEX_FORMS } from '$lib/app/util.svelte'
  import ErrorContainer, {
    clearErrorScope,
    pushError,
  } from '$lib/ui/info/ErrorContainer.svelte'
  import { Header } from '$lib/ui/layout'
  import { Button, Note, Option, Select, TextInput, toast } from 'mono-svelte'
  import {
    Icon,
    Identification,
    QuestionMarkCircle,
    UserCircle,
  } from 'svelte-hero-icons/dist'

  interface Props {
    ref?: string
    children?: import('svelte').Snippet
  }

  let { ref = page.url.searchParams.get('redirect') ?? '/', children }: Props =
    $props()

  let data = $state<{
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

  async function logIn() {
    data.loading = true
    clearErrorScope(page.route.id)

    try {
      // leading HTTPS is redundant
      data.instance = data.instance.trim().replace(/^https:\/\//, '')

      const response = await client({
        instanceURL: data.instance,
        clientType: data.client,
        auth: '',
      }).login({
        username_or_email: data.username.trim(),
        password: data.password,
        totp_2fa_token: data.totp,
      })

      if (response?.jwt) {
        const result = await profile.add(
          response.jwt,
          data.instance,
          data.client,
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
                  (data.attempts == 0 || data.attempts >= 12
                    ? ''
                    : `_${data.attempts + 1}`),
              )
            : errorMessage(error),
        scope: page.route.id!,
      })
      data.attempts++
    }
    data.loading = false
  }
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
    {#if data.client.name == 'piefed'}
      <Note>
        {$t('account.piefedGate')}
      </Note>
    {/if}
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
          class="flex-1 overflow-hidden"
          required
          pattern={DOMAIN_REGEX_FORMS}
          autocorrect="off"
          autocapitalize="off"
        >
          {#snippet suffix()}
            <Select
              bind:value={
                () => {
                  if (data.client.name == 'lemmy') return 'lemmyv3'
                  else return 'piefedvalpha'
                },
                (v) => {
                  if (v == 'lemmyv3')
                    data.client = { name: 'lemmy', baseUrl: '/api/v3' }
                  else data.client = { name: 'piefed', baseUrl: '/api/alpha' }
                }
              }
              class="border-y-0! border-r-0! rounded-none! border-l max-w-24"
            >
              <Option data-label="true" value="placeholder" disabled>
                {$t('form.instanceType')}
              </Option>
              <Option value="lemmyv3">Lemmy</Option>
              <Option value="piefedvalpha">Piefed</Option>
            </Select>
          {/snippet}
        </TextInput>
      {/if}
    </div>
    <div role="presentation" class="flex flex-row gap-2">
      <TextInput
        id="password"
        bind:value={data.password}
        label={$t('form.password')}
        type="password"
        minlength={data.client.name == 'piefed'
          ? PiefedClient.constants.password.minLength
          : LemmyClient.constants.password.minLength}
        maxlength={data.client.name == 'piefed'
          ? PiefedClient.constants.password.maxLength
          : LemmyClient.constants.password.maxLength}
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
    <hr class="border-slate-200 dark:border-zinc-800" />
    <div class="flex flex-row items-center gap-2 overflow-auto *:shrink-0">
      <Button rounding="pill" color="ghost" href="/signup">
        <Icon src={Identification} mini size="16" />
        {$t('account.signup')}
      </Button>
      <Button rounding="pill" color="ghost" href="/login_reset">
        <Icon src={QuestionMarkCircle} mini size="16" />
        {$t('form.forgotpassword')}
      </Button>
      {#if !LINKED_INSTANCE_URL}
        <Button rounding="pill" color="ghost" href="/login/guest">
          <Icon src={UserCircle} mini size="16" />
          {$t('account.guest')}
        </Button>
      {/if}
    </div>
  </form>
</div>
