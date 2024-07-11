<script lang="ts">
  import { profile } from '$lib/auth.js'
  import UserLink from '$lib/components/lemmy/user/UserLink.svelte'
  import MarkdownEditor from '$lib/components/markdown/MarkdownEditor.svelte'
  import { getClient } from '$lib/lemmy.js'
  import { t } from '$lib/translations'
  import type { Person } from 'lemmy-js-client'
  import { Button, Modal, toast } from 'mono-svelte'
  import { Icon, PaperAirplane } from 'svelte-hero-icons'

  export let open: boolean = false
  export let user: Person

  let message = ''

  let loading = false

  async function sendMessage() {
    if (!$profile?.jwt || message == '') return

    loading = true

    try {
      await getClient().createPrivateMessage({
        content: message,
        recipient_id: user.id,
      })

      toast({
        content: $t('toast.sentMessage'),
        type: 'success',
      })

      open = false
    } catch (err) {
      toast({
        content: err as any,
        type: 'error',
      })
    }

    loading = false
  }
</script>

<Modal bind:open>
  <h1 class="text-2xl font-bold" slot="title">Message</h1>
  <form on:submit|preventDefault={sendMessage} class="flex flex-col gap-4">
    <p class="inline-flex flex-row gap-2 items-center">
      <Icon src={PaperAirplane} size="16" mini />
      <UserLink avatar {user} />
    </p>
    <MarkdownEditor
      bind:value={message}
      label={$t('content.message')}
      rows={4}
    />
    <Button color="primary" size="lg" submit {loading} disabled={loading}>
      {$t('common.send')}
    </Button>
  </form>
</Modal>
