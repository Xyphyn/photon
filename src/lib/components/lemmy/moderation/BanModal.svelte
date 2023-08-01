<script lang="ts">
  import Button from '$lib/components/input/Button.svelte'
  import TextArea from '$lib/components/input/TextArea.svelte'
  import UserItem from '$lib/components/lemmy/user/UserItem.svelte'
  import Avatar from '$lib/components/ui/Avatar.svelte'
  import Modal from '$lib/components/ui/modal/Modal.svelte'
  import type { Community, Person, PersonView } from 'lemmy-js-client'
  import { authData, getClient, user } from '$lib/lemmy.js'
  import { ToastType, toast } from '$lib/components/ui/toasts/toasts.js'
  import TextInput from '$lib/components/input/TextInput.svelte'

  export let open = false
  let item: Person | undefined
  export { item as user }
  export let community: Community | undefined
  export let banned: boolean

  let reason = ''
  let deleteData = false
  let expires = ''

  let loading = false

  // hack due to svelte's reactive declarations
  const resetReason = () => (reason = '')

  $: if (item) resetReason()

  async function submit() {
    if (!item || !$user || !community || !$authData) return

    loading = true

    try {
      let date: Date = new Date()

      if (expires != '') {
        date = new Date(expires)
        if (date.toLocaleString('en') == 'Invalid Date') {
          toast({
            content: 'Invalid date. It must be an absolute date.',
            type: ToastType.error,
          })

          loading = false

          return
        }

        if (date.getTime() < Date.now()) {
          toast({
            content: 'Invalid date. It is before the current time.',
            type: ToastType.error,
          })

          loading = false
          return
        }
      }

      await getClient().banFromCommunity({
        auth: $authData.token,
        ban: !banned,
        community_id: community.id,
        person_id: item.id,
        reason: reason || undefined,
        remove_data: deleteData,
        expires: date.getTime(),
      })

      open = false

      toast({
        content: `Successfully ${
          banned ? 'unbanned' : 'banned'
        } that user. You may need to refresh to see changes.`,
        type: ToastType.success,
      })

      item.banned = !banned
    } catch (err) {
      toast({
        content: err as any,
        type: ToastType.error,
      })
    }

    loading = false
  }
</script>

<Modal bind:open>
  <h1 slot="title">{banned ? 'Unbanning' : 'Banning'} user</h1>
  {#if item}
    <form class="flex flex-col gap-4" on:submit|preventDefault={submit}>
      <div class="flex items-center gap-1">
        <Avatar url={item.avatar} alt={item.name} width={24} />
        <span class="font-bold">{item.name}</span>
      </div>
      <TextArea
        required
        bind:value={reason}
        label="Reason"
        placeholder="Why are you banning {item.name}?"
      />
      <div>
        <label for="delete-data" class="block my-1 font-bold text-sm">
          <input id="delete-data" type="checkbox" bind:value={deleteData} />
          Delete data
        </label>
      </div>
      <TextInput
        bind:value={expires}
        label="Expires"
        placeholder="2024 August 5"
      />
      <Button submit color="primary" {loading} disabled={loading} size="lg">
        Submit
      </Button>
    </form>
  {/if}
</Modal>
