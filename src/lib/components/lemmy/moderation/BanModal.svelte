<script lang="ts">
  import TextArea from '$lib/components/input/TextArea.svelte'
  import Avatar from '$lib/components/ui/Avatar.svelte'
  import type { Community, Person, PersonView } from 'lemmy-js-client'
  import { getClient } from '$lib/lemmy.js'
  import { toast } from '$lib/components/ui/toasts/toasts.js'
  import TextInput from '$lib/components/input/TextInput.svelte'
  import { profile } from '$lib/auth.js'
  import { Button, Checkbox, Modal } from 'mono-svelte'

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
  const resetReason = () => {
    reason = ''
    deleteData = false
    expires = ''
  }

  $: if (item) resetReason()

  async function submit() {
    if (!item || !$profile?.user || !$profile?.jwt) return

    loading = true

    try {
      let date: number | undefined

      if (expires != '') {
        date = Date.parse(expires)
        if (Number.isNaN(date)) {
          toast({
            content: 'Invalid date. It must be an absolute date.',
            type: 'error',
          })

          loading = false

          return
        }

        if (date < Date.now()) {
          toast({
            content: 'Invalid date. It is before the current time.',
            type: 'error',
          })

          loading = false
          return
        }
      }

      if (community) {
        await getClient().banFromCommunity({
          auth: $profile.jwt,
          ban: !banned,
          community_id: community.id,
          person_id: item.id,
          reason: reason || undefined,
          remove_data: deleteData,
          expires: date ? Math.floor(date / 1000) : undefined,
        })
      } else {
        await getClient().banPerson({
          auth: $profile.jwt,
          ban: !banned,
          person_id: item.id,
          reason: reason || undefined,
          remove_data: deleteData,
          expires: date ? Math.floor(date / 1000) : undefined,
        })
      }

      open = false

      toast({
        content: `Successfully ${
          banned ? 'unbanned' : 'banned'
        } that user. You may need to refresh to see changes.`,
        type: 'success',
      })

      item.banned = !banned
    } catch (err) {
      toast({
        content: err as any,
        type: 'error',
      })
    }

    loading = false
  }
</script>

<Modal bind:open class="max-w-xl w-full">
  <h1 slot="title">{banned ? 'Unbanning' : 'Banning'} user</h1>
  {#if item}
    <form class="flex flex-col gap-4" on:submit|preventDefault={submit}>
      <div class="flex items-center gap-1">
        <Avatar url={item.avatar} alt={item.name} width={24} />
        <span class="font-bold">{item.name}</span>
      </div>
      <p>
        {banned ? 'Unbanning' : 'Banning'} from
        <span class="font-bold">{community ? community.name : 'site'}</span>
      </p>
      <TextArea
        required
        bind:value={reason}
        label="Reason"
        placeholder="Why are you {banned
          ? 'unbanning'
          : 'banning'} {item.name}?"
      />
      {#if !banned}
        <Checkbox bind:checked={deleteData}>
          Delete data
          <svelte:fragment slot="description">
            This will delete ALL of this user's posts and comments on this {community
              ? 'community'
              : 'site'}.
          </svelte:fragment>
        </Checkbox>
        <TextInput
          bind:value={expires}
          label="Expires (UTC)"
          placeholder="2024 August 5"
        />
      {/if}
      <Button submit color="primary" {loading} disabled={loading} size="lg">
        Submit
      </Button>
    </form>
  {/if}
</Modal>
