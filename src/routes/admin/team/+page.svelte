<script lang="ts">
  import { goto } from '$app/navigation'
  import { profile } from '$lib/auth.js'
  import Button from '$lib/components/input/Button.svelte'
  import UserLink from '$lib/components/lemmy/user/UserLink.svelte'
  import EditableList from '$lib/components/ui/list/EditableList.svelte'
  import { toast } from '$lib/components/ui/toasts/toasts.js'
  import { getClient } from '$lib/lemmy.js'

  export let data

  let leaving = false

  async function leaveTeam() {
    if (!$profile?.jwt || !$profile?.user) return

    leaving = true
    $profile.user.local_user_view.person.admin = false

    try {
      await getClient().leaveAdmin({
        auth: $profile.jwt,
      })

      toast({
        content: 'You have left the admin team.',
        type: 'success',
      })

      goto('/')
    } catch (err) {
      toast({
        content: err as any,
        type: 'error',
      })
    } finally {
      leaving = false
    }
  }
</script>

<h1 class="font-bold text-2xl">Admins</h1>
<p class="text-slate-600 dark:text-zinc-400">
  Remove admins on their user page.
</p>
<EditableList>
  {#each data.site?.admins ?? [] as admin}
    <div class="py-4 flex items-center">
      <UserLink avatar showInstance={false} user={admin.person} />
    </div>
  {/each}
</EditableList>
<Button
  color="danger"
  class="mt-auto ml-auto"
  size="lg"
  loading={leaving}
  disabled={leaving}
  on:click={() => {
    toast({
      content: 'Are you sure you want to leave the admin team?',
      action: leaveTeam,
      duration: 60 * 1000,
    })
  }}
>
  Leave the admin team
</Button>
