<script lang="ts">
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import { profile, setUserID, type Profile } from '$lib/auth.js'
  import SidebarButton from '$lib/components/ui/sidebar/SidebarButton.svelte'
  import ProfileAvatar from '$lib/lemmy/ProfileAvatar.svelte'
  import { Button } from 'mono-svelte'

  export let prof: Profile
  export let index: number

  let switching: boolean = false
</script>

<SidebarButton
  color="tertiary"
  alignment="left"
  loading={switching}
  loaderWidth={20}
  on:click={async () => {
    switching = true

    if ($profile?.id == prof.id) {
      await setUserID(-1)
    } else {
      await setUserID(prof.id)
    }

    await goto($page.url, {
      invalidateAll: true,
    })

    switching = false
  }}
  class="w-full font-normal {$profile?.id == prof.id
    ? '!bg-slate-100 dark:!bg-zinc-900'
    : ''}"
>
  <ProfileAvatar profile={prof} {index} selected={$profile?.id == prof.id} />
  <span
    class="flex flex-col gap-0 {$profile?.id == prof.id ? 'font-semibold' : ''}"
    slot="label"
  >
    {prof.username ?? prof.user?.local_user_view.person.name}
    <span class="text-slate-500 dark:text-zinc-400 font-normal text-xs">
      {prof.instance}
    </span>
  </span>
</SidebarButton>
