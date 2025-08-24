<script lang="ts">
  import { goto } from '$app/navigation'
  import { page } from '$app/state'
  import { client } from '$lib/lemmy.svelte.js'
  import { t } from '$lib/i18n/translations.js'
  import { qr } from '@svelte-put/qr/svg'
  import { Button, Material, Modal, TextInput, toast } from 'mono-svelte'
  import { ClipboardDocument, Icon, Key } from 'svelte-hero-icons'
  import { errorMessage } from '$lib/lemmy/error.js'
  import Placeholder from '$lib/components/ui/Placeholder.svelte'

  let { data } = $props()

  let totpLink = $state<string>()
  let totpEnabled = $state(
    data.my_user?.local_user_view.local_user.totp_2fa_enabled,
  )

  let verify_totp = $state('')

  let openModal = $state(false)
  $effect(() => {
    if (!openModal) totpLink = undefined
  })

  async function twofa(enabled: boolean, update: boolean = false) {
    try {
      if (!enabled && !update) {
        openModal = true
        return
      }

      if (update) {
        await client().updateTotp({
          enabled: enabled,
          totp_token: verify_totp,
        })

        toast({
          content: `2FA has been ${enabled ? 'enabled' : 'disabled'}`,
          type: 'success',
        })

        goto(page.url, { invalidateAll: true })
      } else {
        const res = await client().generateTotpSecret()
        totpLink = res.totp_secret_url
        openModal = true
      }
    } catch (err) {
      toast({ content: errorMessage(err as string), type: 'error' })
    }
  }
</script>

<div class="w-full flex flex-col h-full">
  <Modal
    dismissable={false}
    bind:open={openModal}
    title={$t('form.profile.2fa.2fa')}
  >
    {#if totpLink && !totpEnabled}
      <Material rounding="2xl" color="uniform" class="">
        <svg use:qr={{ data: totpLink, logo: '/img/logo-background.svg' }} />
      </Material>
      <TextInput
        disabled
        type="password"
        value={totpLink}
        label={$t('form.profile.2fa.totp')}
      >
        {#snippet suffix()}
          <button
            class="contents"
            onclick={() => {
              if (!totpLink) return
              navigator.clipboard?.writeText(totpLink)
              toast({ content: $t('toast.copied') })
            }}
          >
            <Icon src={ClipboardDocument} size="20" mini />
          </button>
        {/snippet}
        <span class="font-normal text-xs">
          {$t('form.profile.2fa.paste')}
        </span>
      </TextInput>
    {/if}
    <form
      class="flex flex-col gap-2 w-full"
      onsubmit={e => {
        e.preventDefault()
        twofa(!(totpEnabled == true), true)
      }}
    >
      <TextInput
        bind:value={verify_totp}
        placeholder="012345"
        label={$t('form.2fa')}
        pattern={'\\d{6}'}
        required
      />
      {#if totpEnabled}
        <Button submit size="lg" color="primary">
          {$t('common.disable')}
        </Button>
      {:else}
        <Button submit size="lg" color="primary">
          {$t('common.enable')}
        </Button>
      {/if}
    </form>
  </Modal>
  <div class="flex flex-col items-center justify-center h-full gap-4 p-4">
    {#if totpEnabled}
      <Placeholder
        iconClass="p-3 bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400 rounded-full"
        icon={Key}
        title={$t('form.profile.2fa.enabled')}
      >
        <Button
          onclick={() => twofa(false, false)}
          rounding="pill"
          color="primary"
        >
          {$t('common.disable')}
        </Button>
      </Placeholder>
    {:else}
      <Placeholder
        iconClass="p-3 bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400 rounded-full"
        icon={Key}
        title={$t('form.profile.2fa.disabled')}
      >
        <Button
          onclick={() => twofa(true, false)}
          rounding="pill"
          color="primary"
        >
          {$t('form.setup')}
        </Button>
      </Placeholder>
    {/if}
  </div>
</div>
