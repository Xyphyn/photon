<script lang="ts">
  import Switch from '$lib/components/input/Switch.svelte'
  import TextInput from '$lib/components/input/TextInput.svelte'
  import Card from '$lib/components/ui/Card.svelte'
  import { userSettings } from '$lib/settings'
  import { authData, instance, user, validateInstance } from '$lib/lemmy.js'
  import { Color } from '$lib/ui/colors.js'
  import Button from '$lib/components/input/Button.svelte'
  import { ToastType, toast } from '$lib/components/ui/toasts/toasts.js'

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

<div class="flex flex-col gap-4">
  <h1 class="text-3xl font-bold">Settings</h1>
  <Card class="flex flex-col gap-3 p-6 text-sm">
    <h1 class="font-bold">Instance</h1>
    <p>Changing this will log you out.</p>
    <div class="flex gap-2">
      <TextInput
        bind:value={data.newInstance}
        pattern={'(?!-)[A-Za-z0-9-]+([-.]{1}[a-z0-9]+)*.[A-Za-z]{2,6}'}
        class="flex-1"
      />
      <div class="w-24">
        <Button
          color={Color.accent}
          large
          loading={data.loading}
          disabled={data.loading}
          on:click={changeInstance}
        >
          Change
        </Button>
      </div>
    </div>
  </Card>
  <Card class="flex flex-col gap-3 p-6 text-sm">
    <h1 class="font-bold">Mark read posts</h1>
    <p>Fade the title of posts you've already read.</p>
    <Switch bind:enabled={$userSettings.markReadPosts} />
  </Card>
</div>
