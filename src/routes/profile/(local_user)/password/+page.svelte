<script lang="ts">
  import { deleteProfile, profile, setUser } from '$lib/auth.js'
  import { getClient, site } from '$lib/lemmy.js'
  import { trycatch } from '$lib/util.js'
  import { Button, Material, Snippet, TextInput, toast } from 'mono-svelte'
  import { instance as currentInstance } from '$lib/instance.js'
  import { ClipboardDocument, Icon } from 'svelte-hero-icons'
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import Switch from '$lib/components/input/Switch.svelte'
  import { feature } from '$lib/version.js'
  import { qr } from '@svelte-put/qr/svg'
  import { t } from '$lib/translations.js'
  import Header from '$lib/components/ui/layout/pages/Header.svelte'

  export let data

  let oldPassword = '',
    newPassword = '',
    newPasswordVerify = ''
  let loading = false

  let verify_totp = ''

  // @ts-ignore
  let totpLink: string | undefined = undefined
  $: totpEnabled =
    data.my_user?.local_user_view.local_user.totp_2fa_enabled ?? totpLink

  async function changePassword() {
    try {
      if (!$profile?.jwt) return
      loading = true
      const res = await getClient().changePassword({
        new_password: newPassword,
        new_password_verify: newPasswordVerify,
        old_password: oldPassword,
      })
      if (res?.jwt) {
        const { instance, username } = $profile
        deleteProfile($profile.id)
        await setUser(res.jwt, instance, username!)
        $currentInstance = instance

        toast({ content: $t('toast.loginRefresh'), type: 'success' })
      } else {
        throw new Error($t('toast.invalidLogin'))
      }

      toast({ content: $t('toast.passwordReset') })
    } catch (e) {
      toast({
        content: e as any,
        type: 'error',
      })
    }

    loading = false
  }

  async function twofa(enabled: boolean, update: boolean = false) {
    if (!$profile?.jwt) return

    try {
      if (update) {
        await getClient().updateTotp({
          enabled: enabled,
          totp_token: verify_totp,
        })

        toast({
          content: `2FA has been ${enabled ? 'enabled' : 'disabled'}`,
          type: 'success',
        })

        goto($page.url, { invalidateAll: true })
      } else {
        const res = await getClient().generateTotpSecret()
        totpLink = res.totp_secret_url
        totpEnabled = true
      }
    } catch (e) {
      toast({ content: e as any, type: 'error' })
    }
  }
</script>

<h1 class="font-bold text-3xl">{$t('routes.profile.credentials')}</h1>
<div class="flex flex-row flex-wrap gap-8">
  <div class="flex flex-col gap-2 max-w-sm w-full">
    <Header pageHeader>{$t('form.password')}</Header>
    <form
      on:submit|preventDefault={changePassword}
      class="max-w-sm flex flex-col gap-4"
    >
      <TextInput
        bind:value={oldPassword}
        label={$t('form.profile.currentPassword')}
        type="password"
        minlength={10}
        required
      />
      <TextInput
        bind:value={newPassword}
        label={$t('form.profile.newPassword')}
        type="password"
        minlength={10}
        required
      />
      <TextInput
        bind:value={newPasswordVerify}
        label={$t('form.profile.verifyNewPassword')}
        type="password"
        minlength={10}
        required
      />
      <Button size="lg" color="primary" submit {loading} disabled={loading}>
        {$t('form.submit')}
      </Button>
    </form>
  </div>
  <div class="flex flex-col gap-4 max-w-sm w-full">
    <Header>{$t('form.profile.2fa.2fa')}</Header>
    <p>
      <span class="font-bold">
        {totpEnabled ? $t('common.enabled') : $t('common.disabled')}
      </span>
    </p>
    {#if totpEnabled || totpLink}
      {#if totpLink && !totpEnabled}
        <Material color="transparent" class="!fill-white">
          <svg use:qr={{ data: totpLink, logo: '/img/logo-isolated.svg' }} />
        </Material>
        <TextInput
          disabled
          type="password"
          value={totpLink}
          label={$t('form.profile.2fa.totp')}
        >
          <button
            slot="suffix"
            class="contents"
            on:click={() => {
              if (!totpLink) return
              navigator.clipboard?.writeText(totpLink)
              toast({ content: $t('toast.copied') })
            }}
          >
            <Icon src={ClipboardDocument} size="20" mini />
          </button>
          <span class="font-normal text-xs">
            {$t('form.profile.2fa.paste')}
          </span>
        </TextInput>
      {/if}
      <form class="flex flex-col gap-2" on:submit|preventDefault={() => {}}>
        <TextInput
          bind:value={verify_totp}
          placeholder="012345"
          label={$t('form.2fa')}
        />
        {#if totpEnabled}
          <Button on:click={() => twofa(false, true)} size="lg" color="primary">
            {$t('common.disabled')}
          </Button>
        {:else}
          <Button on:click={() => twofa(true, true)} size="lg" color="primary">
            {$t('common.enabled')}
          </Button>
        {/if}
      </form>
    {:else}
      <Button on:click={() => twofa(true)} size="lg" color="primary">
        {$t('form.setup')}
      </Button>
    {/if}
  </div>
</div>
