<script lang="ts">
  import { deleteProfile, profile, setUser } from '$lib/auth.js'
  import { getClient, site } from '$lib/lemmy.js'
  import { trycatch } from '$lib/util.js'
  import { Button, Snippet, TextInput, toast } from 'mono-svelte'
  import { instance as currentInstance } from '$lib/instance.js'
  import { ClipboardDocument, Icon } from 'svelte-hero-icons'
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import Switch from '$lib/components/input/Switch.svelte'
  import { feature } from '$lib/version.js'

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

        toast({ content: 'Your login was refreshed.', type: 'success' })
      } else {
        throw new Error('Invalid credentials')
      }

      toast({ content: 'Successfully changed your password. ' })
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

<h1 class="font-bold text-3xl">Credentials</h1>
<div class="flex flex-row flex-wrap gap-8">
  <div class="flex flex-col gap-2 max-w-sm w-full">
    <h1 class="font-bold text-2xl">Password</h1>
    <form
      on:submit|preventDefault={changePassword}
      class="max-w-sm flex flex-col gap-4"
    >
      <TextInput
        bind:value={oldPassword}
        label="Current Password"
        type="password"
        minlength={10}
        required
      />
      <TextInput
        bind:value={newPassword}
        label="New Password"
        type="password"
        minlength={10}
        required
      />
      <TextInput
        bind:value={newPasswordVerify}
        label="New Password (Verify)"
        type="password"
        minlength={10}
        required
      />
      <Button size="lg" color="primary" submit {loading} disabled={loading}>
        Submit
      </Button>
    </form>
  </div>
  <div class="flex flex-col gap-4 max-w-sm w-full">
    <h1 class="font-bold text-2xl">2FA</h1>
    <p>
      2FA is <span class="font-bold">
        {totpEnabled ? 'enabled' : 'disabled'}
      </span>
    </p>
    {#if totpEnabled || totpLink}
      {#if totpLink && !totpEnabled}
        <TextInput disabled type="password" value={totpLink} label="TOTP Link">
          <button
            slot="suffix"
            class="contents"
            on:click={() => {
              if (!totpLink) return
              navigator.clipboard?.writeText(totpLink)
              toast({ content: 'Copied to clipboard.' })
            }}
          >
            <Icon src={ClipboardDocument} size="20" mini />
          </button>
          <span class="font-normal text-xs">
            Paste this in your authenticator app.
          </span>
        </TextInput>
      {/if}
      <form class="flex flex-col gap-2" on:submit|preventDefault={() => {}}>
        <TextInput
          bind:value={verify_totp}
          placeholder="012345"
          label="2FA Code"
        />
        {#if totpEnabled}
          <Button on:click={() => twofa(false, true)} size="lg" color="primary">
            Disable
          </Button>
        {:else}
          <Button on:click={() => twofa(true, true)} size="lg" color="primary">
            Enable
          </Button>
        {/if}
      </form>
    {:else}
      <Button on:click={() => twofa(true)} size="lg" color="primary">
        Setup
      </Button>
    {/if}
  </div>
</div>
