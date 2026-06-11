<script lang="ts">
  import { client } from '$lib/api/client.svelte'
  import { profile } from '$lib/app/auth'
  import { errorMessage } from '$lib/app/error'
  import { t } from '$lib/app/i18n'
  import { proxify } from '$lib/app/util/reactivity.svelte.js'
  import UserAutocomplete from '$lib/feature/user/UserAutocomplete.svelte'
  import UserLink from '$lib/feature/user/UserLink.svelte'
  import Placeholder from '$lib/ui/info/Placeholder.svelte'
  import { CommonList, Header } from '$lib/ui/layout'
  import { Button, toast } from 'mono-svelte'
  import { Icon, Plus, QuestionMarkCircle, Trash } from 'svelte-hero-icons/dist'

  let { data } = $props()

  let admins = $derived(proxify(data.site.admins))

  let newAdmin = $state<number>(),
    adding: boolean = $state(false)

  async function removeAdmin(id: number, confirm: boolean): Promise<void | number> {
    if (!confirm)
      return toast({
        content: $t('toast.removeAdminWarning'),
        action: () => removeAdmin(id, true),
      })

    if (!profile.current?.jwt) return

    try {
      const res = await client().addAdmin({
        added: false,
        person_id: id,
      })

      admins = res.admins
      toast({
        content: $t('toast.removeAdmin'),
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

<Header pageHeader>{$t('routes.admin.team.title')}</Header>
{#if data.site}
  <ul>
    {#if admins.length <= 0}
      <Placeholder
        icon={QuestionMarkCircle}
        title={$t('routes.admin.team.empty.title')}
        description={$t('routes.admin.team.empty.description')}
      />
    {:else}
      <CommonList items={admins}>
        {#snippet item(admin)}
          <div class="flex items-center justify-between">
            <UserLink avatar showInstance={false} user={admin.person} />
            <Button
              onclick={() => {
                removeAdmin(admin.person.id, false)
              }}
              size="square-md"
            >
              <Icon src={Trash} mini size="16" />
            </Button>
          </div>
        {/snippet}
      </CommonList>
    {/if}
  </ul>
  <form
    class="flex flex-row gap-2 mt-auto w-full"
    onsubmit={async (e) => {
      e.preventDefault()
      if (!profile.current?.jwt || !newAdmin) return
      adding = true

      const res = await client().addAdmin({
        added: true,
        person_id: newAdmin,
      })

      toast({
        content: 'Successfully added that admin.',
        type: 'success',
      })

      admins = res.admins

      newAdmin = undefined
      adding = false
    }}
  >
    <div class="w-full">
      <UserAutocomplete listing_type="all" onselect={(p) => (newAdmin = p?.id)} />
    </div>
    <Button
      loading={adding}
      disabled={adding}
      rounding="xl"
      color="primary"
      size="sm"
      submit
      icon={Plus}
    >
      {$t('common.add')}
    </Button>
  </form>
{/if}
