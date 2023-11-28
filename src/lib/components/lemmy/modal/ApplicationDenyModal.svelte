<script lang="ts">
    import { profile } from '$lib/auth.js'
    import UserLink from '$lib/components/lemmy/user/UserLink.svelte'
    import MarkdownEditor from '$lib/components/markdown/MarkdownEditor.svelte'
    import { getClient } from '$lib/lemmy.js'
    import type { Person } from 'lemmy-js-client'
    import { Button, Modal, toast } from 'mono-svelte'

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
    <h1 class="text-2xl font-bold" slot="title">Deny Application</h1>
    <form on:submit|preventDefault={() => deny()} class="flex flex-col gap-4">
        <p class="inline-flex flex-row gap-2 items-center">
          Denying <UserLink avatar {user} />'s Application
        </p>
        <MarkdownEditor
          bind:value={denyReason}
          label="Deny Reason (optional)"
          placeholder="Application Reason breaks rule #3"
          rows={4}
        />
        <Button color="primary" size="lg" submit {loading} disabled={loading}>
          Deny
        </Button>
    </form>
</Modal>
