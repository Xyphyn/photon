<script lang="ts">
  import { goto } from '$app/navigation'
  import { page } from '$app/state'
  import { errorMessage } from '$lib/app/error.js'
  import { t } from '$lib/app/i18n'
  import Markdown from '$lib/app/markdown/Markdown.svelte'
  import MarkdownEditor from '$lib/app/markdown/MarkdownEditor.svelte'
  import { loader } from '$lib/app/util.svelte.js'
  import InstanceCard from '$lib/feature/instance/InstanceCard.svelte'
  import Fixate from '$lib/ui/generic/Fixate.svelte'
  import ErrorContainer, { pushError } from '$lib/ui/info/ErrorContainer.svelte'
  import Header from '$lib/ui/layout/pages/Header.svelte'
  import { Badge, Button, Material, TextInput, TextLoader, toast } from 'mono-svelte'
  import { ArrowPath, AtSymbol, Envelope, ExclamationTriangle, Key } from 'svelte-hero-icons/dist'
  import { expoOut } from 'svelte/easing'
  import { fly } from 'svelte/transition'
  import { SignupForm } from './signup-form.svelte.js'

  let { data } = $props()

  const register = () =>
    loader(
      (v) => (signup.loading = v),
      async () =>
        signup.stage == 'waitVerify'
          ? await signup.submit('verify')
          : await signup.submit('register'),
      () => {
        goto('/')
        toast({
          content: $t('toast.successSignup'),
          type: 'success',
        })
      },
      (e) =>
        pushError({
          scope: page.url.pathname,
          message: errorMessage(e),
        }),
    )

  let signup = $derived(new SignupForm(page.params.instance!, data, register))
  let site = $derived(data.site_view)
  let captchaAudio = $derived(
    signup.captcha?.ok?.wav ? `data:audio/wav;base64,${signup.captcha?.ok.wav}` : '',
  )
</script>

<svelte:head>
  <title>{$t('account.signup')}</title>
</svelte:head>

{#snippet infoPage()}
  <div class="signup-form-page max-w-xl w-full relative">
    {$t('form.signup.stages.info')}
    <Material color="info" rounding="2xl" padding="none" class="max-h-full min-h-0">
      <Markdown
        source={site.local_site.legal_information}
        class="text-base min-h-0 overflow-auto h-full p-6"
      />
    </Material>

    <Fixate placement="bottom">
      <Button onclick={() => signup.next()} size="lg" color="primary" class="w-full">
        {$t('form.signup.next')}
      </Button>
    </Fixate>
  </div>
{/snippet}
{#snippet credentialsPage()}
  <form onsubmit={() => signup.next()} class="signup-form-page max-w-xl w-full">
    <TextInput
      bind:value={signup.form.email}
      label={$t('form.email')}
      required={site.local_site.email_verification_required}
      type="email"
      icon={Envelope}
      size="md"
    />
    <TextInput
      bind:value={signup.form.username}
      label={$t('form.username')}
      required
      icon={AtSymbol}
      minlength={3}
      maxlength={32}
    >
      {#snippet suffix()}
        <div class="my-auto text-sm h-full items-center px-2 hidden md:flex">
          @{signup.instance}
        </div>
      {/snippet}
    </TextInput>
    <TextInput
      bind:value={signup.form.password}
      label={$t('form.password')}
      required
      type="password"
      icon={Key}
      minlength={8}
      maxlength={72}
    />
    <TextInput
      label={$t('form.confirmPassword')}
      required
      type="password"
      icon={Key}
      minlength={8}
      maxlength={72}
      pattern={signup.form.password}
    />
    <Button submit size="lg" color="primary" class="mt-auto">
      {$t('form.signup.next')}
    </Button>
  </form>
{/snippet}
{#snippet captchaPage()}
  <form onsubmit={() => signup.next()} class="signup-form-page max-w-2xl">
    <Material class="overflow-hidden flex flex-col justify-between w-full h-96">
      {#await signup.refreshCaptcha()}
        <TextLoader>Loading captcha...</TextLoader>
      {:then captcha}
        <img src="data:image/png;base64,{captcha.ok?.png}" alt="CAPTCHA" class="-m-4" />
        <div class="flex gap-2 items-center">
          <audio>
            <source src={captchaAudio} />
          </audio>
          <Button size="square-md" icon={ArrowPath} onclick={() => signup}></Button>
        </div>
      {/await}
    </Material>
    <TextInput label="CAPTCHA" placeholder="A82NIA" bind:value={signup.form.captcha} required />
  </form>
{/snippet}
{#snippet submittedPage()}
  <div class="signup-form-page flex justify-center items-center">
    <h2>
      <TextLoader class="text-3xl!">
        {$t('form.signup.registering')}
      </TextLoader>
    </h2>
  </div>
{/snippet}
{#snippet applicationPage()}
  <form onsubmit={() => signup.next()} class="signup-form-page max-w-xl w-full">
    <Material color="warning" icon={ExclamationTriangle} rounding="2xl">
      {$t('form.signup.application.info')}
    </Material>
    <Material color="info" rounding="2xl">
      {site.local_site.application_question}
    </Material>
    <MarkdownEditor
      bind:value={signup.form.application}
      required
      label={$t('form.signup.application.label')}
      placeholder={site.local_site.application_question}
      tools={false}
      previewButton={false}
      rows={4}
    />
    <Button submit size="lg" color="primary" class="mt-auto">
      {$t('form.signup.next')}
    </Button>
  </form>
{/snippet}
{#snippet waitVerifyPage()}{/snippet}
{#snippet waitApplicationPage()}{/snippet}
<div
  class="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-x divide-slate-200 dark:divide-zinc-800 min-h-0 w-full h-full"
>
  <div class="p-16 overflow-auto md:max-h-screen">
    <InstanceCard {site} />
  </div>
  <div
    class="flex flex-col gap-4 p-16 bg-slate-50 dark:bg-zinc-925 col-span-2 max-h-full overflow-auto"
  >
    <Badge class="w-max text-base! px-3">
      {signup.stages.findIndex((i) => i == signup.stage) + 1} / {signup.stages.length}
    </Badge>
    <Header>
      {$t('form.signup.title')}
      {#snippet extended()}
        <ErrorContainer scope={page.url.pathname} />
      {/snippet}
    </Header>

    {#key signup.stage}
      <div
        in:fly={{ duration: 300, y: 8, easing: expoOut, delay: 300 }}
        out:fly={{ duration: 300, y: 8, easing: expoOut }}
        class="flex-1 h-full"
      >
        {#if signup.stage == 'info'}
          {@render infoPage()}
        {:else if signup.stage == 'credentials'}
          {@render credentialsPage()}
        {:else if signup.stage == 'captcha'}
          {@render captchaPage()}
        {:else if signup.stage == 'application'}
          {@render applicationPage()}
        {:else if signup.stage == 'submitted'}
          {@render submittedPage()}
        {:else if signup.stage == 'waitVerify'}
          {@render waitVerifyPage()}
        {:else if signup.stage == 'waitApplication'}
          {@render waitApplicationPage()}
        {/if}
      </div>
    {/key}
  </div>
</div>

<style>
  .signup-form-page {
    display: flex;
    flex-direction: column;
    gap: calc(var(--spacing) * 4);
    height: 100%;
  }
</style>
