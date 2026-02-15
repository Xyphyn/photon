<script lang="ts">
  import { goto } from '$app/navigation'
  import { page } from '$app/state'
  import type { ClientType } from '$lib/api/base.js'
  import { getClient } from '$lib/api/client.svelte'
  import type { GetCaptchaResponse } from '$lib/api/types'
  import { profile } from '$lib/app/auth'
  import { errorMessage } from '$lib/app/error'
  import { t } from '$lib/app/i18n'
  import Markdown from '$lib/app/markdown/Markdown.svelte'
  import Blobs from '$lib/ui/generic/Blobs.svelte'
  import ErrorContainer, {
    clearErrorScope,
    pushError,
  } from '$lib/ui/info/ErrorContainer.svelte'
  import Placeholder from '$lib/ui/info/Placeholder.svelte'
  import { Header } from '$lib/ui/layout'
  import {
    Button,
    Label,
    Material,
    Spinner,
    Switch,
    TextArea,
    TextInput,
    toast,
  } from 'mono-svelte'
  import {
    ArrowLeft,
    ArrowPath,
    AtSymbol,
    Envelope,
    ExclamationTriangle,
    Icon,
    Key,
    Plus,
    QuestionMarkCircle,
    XCircle,
  } from 'svelte-hero-icons/dist'

  let { data } = $props()

  let stage = $state<'signup' | 'verify' | 'application'>('signup')

  const instance = page.params.instance
  let captchaRequired = data.site_view.local_site.captcha_enabled
  let email: string | undefined = $state('')

  $effect(() => {
    if (email == '') email = undefined
  })

  let username = $state(''),
    password = $state(''),
    passwordVerify = $state(''),
    captcha = $state<GetCaptchaResponse>(),
    verifyCaptcha = $state<string>(),
    application = $state(''),
    submitting = $state(false),
    honeypot = $state<string>(),
    nsfw = $state(false),
    verifying = $state(false)

  const instanceType: ClientType = $state({ name: 'lemmy', baseUrl: '/api/v3' })

  const getCaptcha = async () =>
    (captcha = await getClient(instance, fetch).getCaptcha())

  let captchaAudio = $derived(
    captcha?.ok?.wav ? `data:audio/wav;base64,${captcha.ok.wav}` : '',
  )

  async function submit() {
    clearErrorScope(page.url.pathname)
    submitting = true

    try {
      const res = await getClient(instance, fetch).register({
        username: username,
        email: email,
        password: password,
        password_verify: passwordVerify,
        show_nsfw: nsfw,
        answer: application,
        captcha_answer: verifyCaptcha,
        captcha_uuid: captcha?.ok?.uuid,
        honeypot,
      })

      const registrationMode = data.site_view.local_site.registration_mode

      if (res?.jwt) {
        await profile.add(res.jwt, page.params.instance!, instanceType)

        toast({ content: $t('toast.logIn'), type: 'success' })
        goto('/')
      } else if (
        res.verify_email_sent ||
        registrationMode == 'RequireApplication'
      ) {
        if (res.verify_email_sent) return (stage = 'verify')

        if (registrationMode == 'RequireApplication')
          return (stage = 'application')
      } else {
        throw new Error($t('toast.failSignup'))
      }

      toast({
        content: $t('toast.successSignup'),
        type: 'success',
      })
    } catch (err) {
      pushError({
        scope: page.url.pathname,
        message: errorMessage(err as string),
      })
    }
    submitting = false
  }

  async function verifiedEmail() {
    verifying = true
    clearErrorScope(page.url.pathname)
    try {
      const res = await getClient(instance, fetch).login({
        username_or_email: username,
        password: password,
      })

      if (res.jwt) {
        await profile.add(res.jwt, data.instance, instanceType)
        goto('/')
      } else if (res.verify_email_sent) {
        pushError({
          scope: page.url.pathname,
          message: $t('form.signup.verify.error'),
        })
      } else {
        stage = 'application'
      }
    } catch (err) {
      pushError({
        scope: page.url.pathname,
        message: errorMessage(err as string),
      })
    }
    verifying = false
  }
</script>

<svelte:head>
  <title>{$t('account.signup')}</title>
</svelte:head>

