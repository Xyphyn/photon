<script lang="ts">
  import Switch from '$lib/components/input/Switch.svelte'
  import TextInput from '$lib/components/input/TextInput.svelte'
  import Card from '$lib/components/ui/Card.svelte'
  import { userSettings } from '$lib/settings'
  import {
    LINKED_INSTANCE_URL,
    instance,
    validateInstance,
  } from '$lib/lemmy.js'
  import { Color } from '$lib/ui/colors.js'
  import Button from '$lib/components/input/Button.svelte'
  import { toast } from '$lib/components/ui/toasts/toasts.js'
  import Setting from './Setting.svelte'
  import MultiSelect from '$lib/components/input/MultiSelect.svelte'
  import Sort from '$lib/components/lemmy/Sort.svelte'

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
    <div class="flex flex-wrap flex-row gap-4">
      <div>
        <span class="block my-1 font-bold">Feed</span>
        <MultiSelect
          options={['Subscribed', 'Local', 'All']}
          bind:selected={$userSettings.defaultSort.feed}
        />
      </div>
      <div>
        <span class="block my-1 font-bold">Sort</span>
        <Sort bind:selected={$userSettings.defaultSort.sort} navigate={false} />
      </div>
    </div>
  </Setting>
  <h2 class="uppercase font-bold opacity-80 text-sm mt-4">UI</h2>
  <Setting>
    <span slot="title">Mark read posts</span>
    <span slot="description">Fade the title of posts you've already read.</span>
    <Switch bind:enabled={$userSettings.markReadPosts} />
  </Setting>
  <Setting>
    <span slot="title">Revert vote colors</span>
    <span slot="description">
      Make upvotes orange and downvotes blue, like Reddit used to do.
    </span>
    <Switch bind:enabled={$userSettings.revertColors} />
  </Setting>
  <Setting>
    <span slot="title">Show compact posts</span>
    <span slot="description">
      Show posts with smaller thumbnails and without text bodies.
    </span>
    <Switch bind:enabled={$userSettings.showCompactPosts} />
  </Setting>
  <h2 class="uppercase font-bold opacity-80 text-sm mt-4">Instances</h2>
  <Setting>
    <span slot="title">Show instances</span>
    <span slot="description">Show items' instances.</span>
    <span class="flex gap-0 px-3 py-2 bg-slate-100 dark:bg-zinc-800 rounded-md">
      Xylight
      <span class="opacity-50">@example.com</span>
    </span>
    <div class="flex flex-row items-center gap-4">
      <div class="flex items-center gap-1 font-bold">
        Users
        <Switch bind:enabled={$userSettings.showInstances.user} />
      </div>
      <div class="flex items-center gap-1 font-bold">
        Comments
        <Switch bind:enabled={$userSettings.showInstances.comments} />
      </div>
      <div class="flex items-center gap-1 font-bold">
        Communities
        <Switch bind:enabled={$userSettings.showInstances.community} />
      </div>
    </div>
  </Setting>
</div>
