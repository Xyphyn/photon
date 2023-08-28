<script lang="ts">
  import { goto } from '$app/navigation'
  import { profile } from '$lib/auth.js'
  import Button from '$lib/components/input/Button.svelte'
  import UserLink from '$lib/components/lemmy/user/UserLink.svelte'
  import EditableList from '$lib/components/ui/list/EditableList.svelte'
  import { toast } from '$lib/components/ui/toasts/toasts.js'
  import { getClient } from '$lib/lemmy.js'
  import { trycatch } from '$lib/util.js'
  import { Trash } from 'svelte-hero-icons'

  export let data

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
      toast({
        content: 'Removed that admin.',
        type: 'success',
      })
    }
  }
</script>

<h1 class="font-bold text-2xl">Admins</h1>
<EditableList let:action on:action={(e) => removeAdmin(e.detail, false)}>
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
</EditableList>
