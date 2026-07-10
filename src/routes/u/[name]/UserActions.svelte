<script lang="ts">
  import { client } from '$lib/api/client.svelte'
  import { profile } from '$lib/app/auth'
  import { t } from '$lib/app/i18n'
  import { loader } from '$lib/app/util.svelte'
  import { ban } from '$lib/feature/moderation/moderation'
  import type { UserModel } from '$lib/feature/user/user.svelte'
  import UserNote from '$lib/feature/user/UserNote.svelte'
  import { Button, Menu, MenuButton, Modal, removeToast, toast } from 'mono-svelte'
  import {
    AtSymbol,
    EllipsisHorizontal,
    Envelope,
    Fire,
    Icon,
    Newspaper,
    NoSymbol,
    ShieldCheck,
    ShieldExclamation,
    Tag,
  } from 'svelte-hero-icons/dist'

  let { person }: { person: UserModel } = $props()

  let purgingUser = $state(false)
  let setNote = $state(false)

  const block = () =>
    loader(
      () => {},
      () => person.block(),
      () =>
        toast({
          content: person.blocked ? $t('toast.blockedUser') : $t('toast.unblockedUser'),
          type: 'success',
        }),
    )

  async function purgeUser() {
    purgingUser = false
    const purgeToast = toast({ content: '', loading: true })

    try {
      await client().purgePerson({
        person_id: person.person.id,
        reason: 'Not given',
      })
      removeToast(purgeToast)
      toast({ content: $t('toast.purgeUser'), type: 'success' })
    } catch (e) {
      toast({ content: e as string, type: 'error' })
    }
  }
</script>

{#if purgingUser}
  <Modal bind:open={purgingUser}>
    {#snippet customTitle()}
      Purging User
    {/snippet}
    <p>
      Purging user <span class="font-bold">
        {person.person.name}
      </span>
    </p>
    <p>Are you sure you want to do this?</p>
    <div class="flex flex-row gap-2">
      <Button size="lg" onclick={() => (purgingUser = false)} class="flex-1">Cancel</Button>
      <Button size="lg" color="danger" onclick={purgeUser} class="flex-1">Purge</Button>
    </div>
  </Modal>
{/if}

{#if setNote}
  <Modal bind:open={setNote}>
    {#snippet customTitle()}
      {$t('routes.user.note')}
    {/snippet}
    <UserNote
      person={person.person.id}
      note={person.personActions.note}
      onsubmit={(e) => {
        // lol
        person.personActions.note = e ?? undefined
        setNote = !setNote
        toast({
          content: $t('message.success'),
          type: 'success',
        })
      }}
    />
  </Modal>
{/if}

{#if profile.current?.user && profile.current.jwt && person.person.id != profile.current.user.local_user_view.person.id}
  <div class="flex items-center gap-2 w-full flex-wrap">
    <Button size="lg" color="primary" href="/inbox/messages/{person.person.id}" icon={Envelope}>
      {$t('content.message')}
    </Button>
    {#if person.person.matrix_user_id}
      <Button size="lg" color="secondary" href="https://matrix.to/#/{person.person.matrix_user_id}">
        {#snippet prefix()}
          <Icon solid size="16" src={AtSymbol} />
        {/snippet}
        {$t('form.profile.matrix')}
      </Button>
    {/if}
    {#if profile.isAdmin}
      <Menu class="ml-auto" placement="bottom-end">
        {#snippet target(attachment)}
          <Button
            {@attach attachment}
            size="square-lg"
            rounding="2xl"
            icon={ShieldCheck}
            aria-label={$t('moderation.label')}
          ></Button>
        {/snippet}
        <MenuButton href="/modlog?user={person.person.id}" color="success-subtle" icon={Newspaper}>
          {$t('moderation.modlog.user')}
        </MenuButton>
        <MenuButton
          color="danger-subtle"
          onclick={() => ban(!person.banned, person.person)}
          icon={ShieldExclamation}
        >
          {person.banned ? 'Unban' : 'Ban'}
        </MenuButton>
        <MenuButton color="danger-subtle" onclick={() => (purgingUser = !purgingUser)} icon={Fire}>
          Purge
        </MenuButton>
      </Menu>
    {/if}
    <Menu placement="bottom-end">
      {#snippet target(attachment)}
        <Button
          {@attach attachment}
          size="square-lg"
          rounding="2xl"
          icon={EllipsisHorizontal}
          aria-label={$t('post.actions.more.label')}
        />
      {/snippet}
      <MenuButton onclick={() => (setNote = !setNote)} icon={Tag}>
        {$t('routes.user.note')}
      </MenuButton>
      <MenuButton color="danger-subtle" onclick={block}>
        {#snippet prefix()}
          <Icon mini size="16" src={NoSymbol} />
        {/snippet}
        {person.blocked ? 'Unblock' : 'Block'}
      </MenuButton>
    </Menu>
  </div>
{/if}
