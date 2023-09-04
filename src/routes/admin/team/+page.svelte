<script lang="ts">
  import { profile } from '$lib/auth.js'
  import TextInput from '$lib/components/input/TextInput.svelte'
  import UserLink from '$lib/components/lemmy/user/UserLink.svelte'
  import Placeholder from '$lib/components/ui/Placeholder.svelte'
  import EditableList from '$lib/components/ui/list/EditableList.svelte'
  import { toast } from '$lib/components/ui/toasts/toasts.js'
  import { instance } from '$lib/instance.js'
  import { getClient } from '$lib/lemmy.js'
  import { addAdmin } from '$lib/lemmy/user.js'
  import { removeItem, trycatch } from '$lib/util.js'
  import { Button } from 'mono-svelte'
  import { Plus, QuestionMarkCircle, Trash } from 'svelte-hero-icons'

  export let data

  let newAdmin: string = '',
    adding: boolean = false

  async function removeAdmin(id: number, confirm: boolean): Promise<any> {
    if (!confirm)
      return toast({
        content: 'Are you sure you want to remove that admin?',
        action: () => removeAdmin(id, true),
      })

    if (!$profile?.jwt) return

    const result = await trycatch(() =>
      getClient().addAdmin({
        added: false,
        auth: $profile!.jwt!,
        person_id: id,
      })
    )

    if (result) {
      data.site!.admins = result.admins
      toast({
        content: 'Removed that admin.',
        type: 'success',
      })
    }
  }
</script>

<svelte:head>
  <title>Admin Team</title>
</svelte:head>

<h1 class="font-bold text-2xl">Admins</h1>
{#if data.site}
  <EditableList let:action on:action={(e) => removeAdmin(e.detail, false)}>
    {#if data.site.admins.length <= 0}
      <Placeholder
        icon={QuestionMarkCircle}
        title="No admins"
        description="Somehow there's no admins of this site. How?!"
      />
    {:else}
      {#each data.site?.admins ?? [] as admin}
        <div class="py-3 flex items-center justify-between">
          <UserLink avatar showInstance={false} user={admin.person} />
          <Button
            on:click={() => action(admin.person.id)}
            icon={Trash}
            size="square-md"
          />
        </div>
      {/each}
    {/if}
  </EditableList>
  <form
    class="flex flex-row items-center gap-2 mt-auto w-full"
    on:submit|preventDefault={() => {
      trycatch(async () => {
        if (!$profile?.jwt || newAdmin == '') return
        adding = true

        const r = await addAdmin(`${newAdmin}@${$instance}`, true, $profile.jwt)
        if (!r) return

        toast({
          content: 'Successfully added that admin.',
          type: 'success',
        })

        if (data.site) data.site.admins = r.admins

        newAdmin = ''
        adding = false
      })
    }}
  >
    <TextInput
      bind:value={newAdmin}
      placeholder="@user"
      class="flex-1"
      pattern={'@[^ |]{1,}'}
    />
    <Button
      loading={adding}
      disabled={adding}
      icon={Plus}
      size="md"
      class="h-full"
      submit
    >
      Add Admin
    </Button>
  </form>
{/if}
