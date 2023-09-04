<script lang="ts">
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import { profile, setUserID, type Profile } from '$lib/auth.js'
  import ProfileAvatar from '$lib/lemmy/ProfileAvatar.svelte'
  import { Button } from 'mono-svelte'

  export let expanded: boolean = false
  export let prof: Profile
  export let index: number

  let switching: boolean = false
</script>

<Button
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
  class="w-full hover:bg-slate-200 {expanded ? '' : '!p-1.5'} {$profile?.id ==
  prof.id
    ? 'font-bold'
    : ''}"
>
  <ProfileAvatar
    profile={prof}
    {index}
    selected={$profile?.id == prof.id}
    slot="prefix"
  />
  <span class:hidden={!expanded} class="flex flex-col gap-0">
    {prof.username ?? prof.user?.local_user_view.person.name}
    <span class="text-slate-500 dark:text-zinc-400 font-normal text-xs">
      {prof.instance}
    </span>
  </span>
</Button>
