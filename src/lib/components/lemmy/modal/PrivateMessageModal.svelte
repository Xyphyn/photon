<script lang="ts">
  import { profile } from '$lib/auth.js'
  import UserLink from '$lib/components/lemmy/user/UserLink.svelte'
  import MarkdownEditor from '$lib/components/markdown/MarkdownEditor.svelte'
  import { getClient } from '$lib/lemmy.js'
  import type { Person } from 'lemmy-js-client'
  import { Button, Modal, toast } from 'mono-svelte'

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
        content: 'Successfully sent that person a message.',
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
      Sending <UserLink avatar {user} /> a message
    </p>
    <MarkdownEditor
      bind:value={message}
      label="Message"
      placeholder="your hair looks nice today"
      rows={4}
    />
    <Button color="primary" size="lg" submit {loading} disabled={loading}>
      Send
    </Button>
  </form>
</Modal>
