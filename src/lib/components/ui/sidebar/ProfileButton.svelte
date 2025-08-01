<script lang="ts">
  import { goto } from '$app/navigation'
  import { page } from '$app/state'
  import { profile, type ProfileInfo } from '$lib/auth.svelte'
  import SidebarButton from '$lib/components/ui/sidebar/SidebarButton.svelte'
  import { LINKED_INSTANCE_URL } from '$lib/instance.svelte'
  import ProfileAvatar from '$lib/lemmy/ProfileAvatar.svelte'
  import { Icon, QuestionMarkCircle } from 'svelte-hero-icons'

  let switching: boolean = $state(false)
  interface Props {
    prof: ProfileInfo
    index: number
    guest?: boolean
  }

  let { prof, index, guest = false }: Props = $props()
</script>

<SidebarButton
  loading={switching}
  loaderWidth={22}
  selected={profile.current?.id == prof.id}
  onclick={async () => {
    switching = true

    if (profile.current?.id != prof.id) {
      profile.meta.profile = prof.id
    }

    await goto(page.url, {
      invalidateAll: true,
    })

    switching = false
  }}
  class="w-full font-normal"
>
  {#snippet customIcon()}
    <ProfileAvatar
      profile={prof}
      {index}
      {guest}
      selected={profile.current?.id == prof.id}
    />
  {/snippet}
  <span
    class={[
      'inline-flex flex-col gap-0',
      profile.current?.id == prof.id && 'font-semibold',
    ]}
  >
    {prof.username ?? prof.user?.local_user_view.person.name}
    {#if !guest && !LINKED_INSTANCE_URL}
      <span class="text-slate-500 dark:text-zinc-400 font-normal text-xs">
        {prof.instance}
      </span>
    {/if}
  </span>
  {#if !prof.jwt}
    <Icon src={QuestionMarkCircle} size="14" micro class="ml-auto opacity-50" />
  {/if}
</SidebarButton>
