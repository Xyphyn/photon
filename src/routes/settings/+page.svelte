<script lang="ts">
  import Switch from '$lib/components/input/Switch.svelte'
  import { userSettings } from '$lib/settings'
  import Setting from './Setting.svelte'
  import MultiSelect from '$lib/components/input/MultiSelect.svelte'
  import Sort from '$lib/components/lemmy/Sort.svelte'
  import { toast } from '$lib/components/ui/toasts/toasts.js'
  import Button from '$lib/components/input/Button.svelte'
  import { getInboxNotifications } from '$lib/auth.js'
  import Checkbox from '$lib/components/input/Checkbox.svelte'

  let data = {
    loading: false,
  }
</script>

<svelte:head>
  <title>Settings</title>
</svelte:head>

<div class="flex flex-col">
  <h1 class="text-3xl font-bold">Settings</h1>
  <h2 class="uppercase font-bold opacity-80 text-sm mt-4">General</h2>
  <Setting>
    <span slot="title">Default sort</span>
    <span slot="description">The default sort to use for feeds.</span>
    <div class="flex flex-wrap flex-row gap-4 w-full">
      <div class="w-full">
        <span class="block my-1 font-bold">Feed</span>
        <MultiSelect
          options={['Subscribed', 'Local', 'All']}
          bind:selected={$userSettings.defaultSort.feed}
        />
      </div>
      <div class="w-full">
        <span class="block my-1 font-bold">Sort</span>
        <Sort bind:selected={$userSettings.defaultSort.sort} navigate={false} />
      </div>
    </div>
  </Setting>
  <Setting>
    <span slot="title">Hide Posts</span>
    <span slot="description">Hide certain types of posts.</span>
    <div class="flex flex-row items-center gap-4 flex-wrap">
      <Checkbox bind:checked={$userSettings.hidePosts.deleted}>
        Deleted
      </Checkbox>
      <Checkbox bind:checked={$userSettings.hidePosts.removed}>
        Removed
      </Checkbox>
      <Checkbox bind:checked={$userSettings.hidePosts.read}>Read</Checkbox>
    </div>
  </Setting>
  <Setting>
    <Checkbox slot="title" bind:checked={$userSettings.displayNames}>
      Use display name
    </Checkbox>
    <span slot="description">
      Show a user's display name instead of their account username.
    </span>
  </Setting>
  <h2 class="uppercase font-bold opacity-80 text-sm mt-4">UI</h2>
  <Setting>
    <Checkbox bind:checked={$userSettings.markReadPosts} slot="title">
      Mark read posts
    </Checkbox>
    <span slot="description">Fade the title of posts you've already read.</span>
  </Setting>
  <Setting>
    <Checkbox bind:checked={$userSettings.revertColors} slot="title">
      Revert vote colors
    </Checkbox>
    <span slot="description">
      Make upvotes orange and downvotes blue, like Reddit used to do.
    </span>
  </Setting>
  <Setting>
    <span slot="title">Post style</span>
    <MultiSelect
      options={[false, true]}
      optionNames={['Cards', 'Compact']}
      bind:selected={$userSettings.showCompactPosts}
    />
  </Setting>
  <h2 class="uppercase font-bold opacity-80 text-sm mt-4">Instances</h2>
  <Setting>
    <span slot="title">Show instances</span>
    <span slot="description">Show items' instances.</span>
    <span
      class="flex gap-0 px-3 py-2 bg-slate-100 dark:bg-zinc-800 rounded-md w-max"
    >
      Xylight
      <span class="opacity-50">@example.com</span>
    </span>
    <div class="flex flex-row flex-wrap items-center gap-4">
      <Checkbox bind:checked={$userSettings.showInstances.user}>Users</Checkbox>
      <Checkbox bind:checked={$userSettings.showInstances.comments}>
        Comments
      </Checkbox>
      <Checkbox bind:checked={$userSettings.showInstances.community}>
        Communities
      </Checkbox>
    </div>
  </Setting>
</div>
