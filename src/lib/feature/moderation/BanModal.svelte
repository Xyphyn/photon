<script lang="ts">
  import { client } from '$lib/api/client.svelte'
  import type { Community, Person } from '$lib/api/types'
  import { profile } from '$lib/app/auth'
  import { errorMessage } from '$lib/app/error'
  import { t } from '$lib/app/i18n'
  import MarkdownEditor from '$lib/app/markdown/MarkdownEditor.svelte'
  import Duration from '$lib/ui/form/Duration.svelte'
  import Avatar from '$lib/ui/generic/Avatar.svelte'
  import { Button, Label, Modal, Switch, toast } from 'mono-svelte'
  import CommunityLink from '../community/CommunityLink.svelte'

  interface Props {
    open?: boolean
    user: Person | undefined
    community: Community | undefined
    banned: boolean
  }

  let {
    open = $bindable(false),
    user: item = $bindable(),
    community,
    banned,
  }: Props = $props()

  let reason = $state('')
  let deleteData = $state(false)
  let expires = $state(-1)
  let loading = $state(false)

  // hack due to svelte's reactive declarations
  const resetReason = () => {
    reason = ''
    deleteData = false
    expires = -1
  }

  $effect(() => {
    if (item) resetReason()
  })

  async function submit() {
    if (!item || !profile.current?.user || !profile.current?.jwt) return

    loading = true

    try {
      let date: number | undefined

      if (expires > 0) {
        date = Math.floor(Date.now() / 1000) + expires
      }

      if (community) {
        await client().banFromCommunity({
          ban: !banned,
          community_id: community.id,
          person_id: item.id,
          reason: reason || undefined,
          remove_data: deleteData,
          expires: date,
        })
      } else {
        await client().banPerson({
          ban: !banned,
          person_id: item.id,
          reason: reason || undefined,
          remove_data: deleteData,
          expires: date,
        })
      }

      open = false

      toast({
        content: banned ? $t('toast.unbannedUser') : $t('toast.bannedUser'),
        type: 'success',
      })

      item.banned = !banned
    } catch (err) {
      toast({
        content: errorMessage(err),
        type: 'error',
      })
    }

    loading = false
  }
</script>

<Modal
  bind:open
  title={banned ? $t('moderation.ban.unbanning') : $t('moderation.ban.banning')}
>
  {#if item}
    <form
      class="flex flex-col gap-4"
      onsubmit={(e) => {
        e.preventDefault()
        submit()
      }}
    >
      <div class="flex items-center gap-1">
        <Avatar url={item.avatar} alt={item.name} width={24} />
        <span class="font-bold">{item.name}</span>
      </div>
      {#if community}
        <CommunityLink {community} avatar />
      {/if}
      <MarkdownEditor
        required
        bind:value={reason}
        label={$t('moderation.reason')}
      />
      {#if !banned}
        <Switch bind:checked={deleteData}>
          {$t('moderation.ban.deleteData')}
          {#snippet description()}
            {$t('moderation.ban.warning')}
          {/snippet}
        </Switch>
        <Label text={$t('moderation.ban.expires')}>
          <Duration bind:value={expires}></Duration>
        </Label>
      {/if}
      <Button submit color="primary" {loading} disabled={loading} size="lg">
        {$t('form.submit')}
      </Button>
    </form>
  {/if}
</Modal>
