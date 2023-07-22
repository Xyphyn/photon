<script lang="ts">
  import Switch from '$lib/components/input/Switch.svelte'
  import TextInput from '$lib/components/input/TextInput.svelte'
  import Card from '$lib/components/ui/Card.svelte'
  import { userSettings } from '$lib/settings'
  import { authData, instance, user, validateInstance } from '$lib/lemmy.js'
  import { Color } from '$lib/ui/colors.js'
  import Button from '$lib/components/input/Button.svelte'
  import { ToastType, toast } from '$lib/components/ui/toasts/toasts.js'
  import Setting from './Setting.svelte'
  import MultiSelect from '$lib/components/input/MultiSelect.svelte'

  let data = {
    newInstance: $instance,
    loading: false,
  }

  async function changeInstance() {
    data.loading = true
    try {
      authData.set(undefined)
      user.set(undefined)
      if (typeof localStorage != 'undefined') {
        localStorage.removeItem('user')
      }

      if (!(await validateInstance(data.newInstance))) {
        throw new Error('Failed to contact that instance URL')
      }

      instance.set(data.newInstance)

      $userSettings.instance = data.newInstance
    } catch (error) {
      toast({
        content: error as any,
        type: ToastType.error,
      })
    }
    data.loading = false
  }
</script>

<svelte:head>
  <title>Settings</title>
</svelte:head>

<div class="flex flex-col">
  <h1 class="text-3xl font-bold">Settings</h1>
  <h2 class="uppercase font-bold opacity-80 text-sm mt-4">General</h2>
  <Setting>
    <span slot="title">Instance</span>
    <span slot="description">Changing this will log you out.</span>
    <div class="flex gap-2">
      <TextInput
        bind:value={data.newInstance}
        pattern={'(?!-)[A-Za-z0-9-]+([-.]{1}[a-z0-9]+)*.[A-Za-z]{2,6}'}
        class="flex-1"
      />
      <div class="w-24">
        <Button
          color="primary"
          loading={data.loading}
          disabled={data.loading}
          on:click={changeInstance}
          size="lg"
          class="h-full"
        >
          Change
        </Button>
      </div>
    </div>
  </Setting>
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
        <MultiSelect
          options={['Active', 'Hot', 'TopAll', 'New']}
          optionNames={['Active', 'Hot', 'Top', 'New']}
          bind:selected={$userSettings.defaultSort.sort}
        />
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
    <span slot="title">Show user instances</span>
    <span slot="description">Show user's instances.</span>
    <span class="flex gap-0 px-3 py-2 bg-slate-100 dark:bg-zinc-800 rounded-md">
      Xylight
      <span class="opacity-50">@example.com</span>
    </span>
    <Switch bind:enabled={$userSettings.showInstance} />
  </Setting>
</div>
