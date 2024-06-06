<script lang="ts">
  import UserLink from '$lib/components/lemmy/user/UserLink.svelte'
  import MarkdownEditor from '$lib/components/markdown/MarkdownEditor.svelte'
  import { t } from '$lib/translations'
  import type { Person } from 'lemmy-js-client'
  import { Button, Modal } from 'mono-svelte'

  export let open: boolean = false
  export let user: Person

  export let denying: boolean

  export let denyReason: string = ''

  let loading = false

  function deny() {
    denying = true
    open = false
  }
</script>

<Modal bind:open>
  <h1 class="text-2xl font-bold" slot="title">
    {$t('routes.admin.applications.modalTitle')}
  </h1>
  <form on:submit|preventDefault={() => deny()} class="flex flex-col gap-4">
    <UserLink avatar {user} />
    <MarkdownEditor
      bind:value={denyReason}
      label={$t('routes.admin.applications.reason')}
      rows={4}
    />
    <Button color="primary" size="lg" submit {loading} disabled={loading}>
      {$t('routes.admin.applications.deny')}
    </Button>
  </form>
</Modal>
