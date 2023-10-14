<script lang="ts">
  import { profile } from '$lib/auth.js'
  import UserLink from '$lib/components/lemmy/user/UserLink.svelte'
  import SectionTitle from '$lib/components/ui/SectionTitle.svelte'
  import { Material, toast } from 'mono-svelte'
  import { getClient } from '$lib/lemmy.js'
  import type { RegistrationApplicationView } from 'lemmy-js-client'
  import { Button } from 'mono-svelte'
  import { Check, Icon, XMark } from 'svelte-hero-icons'
  import RelativeDate from '$lib/components/util/RelativeDate.svelte'
  import { publishedToDate } from '$lib/components/util/date'

  export let application: RegistrationApplicationView

  let approving = false
  let denying = false

  async function review(approve: boolean) {
    if (!$profile?.jwt) return

    if (approve) {
      approving = true
    } else {
      denying = true
    }

    try {
      await getClient().approveRegistrationApplication({
        approve: approve,
        id: application.registration_application.id,
      })
      toast({
        content: `Successfully ${
          approve ? 'approved' : 'denied'
        } that application.`,
        type: 'success',
      })
      application.creator_local_user.accepted_application = approve
      application.admin = $profile.user!.local_user_view.person

      $profile.user!.notifications.applications -= 1
    } catch (err) {
      toast({
        content: err as any,
        type: 'error',
      })
    }

    approving = false
    denying = false
  }
</script>

<Material class="flex flex-col gap-2">
  <div class="flex flex-col gap-1">
    <span class="text-slate-600 dark:text-zinc-400">
      <RelativeDate
        date={publishedToDate(application.registration_application.published)}
      />
    </span>

    <SectionTitle>User</SectionTitle>
    <span class="text-sm">
      <UserLink user={application.creator} avatar avatarSize={20} />
    </span>
  </div>
  <div>
    <SectionTitle>Application</SectionTitle>
    <p>{application.registration_application.answer}</p>
  </div>
  <div class="flex flex-col md:flex-row gap-2 md:items-center">
    {#if application.admin}
      <div class="flex items-center gap-1 text-sm">
        <SectionTitle>
          {application.creator_local_user.accepted_application
            ? 'Approved'
            : 'Denied'} by
        </SectionTitle>
        <UserLink avatar user={application.admin} />
      </div>
      <div class="md:ml-auto" />
    {/if}
    <div class="ml-auto">
      <Button
        size="square-md"
        class="hover:bg-slate-200 {application.creator_local_user
          .accepted_application === false && application.admin
          ? '!text-red-500'
          : ''}"
        aria-label="Deny"
        on:click={() => review(false)}
        loading={denying}
        disabled={approving || denying}
      >
        <Icon src={XMark} mini size="16" slot="prefix" />
      </Button>
      <Button
        size="square-md"
        class="hover:bg-slate-200 {application.creator_local_user
          .accepted_application
          ? '!text-green-500'
          : ''}"
        aria-label="Approve"
        on:click={() => review(true)}
        loading={approving}
        disabled={approving || denying}
      >
        <Icon src={Check} mini size="16" slot="prefix" />
      </Button>
    </div>
  </div>
</Material>
