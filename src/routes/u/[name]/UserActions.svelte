<script lang="ts">
  import { profile } from '$lib/auth.svelte'
  import { client } from '$lib/client/lemmy.svelte'
  import type { PersonView } from '$lib/client/types'
  import { ban, isAdmin } from '$comp/lemmy/moderation/moderation'
  import { t } from '$lib/i18n/translations'
  import { blockUser, isBlocked } from '$lib/lemmy/user'
  import {
    Button,
    Menu,
    MenuButton,
    Modal,
    removeToast,
    toast,
  } from 'mono-svelte'
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
  } from 'svelte-hero-icons'

  let { person }: { person: PersonView } = $props()

  let purgingUser = $state(false)

  async function purgeUser() {
    purgingUser = false
    const purgeToast = toast({ content: '', loading: true })

    try {
      await client().purgePerson({
        person_id: person.person.id,
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
      <Button size="lg" onclick={() => (purgingUser = false)} class="flex-1">
        Cancel
      </Button>
      <Button size="lg" color="danger" onclick={purgeUser} class="flex-1">
        Purge
      </Button>
    </div>
  </Modal>
{/if}

{#if profile.current?.user && profile.current.jwt && person.person.id != profile.current.user.local_user_view.person.id}
  <div class="flex items-center gap-2 w-full flex-wrap">
    <Button
      size="sm"
      rounding="pill"
      color="primary"
      href="/inbox/messages/{person.person.id}"
      icon={Envelope}
    >
      {$t('content.message')}
    </Button>
    {#if person.person.matrix_user_id}
      <Button
        size="sm"
        rounding="pill"
        color="secondary"
        href="https://matrix.to/#/{person.person.matrix_user_id}"
      >
        {#snippet prefix()}
          <Icon solid size="16" src={AtSymbol} />
        {/snippet}
        {$t('form.profile.matrix')}
      </Button>
    {/if}
    {#if isAdmin(profile.current?.user)}
      <Menu class="ml-auto" placement="bottom-end">
        {#snippet target(attachment)}
          <Button
            {@attach attachment}
            size="sm"
            rounding="pill"
            icon={ShieldCheck}
          >
            {$t('moderation.label')}
          </Button>
        {/snippet}
        <MenuButton
          href="/modlog?user={person.person.id}"
          color="success-subtle"
          icon={Newspaper}
        >
          {$t('moderation.modlog.user')}
        </MenuButton>
        <MenuButton
          color="danger-subtle"
          onclick={() => ban(person.person.banned, person.person)}
          icon={ShieldExclamation}
        >
          {person.person.banned ? 'Unban' : 'Ban'}
        </MenuButton>
        <MenuButton
          color="danger-subtle"
          onclick={() => (purgingUser = !purgingUser)}
          icon={Fire}
        >
          Purge
        </MenuButton>
      </Menu>
    {/if}
    <Menu placement="bottom-end">
      {#snippet target(attachment)}
        <Button
          {@attach attachment}
          size="custom"
          class="h-8 w-8"
          rounding="pill"
          icon={EllipsisHorizontal}
        ></Button>
      {/snippet}
      <MenuButton
        color="danger-subtle"
        onclick={() =>
          blockUser(
            isBlocked(profile.current.user!, person.person.id),
            person.person.id,
          )}
      >
        {#snippet prefix()}
          <Icon mini size="16" src={NoSymbol} />
        {/snippet}
        {isBlocked(profile.current.user, person.person.id)
          ? 'Unblock'
          : 'Block'}
      </MenuButton>
    </Menu>
  </div>
{/if}