<div class="flex flex-col md:flex-row flex-1/2 gap-8 h-full max-w-6xl mx-auto">
  {#if stage == 'signup'}
    <form
      class="flex flex-col gap-4 h-full w-full flex-2/3"
      onsubmit={(e) => {
        e.preventDefault()
        submit()
      }}
    >
      <Button href="/accounts" class=" mb-4 w-max">
        <Icon src={ArrowLeft} size="16" micro />
        {$t('common.back')}
      </Button>
      <Header>
        {$t('form.signup.title')}
        <!-- {#snippet extended()}
          <span class="flex gap-4 items-center text-xl text-center mx-auto">
            {#if data.site_view.site.icon}
              <Avatar
                circle={false}
                width={48}
                url={data.site_view.site.icon}
              />
            {/if}
            {data.site_view.site.name}
          </span>
        {/snippet} -->
      </Header>
      <ErrorContainer scope={page.url.pathname} />

      {#if data.site_view.local_site.registration_mode != 'Closed'}
        <div class="flex flex-col md:flex-row gap-2 *:flex-1">
          <TextInput
            bind:value={email}
            label={$t('form.email')}
            required={data.site_view.local_site.require_email_verification}
            type="email"
            icon={Envelope}
            size="md"
          />
          <TextInput
            bind:value={username}
            label={$t('form.username')}
            required
            icon={AtSymbol}
          />
        </div>
        <div class="flex flex-col md:flex-row *:flex-1 gap-2">
          <TextInput
            bind:value={password}
            label={$t('form.password')}
            required
            type="password"
            icon={Key}
          />
          <TextInput
            bind:value={passwordVerify}
            label={$t('form.confirmPassword')}
            required
            type="password"
            icon={Key}
          />
        </div>
        {#if data.site_view.local_site.registration_mode == 'RequireApplication'}
          <Material rounding="2xl" color="warning" icon={ExclamationTriangle}>
            {$t('form.signup.application.info')}
          </Material>
          <Material rounding="2xl" color="info">
            {#if data.site_view.local_site.application_question}
              <Markdown
                source={data.site_view.local_site.application_question}
              />
            {/if}
          </Material>
          <TextArea
            label={$t('form.signup.application.label')}
            required
            bind:value={application}
          />
        {/if}
        {#if captchaRequired}
          <Label class="block -mb-3 font-medium text-sm">Captcha</Label>
          <Material rounding="2xl">
            <div class="flex flex-col gap-4">
              {#await getCaptcha()}
                <Spinner width={32} />
              {:then}
                {#if captcha?.ok}
                  <img
                    src="data:image/png;base64,{captcha.ok.png}"
                    alt="Captcha"
                    class="w-max"
                  />
                  <audio controls src={captchaAudio}></audio>
                {:else}
                  <Material
                    class="flex gap-2 dark:text-yellow-200 text-yellow-800 bg-yellow-500/20"
                  >
                    <Icon src={QuestionMarkCircle} mini size="24" />
                    No captcha was returned
                  </Material>
                {/if}
              {:catch err}
                <ErrorContainer message={errorMessage(err)} />
              {/await}
              <Button onclick={() => getCaptcha()} size="square-md">
                <Icon src={ArrowPath} size="16" mini />
              </Button>
              <TextInput required bind:value={verifyCaptcha} />
            </div>
          </Material>
        {/if}
        <Switch bind:checked={nsfw}>{$t('form.profile.showNSFW')}</Switch>
        <input type="dn" name="honeypot" bind:value={honeypot} class="hidden" />
        <Button
          submit
          color="primary"
          size="lg"
          loading={submitting}
          disabled={submitting}
          class="mt-auto"
        >
          {$t('form.submit')}
        </Button>
      {:else}
        <div class="my-auto">
          <Placeholder
            icon={XCircle}
            title={$t('form.signup.closed.title')}
            description={$t('form.signup.closed.description')}
          >
            <Button icon={Plus} href="/signup">
              {$t('form.signup.closed.anotherInstance')}
            </Button>
          </Placeholder>
        </div>
      {/if}
    </form>
  {:else if stage == 'verify'}
    <div class="flex-2/3 flex flex-col h-full justify-center gap-8">
      <ErrorContainer scope={page.url.pathname} />
      <h2 class="font-medium text-3xl">{$t('toast.verifyEmail')}</h2>
      <form
        onsubmit={(e) => {
          e.preventDefault()
          verifiedEmail()
        }}
        class="flex items-center gap-2"
      >
        <Button
          loading={verifying}
          disabled={verifying}
          submit
          color="primary"
          rounding="pill"
          class="self-start"
        >
          {$t('form.signup.verify.submit')}
        </Button>
        <Button href="/signup" rounding="pill">
          <Icon src={ArrowLeft} size="16" micro />
          {$t('common.back')}
        </Button>
      </form>
    </div>
  {:else if stage == 'application'}
    <div class="flex-2/3 flex flex-col h-full justify-center gap-8">
      <h2 class="font-medium text-3xl">
        {$t('form.signup.application.notice')}
      </h2>
      <Button href="/signup" rounding="pill">
        <Icon src={ArrowLeft} size="16" micro />
        {$t('common.back')}
      </Button>
    </div>
  {/if}
  <div class="flex-1/2 flex flex-col gap-2">
    <Material rounding="2xl" class="overflow-hidden relative h-36">
      <div class="-m-4 opacity-30 mask-b-from-0 absolute inset-0">
        <Blobs seed="1" />
      </div>
    </Material>
  </div>
</div>
