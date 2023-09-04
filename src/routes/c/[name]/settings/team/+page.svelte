<script lang="ts">
  import TextInput from '$lib/components/input/TextInput.svelte'
  import UserLink from '$lib/components/lemmy/user/UserLink.svelte'
  import Avatar from '$lib/components/ui/Avatar.svelte'
  import EditableList from '$lib/components/ui/list/EditableList.svelte'
  import { Icon, Plus, Trash } from 'svelte-hero-icons'
  import type { PageData } from './$types.js'
  import { profile } from '$lib/auth.js'
  import { toast } from '$lib/components/ui/toasts/toasts.js'
  import { getClient } from '$lib/lemmy.js'
  import { flip } from 'svelte/animate'
  import { Button } from 'mono-svelte'

  export let data: PageData

  let formData = {
    newModerator: '',
    addingModerator: false,
  }

  async function addModerator() {
    if (!$profile?.jwt) return

    formData.addingModerator = true

    try {
      const res = await getClient().resolveObject({
        auth: $profile.jwt,
        q: formData.newModerator,
      })

      if (res.person) {
        const addModRes = await getClient().addModToCommunity({
          auth: $profile.jwt,
          added: true,
          person_id: res.person.person.id,
          community_id: data.community.community_view.community.id,
        })

        data.community.moderators = addModRes.moderators

        toast({
          content: 'Added that user as a moderator.',
          type: 'success',
        })

        formData.newModerator = ''
      } else {
        toast({
          content: 'Could not find that user.',
          type: 'warning',
        })
      }
    } catch (err) {
      toast({
        content: err as any,
        type: 'error',
      })
    }

    formData.addingModerator = false
  }

  async function removeMod(id: number) {
    if (!$profile?.jwt) return

    try {
      const res = await getClient().addModToCommunity({
        added: false,
        auth: $profile.jwt,
        community_id: data.community.community_view.community.id,
        person_id: id,
      })

      data.community.moderators = res.moderators

      toast({
        content: 'Successfully updated community moderators.',
        type: 'success',
      })
    } catch (err) {
      toast({
        content: err as any,
        type: 'error',
      })
    }
  }
</script>

<svelte:head>
  <title>Moderator Team</title>
</svelte:head>

<h1 class="text-2xl font-bold">Moderators</h1>
<EditableList
  let:action
  on:action={(e) => {
    toast({
      content: `Are you sure you want to remove ${e.detail.name} as a moderator?`,
      action: () => removeMod(e.detail.id),
    })
  }}
>
  {#each data.community.moderators as moderator (moderator.moderator.id)}
    <div
      class="py-4 flex items-center gap-2 justify-between"
      animate:flip={{ duration: 300 }}
    >
      <div class="flex gap-2 items-center">
        <Avatar
          width={28}
          url={moderator.moderator.avatar}
          alt={moderator.moderator.name}
        />
        <div class="flex flex-col gap-0">
          <UserLink user={moderator.moderator} showInstance={false} />
          <span class="text-xs text-slate-600 dark:text-zinc-400">
            {new URL(moderator.moderator.actor_id).hostname}
          </span>
        </div>
      </div>
      <Button
        size="square-md"
        on:click={() => action(moderator.moderator)}
        icon={Trash}
      />
    </div>
  {/each}
</EditableList>
<div class="mt-auto flex gap-2 w-full">
  <TextInput
    bind:value={formData.newModerator}
    class="w-full"
    placeholder="@user@example.com"
  />
  <Button
    loading={formData.addingModerator}
    disabled={formData.addingModerator}
    size="lg"
    class="w-max flex-shrink-0"
    on:click={addModerator}
  >
    <Icon slot="prefix" src={Plus} mini size="16" />Add moderator
  </Button>
</div>
