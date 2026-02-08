<script lang="ts">
  import { goto } from '$app/navigation'
  import { page } from '$app/state'
  import {
    BaseClient,
    type ClientType,
    DEFAULT_CLIENT_TYPE,
  } from '$lib/api/base'
  import { profile } from '$lib/app/auth'
  import { errorMessage } from '$lib/app/error'
  import { t } from '$lib/app/i18n'
  import { LINKED_INSTANCE_URL } from '$lib/app/instance.svelte'
  import { DOMAIN_REGEX_FORMS, instanceToURL } from '$lib/app/util.svelte'
  import { Header } from '$lib/ui/layout'
  import { Button, Spinner, TextInput, toast } from 'mono-svelte'
  import { debounce } from 'mono-svelte/util/time'
  import { expoOut } from 'svelte/easing'
  import { preventDefault } from 'svelte/legacy'
  import { fly } from 'svelte/transition'

  interface Props {
    ref?: string
    children?: import('svelte').Snippet
  }

  let { ref = page.url.searchParams.get('redirect') ?? '/', children }: Props =
    $props()

  let form = $state<{
    instance: string
    username: string
    loading: boolean
    client: ClientType
  }>({
    instance: '',
    username: `${$t('account.guest')} ${profile.meta.profiles.filter((p) => p.jwt == undefined).length + 1}`,
    loading: false,
    client: DEFAULT_CLIENT_TYPE,
  })

  async function checkInstance() {
    const type = await BaseClient.fetchInfo(
      new URL(instanceToURL(form.instance)),
    )
    if (type == null) throw Error('not_live_supported')
    form.client = type?.type
  }

  async function addGuest() {
    try {
      form.loading = true

      await checkInstance()

      const id = Math.max(...profile.meta.profiles.map((i) => i.id)) + 1
      profile.meta.profiles.push({
        id: id,
        instance: form.instance,
        username: form.username,
        client: form.client,
      })
      profile.meta.profile = id

      toast({ content: $t('toast.addAccount'), type: 'success' })

      goto(ref)
    } catch (err) {
      toast({
        content: errorMessage(err as string),
        type: 'error',
      })

      form.loading = false
    }
  }

  let detectedClient = $state<string | null | undefined>()

  const checkDebounce = debounce(async () => {
    const startingText = form.instance
    try {
      detectedClient = null
      await checkInstance()
      // so that debounce desync thing doesnt happen
      if (startingText == form.instance) detectedClient = form.client.name
    } catch {
      if (startingText == form.instance) detectedClient = undefined
    }
  }, 500)

  $effect(() => {
    if (form.instance && !LINKED_INSTANCE_URL) checkDebounce()
  })
</script>

<div class="max-w-xl w-full mx-auto h-max my-auto">
  <form onsubmit={preventDefault(addGuest)} class="flex flex-col gap-5">
    <div class="flex flex-col gap-2">
      {@render children?.()}
      <Header>{$t('account.addGuest')}</Header>
    </div>
    <div class="inline-flex items-center gap-2">
      <TextInput
        required
        label={$t('form.name')}
        bind:value={form.username}
        placeholder="Guest 2"
        minlength={1}
        class="flex-1"
      ></TextInput>
      {#if !LINKED_INSTANCE_URL}
        <TextInput
          required
          bind:value={form.instance}
          pattern={DOMAIN_REGEX_FORMS}
          placeholder="example.com"
          class="flex-1 overflow-hidden"
          autocorrect="off"
          autocapitalize="none"
        >
          {#snippet customLabel()}
            {$t('form.instance')}
            <span class="absolute right-0">
              {#if detectedClient}
                <span
                  class="capitalize font-normal"
                  in:fly={{ duration: 300, y: 2, easing: expoOut }}
                >
                  {detectedClient}
                </span>
              {:else if detectedClient === null}
                <Spinner />
              {/if}
            </span>
          {/snippet}
        </TextInput>
      {/if}
    </div>
    <Button
      submit
      class="w-full"
      color="primary"
      size="lg"
      loading={form.loading}
      disabled={form.loading}
    >
      {$t('form.submit')}
    </Button>
  </form>
</div>
