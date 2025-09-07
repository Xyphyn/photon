<script lang="ts">
  import { profile } from '$lib/auth.svelte.js'
  import { client } from '$lib/client/lemmy.svelte'
  import UserAutocomplete from '$lib/components/lemmy/user/UserAutocomplete.svelte'
  import UserLink from '$lib/components/lemmy/user/UserLink.svelte'
  import { Header } from '$lib/components/ui/layout'
  import Placeholder from '$lib/components/ui/Placeholder.svelte'
  import { t } from '$lib/i18n/translations.js'
  import { errorMessage } from '$lib/lemmy/error.js'
  import { Button, toast } from 'mono-svelte'
  import { Icon, Plus, QuestionMarkCircle, Trash } from 'svelte-hero-icons'

  let { data: pageData } = $props()
  let data = $state(pageData)

  let newAdmin = $state<number>(),
    adding: boolean = $state(false)

  async function removeAdmin(
    id: number,
    confirm: boolean,
  ): Promise<void | number> {
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

      data.site.admins = res.admins
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
    {#if data.site.admins.length <= 0}
      <Placeholder
        icon={QuestionMarkCircle}
        title={$t('routes.admin.team.empty.title')}
        description={$t('routes.admin.team.empty.description')}
      />
    {:else}
      {#each data.site?.admins ?? [] as admin (admin.person.id)}
        <div class="py-3 flex items-center justify-between">
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
      {/each}
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

      if (data.site) data.site.admins = res.admins

      newAdmin = undefined
      adding = false
    }}
  >
    <div class="w-full">
      <UserAutocomplete
        listing_type="All"
        onselect={(p) => (newAdmin = p.id)}
      />
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
