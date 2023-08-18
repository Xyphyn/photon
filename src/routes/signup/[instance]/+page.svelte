<script lang="ts">
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import { setUser } from '$lib/auth.js'
  import Button from '$lib/components/input/Button.svelte'
  import TextArea from '$lib/components/input/TextArea.svelte'
  import TextInput from '$lib/components/input/TextInput.svelte'
  import Markdown from '$lib/components/markdown/Markdown.svelte'
  import Avatar from '$lib/components/ui/Avatar.svelte'
  import Card from '$lib/components/ui/Card.svelte'
  import Spinner from '$lib/components/ui/loader/Spinner.svelte'
  import { toast } from '$lib/components/ui/toasts/toasts.js'
  import { getClient } from '$lib/lemmy.js'
  import type { GetCaptchaResponse } from 'lemmy-js-client'
  import {
    ExclamationTriangle,
    Icon,
    QuestionMarkCircle,
  } from 'svelte-hero-icons'

  export let data

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
    honeypot: string | undefined = undefined

  const getCaptcha = async () => (captcha = await getClient().getCaptcha())

  $: captchaAudio = captcha?.ok?.wav
    ? `data:audio/wav;base64,${captcha.ok.wav}`
    : ''

  async function submit() {
    submitting = true

    try {
      const res = await getClient().register({
        username: username,
        email: email,
        password: password,
        password_verify: passwordVerify,
        show_nsfw: true,
        answer: application,
        captcha_answer: verifyCaptcha,
        captcha_uuid: captcha?.ok?.uuid,
        honeypot,
      })

      toast({
        content: `Signed up.${
          res.verify_email_sent ? ' A verification email was sent.' : ''
        }`,
        type: 'success',
      })

      if (res?.jwt) {
        await setUser(res.jwt, $page.params.instance, username)

        toast({ content: 'Successfully logged in.', type: 'success' })
        goto('/')
      } else {
        throw new Error('Invalid credentials')
      }
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
  class="flex flex-col gap-4 max-w-2xl mx-auto h-full"
  on:submit|preventDefault={submit}
>
  <span class="flex gap-4 items-center font-bold text-xl text-center mx-auto">
    {#if data.site_view.site.icon}
      <Avatar width={48} url={data.site_view.site.icon} />
    {/if}
    {data.site_view.site.name}
  </span>

  <h1 class="font-bold text-3xl">Create account</h1>
  {#if data.site_view.local_site.registration_mode == 'Closed'}
    <p class="mx-auto text-left">Registrations are closed for this instance.</p>
  {:else}
    <TextInput
      bind:value={email}
      label="Email"
      required={data.site_view.local_site.require_email_verification}
      type="email"
      placeholder="nigerianprince@notascam.com"
    />
    <TextInput
      bind:value={username}
      label="Username"
      required
      placeholder="BobTheDestroyer"
    />
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
      <Card
        class="p-4 dark:text-yellow-200 text-yellow-800"
        cardColor="warning"
      >
        <Icon src={ExclamationTriangle} mini size="20" />
        To join this instance, you need to fill out this application, and wait to
        be accepted.
      </Card>
      {#if data.site_view.local_site.application_question}
        <Markdown source={data.site_view.local_site.application_question} />
      {/if}
      <TextArea
        label="Application"
        required
        placeholder="i like this instance's icon "
        bind:value={application}
      />
    {/if}
    {#if captchaRequired}
      <div>
        <div class="block my-1 font-bold text-sm">Captcha</div>
        {#await getCaptcha()}
          <Spinner width={32} />
        {:then}
          {#if captcha?.ok}
            <div class="flex flex-col gap-4">
              <img
                src="data:image/png;base64,{captcha.ok.png}"
                alt="Captcha"
                class="w-max"
              />
              <audio controls src={captchaAudio} />
              <TextInput
                required
                bind:value={verifyCaptcha}
                placeholder="i guess i'm a robot"
              />
            </div>
          {:else}
            <div class="flex gap-2">
              <Icon src={QuestionMarkCircle} mini size="24" />
              No captcha was returned :(
            </div>
          {/if}
        {/await}
      </div>
    {/if}
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
  {/if}
</form>
