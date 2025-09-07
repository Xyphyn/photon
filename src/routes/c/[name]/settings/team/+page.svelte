<script lang="ts">
  import { profile } from '$lib/auth.svelte.js'
  import UserAutocomplete from '$lib/components/lemmy/user/UserAutocomplete.svelte'
  import Avatar from '$lib/components/ui/Avatar.svelte'
  import CommonList from '$lib/components/ui/layout/CommonList.svelte'
  import { Header } from '$lib/components/ui/layout'
  import { t } from '$lib/i18n/translations.js'
  import { getClient } from '$lib/client/lemmy.svelte'
  import { errorMessage } from '$lib/lemmy/error.js'
  import { action, Button, modal, toast } from 'mono-svelte'
  import { Icon, Plus, Trash } from 'svelte-hero-icons'
  import type { PageData } from './$types.js'

  interface Props {
    data: PageData
  }

  let { data }: Props = $props()

  let formData = $state({
    newModerator: -1,
    addingModerator: false,
  })

  async function addModerator() {
    if (!profile.current?.jwt) return

    formData.addingModerator = true

    try {
      if (formData.newModerator != -1) {
        const addModRes = await getClient().addModToCommunity({
          added: true,
          person_id: formData.newModerator,
          community_id: data.community.value.community_view.community.id,
        })

        data.community.value.moderators = addModRes.moderators

        toast({
          content: $t('toast.addMod'),
          type: 'success',
        })

        formData.newModerator = -1
      } else {
        toast({
          content: $t('toast.failFindUser'),
          type: 'warning',
        })
      }
    } catch (err) {
      toast({
        content: errorMessage(err as string),
        type: 'error',
      })
    }

    formData.addingModerator = false
  }

  async function removeMod(id: number) {
    if (!profile.current?.jwt) return

    try {
      const res = await getClient().addModToCommunity({
        added: false,
        community_id: data.community.value.community_view.community.id,
        person_id: id,
      })

      data.community.value.moderators = res.moderators

      toast({
        content: $t('toast.updateMods'),
        type: 'success',
      })
    } catch (err) {
      toast({
        content: errorMessage(err as string),
        type: 'error',
      })
    }
  }
</script>

<Header pageHeader>Moderators</Header>
<CommonList items={data.community.value.moderators}>
  {#snippet item(moderator)}
    <div class="flex items-center gap-2 justify-between">
      <div class="flex gap-2 items-center">
        <Avatar
          width={28}
          url={moderator.moderator.avatar}
          alt={moderator.moderator.name}
        />
        <div class="flex flex-col gap-0">
          {moderator.moderator.display_name ?? moderator.moderator.name}
          <span class="text-xs text-slate-600 dark:text-zinc-400">
            {new URL(moderator.moderator.actor_id).hostname}
          </span>
        </div>
      </div>
      <Button
        size="square-md"
        onclick={() => {
          modal({
            title: $t('common.remove'),
            body: `Are you sure you want to remove ${moderator.moderator.name} as a moderator?`,
            actions: [
              action({
                content: $t('common.remove'),
                action: () => removeMod(moderator.moderator.id),
                type: 'danger',
                close: true,
              }),
              action({
                content: $t('common.cancel'),
                close: true,
              }),
            ],
          })
        }}
      >
        <Icon src={Trash} mini size="16" />
      </Button>
    </div>
  {/snippet}
</CommonList>
<form
  onsubmit={(e) => {
    e.preventDefault()
    addModerator()
  }}
  class="mt-auto flex gap-2 w-full mb-3 sm:mb-6"
>
  <div class="w-full">
    <UserAutocomplete
      listing_type="All"
      onselect={(p) => (formData.newModerator = p.id)}
    />
  </div>
  <Button
    loading={formData.addingModerator}
    disabled={formData.addingModerator}
    rounding="xl"
    color="primary"
    submit
  >
    {#snippet prefix()}
      <Icon src={Plus} micro size="16" />
    {/snippet}
    {$t('common.add')}
  </Button>
</form>
