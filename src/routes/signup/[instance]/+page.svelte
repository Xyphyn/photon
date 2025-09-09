<script lang="ts">
  import { goto } from '$app/navigation'
  import { page } from '$app/state'
  import { profile } from '$lib/auth.svelte.js'
  import { getClient } from '$lib/client/lemmy.svelte'
  import type { GetCaptchaResponse } from '$lib/client/types'
  import ErrorContainer, {
    clearErrorScope,
    pushError,
  } from '$lib/components/error/ErrorContainer.svelte'
  import SiteCard from '$lib/components/lemmy/instance/InstanceCard.svelte'
  import Markdown from '$lib/components/markdown/Markdown.svelte'
  import MarkdownEditor from '$lib/components/markdown/MarkdownEditor.svelte'
  import Avatar from '$lib/components/ui/Avatar.svelte'
  import { Header } from '$lib/components/ui/layout'
  import Placeholder from '$lib/components/ui/Placeholder.svelte'
  import { t } from '$lib/i18n/translations.js'
  import { errorMessage } from '$lib/lemmy/error.js'
  import {
    Button,
    Label,
    Material,
    Spinner,
    Switch,
    TextInput,
    toast,
  } from 'mono-svelte'
  import {
    ArrowLeft,
    ArrowPath,
    ExclamationCircle,
    ExclamationTriangle,
    Icon,
    Plus,
    QuestionMarkCircle,
    XCircle,
  } from 'svelte-hero-icons'

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
    captcha: GetCaptchaResponse | null = $state(null),
    verifyCaptcha: string | undefined = $state(undefined),
    application: string = $state(''),
    submitting: boolean = $state(false),
    honeypot: string | undefined = $state(undefined),
    nsfw: boolean = $state(false),
    verifying: boolean = $state(false)

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
        await profile.add(res.jwt, page.params.instance)

        toast({ content: $t('toast.logIn'), type: 'success' })
        goto('/')
      } else if (
        res.verify_email_sent ||
        registrationMode == 'RequireApplication'
      ) {
        if (res.verify_email_sent) return (stage = 'verify')

        if (registrationMode == 'RequireApplication')
          return stage == 'application'
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
        await profile.add(res.jwt, page.params.instance)
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

<div class="flex flex-col md:flex-row flex-1/3 gap-8 h-full max-w-5xl mx-auto">
  {#if stage == 'signup'}
    <form
      class="flex flex-col gap-4 h-full w-full flex-2/3"
      onsubmit={(e) => {
        e.preventDefault()
        submit()
      }}
    >
      <Button href="/accounts" class=" mb-4 w-max" rounding="pill">
        <Icon src={ArrowLeft} size="16" micro />
        {$t('common.back')}
      </Button>
      <Header>
        {$t('form.signup.title')}
        {#snippet extended()}
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
        {/snippet}
      </Header>
      <ErrorContainer scope={page.url.pathname} />

      {#if data.site_view.local_site.registration_mode != 'Closed'}
        <div class="flex flex-col md:flex-row gap-2 *:flex-1">
          <TextInput
            bind:value={email}
            label={$t('form.email')}
            required={data.site_view.local_site.require_email_verification}
            type="email"
          />
          <TextInput
            bind:value={username}
            label={$t('form.username')}
            required
          />
        </div>
        <div class="flex flex-col md:flex-row gap-2 *:flex-1">
          <TextInput
            bind:value={password}
            label={$t('form.password')}
            required
            type="password"
          />
          <TextInput
            bind:value={passwordVerify}
            label={$t('form.confirmPassword')}
            required
            type="password"
          />
        </div>
        {#if data.site_view.local_site.registration_mode == 'RequireApplication'}
          <Material
            rounding="2xl"
            color="none"
            class="bg-yellow-200/10 border border-yellow-500/30 text-yellow-900 dark:text-yellow-50"
          >
            <Icon
              src={ExclamationTriangle}
              size="32"
              mini
              class="inline-block rounded-lg bg-yellow-500 p-1 text-white clear-both float-left mr-2"
            />
            {$t('form.signup.application.info')}
          </Material>
          {#if data.site_view.local_site.application_question}
            <Markdown source={data.site_view.local_site.application_question} />
          {/if}
          <MarkdownEditor
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
                <Material
                  padding="sm"
                  class="flex gap-2 dark:text-yellow-200 text-yellow-800 bg-yellow-500/20"
                >
                  <Icon src={ExclamationCircle} mini size="24" />
                  {err}
                </Material>
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
  <Material
    color="uniform"
    class="flex-1/3 overflow-auto max-h-full max-md:hidden"
    rounding="2xl"
    padding="none"
  >
    <SiteCard
      admins={data.admins}
      site={data.site_view}
      taglines={data.taglines}
      version={data.version}
      class="w-full p-4"
    />
  </Material>
</div>
