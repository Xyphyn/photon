<script lang="ts">
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import { setUser } from '$lib/auth.js'
  import Markdown from '$lib/components/markdown/Markdown.svelte'
  import MarkdownEditor from '$lib/components/markdown/MarkdownEditor.svelte'
  import Avatar from '$lib/components/ui/Avatar.svelte'
  import Placeholder from '$lib/components/ui/Placeholder.svelte'
  import { Checkbox, Material, Spinner, toast } from 'mono-svelte'
  import { getClient } from '$lib/lemmy.js'
  import type { GetCaptchaResponse } from 'lemmy-js-client'
  import { Button, TextInput } from 'mono-svelte'
  import {
    ArrowPath,
    ExclamationCircle,
    ExclamationTriangle,
    Icon,
    Plus,
    QuestionMarkCircle,
    XCircle,
  } from 'svelte-hero-icons'
  import { instance as currentInstance } from '$lib/instance.js'

  export let data

  const instance = $page.params.instance

  let captchaRequired = data.site_view.local_site.captcha_enabled

  let email: string | undefined = ''

  $: if (email == '') email = undefined

  let username = '',
    password = '',
    passwordVerify = '',
    captcha: GetCaptchaResponse | null = null,
    verifyCaptcha: string | undefined = undefined,
    application: string | undefined = undefined,
    submitting: boolean = false,
    honeypot: string | undefined = undefined,
    nsfw: boolean = false

  const getCaptcha = async () =>
    (captcha = await getClient(instance, fetch).getCaptcha())

  $: captchaAudio = captcha?.ok?.wav
    ? `data:audio/wav;base64,${captcha.ok.wav}`
    : ''

  async function submit() {
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

      if (res?.jwt) {
        await setUser(res.jwt, $page.params.instance, username)

        toast({ content: 'Successfully logged in.', type: 'success' })
        goto('/')
      } else if (
        res.verify_email_sent ||
        data.site_view.local_site.registration_mode == 'RequireApplication'
      ) {
        currentInstance.set(instance)
        if (res.verify_email_sent) {
          toast({
            content:
              'A verification link was sent to your email. Verify your email, and then you can log in.',
            type: 'info',
          })
        }
        if (
          data.site_view.local_site.registration_mode == 'RequireApplication'
        ) {
          toast({
            content:
              'Please wait for your registration application to be approved before you can log in.',
            type: 'info',
          })
        }
        goto('/')
      } else {
        throw new Error('Failed to sign up.')
      }

      toast({
        content: 'Signed up.',
        type: 'success',
      })
    } catch (err) {
      toast({
        content: err as any,
        type: 'error',
      })
    }
    submitting = false
  }
</script>

<svelte:head>
  <title>Sign up</title>
</svelte:head>

<form
  class="flex flex-col gap-4 max-w-2xl mx-auto h-full w-full"
  on:submit|preventDefault={submit}
>
  <span class="flex gap-4 items-center font-bold text-xl text-center mx-auto">
    {#if data.site_view.site.icon}
      <Avatar circle={false} width={48} url={data.site_view.site.icon} />
    {/if}
    {data.site_view.site.name}
  </span>

  {#if data.site_view.local_site.registration_mode != 'Closed'}
    <h1 class="font-bold text-3xl">Create account</h1>
    <TextInput
      bind:value={email}
      label="Email"
      required={data.site_view.local_site.require_email_verification}
      type="email"
    />
    <TextInput bind:value={username} label="Username" required />
    <TextInput
      bind:value={password}
      label="Password"
      required
      type="password"
    />
    <TextInput
      bind:value={passwordVerify}
      label="Confirm Password"
      required
      type="password"
    />
    {#if data.site_view.local_site.registration_mode == 'RequireApplication'}
      <Material class="dark:text-yellow-200 text-yellow-800 bg-yellow-500/20">
        <Icon src={ExclamationTriangle} mini size="20" />
        To join this instance, you must fill out this application, and wait to be
        accepted. You will receive an email if your application is accepted.
      </Material>
      {#if data.site_view.local_site.application_question}
        <Markdown source={data.site_view.local_site.application_question} />
      {/if}
      <MarkdownEditor
        label="Application"
        required
        placeholder="An explanation of why you think this instance is awesome"
        bind:value={application}
      />
    {/if}
    {#if captchaRequired}
      <div>
        <div class="block my-1 font-bold text-sm">Captcha</div>
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
              <audio controls src={captchaAudio} />
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
          <Button on:click={() => getCaptcha()} size="square-md">
            <Icon src={ArrowPath} size="16" mini />
          </Button>
          <TextInput required bind:value={verifyCaptcha} />
        </div>
      </div>
    {/if}
    <Checkbox bind:checked={nsfw}>Show NSFW content</Checkbox>
    <input type="dn" name="honeypot" bind:value={honeypot} class="hidden" />
    <Button
      submit
      color="primary"
      size="lg"
      loading={submitting}
      disabled={submitting}
      class="mt-auto"
    >
      Submit
    </Button>
  {:else}
    <div class="my-auto">
      <Placeholder
        icon={XCircle}
        title="Registrations closed"
        description="New account creation has been disabled on this instance."
      >
        <Button icon={Plus} href="https://join-lemmy.org">
          Find another instance
        </Button>
      </Placeholder>
    </div>
  {/if}
</form>
