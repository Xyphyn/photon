<script lang="ts">
  import type { Person } from '$lib/api/types'
  import { t } from '$lib/app/i18n'
  import MarkdownEditor from '$lib/app/markdown/MarkdownEditor.svelte'
  import { Button, Modal } from 'mono-svelte'
  import { preventDefault } from 'svelte/legacy'
  import UserLink from '../user/UserLink.svelte'

  interface Props {
    open?: boolean
    user: Person
    denying: boolean
    denyReason?: string
  }

  let {
    open = $bindable(false),
    user,
    denying = $bindable(),
    denyReason = $bindable(''),
  }: Props = $props()

  let loading = false

  function deny() {
    denying = true
    open = false
  }
</script>

<Modal bind:open>
  {#snippet customTitle()}
    <h1 class="text-2xl font-bold">
      {$t('routes.admin.applications.modalTitle')}
    </h1>
  {/snippet}
  <form onsubmit={preventDefault(() => deny())} class="flex flex-col gap-4">
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
