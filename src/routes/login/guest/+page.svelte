<script lang="ts">
  import { preventDefault } from 'svelte/legacy'

  import { goto } from '$app/navigation'
  import { page } from '$app/state'
  import { profile } from '$lib/auth.svelte'
  import { DEFAULT_CLIENT_TYPE, type ClientType } from '$lib/client/base'
  import { validateInstance } from '$lib/client/lemmy.svelte'
  import Header from '$lib/components/ui/layout/pages/Header.svelte'
  import { t } from '$lib/i18n/translations'
  import { LINKED_INSTANCE_URL } from '$lib/instance.svelte'
  import { DOMAIN_REGEX_FORMS } from '$lib/util.svelte'
  import { Button, Option, Select, TextInput, toast } from 'mono-svelte'

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

  async function addGuest() {
    form.loading = true
    if (!(await validateInstance(form.instance, form.client))) {
      toast({ content: $t('toast.failInstanceURL'), type: 'error' })
      form.loading = false
      return
    }

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

    form.loading = false
  }
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
          label={$t('form.instance')}
          bind:value={form.instance}
          pattern={DOMAIN_REGEX_FORMS}
          placeholder="example.com"
          class="flex-1 overflow-hidden"
        >
          {#snippet suffix()}
            <Select
              bind:value={
                () => {
                  if (form.client.name == 'lemmy') return 'lemmyv3'
                  else return 'piefedvalpha'
                },
                (v) => {
                  if (v == 'lemmyv3')
                    form.client = { name: 'lemmy', baseUrl: '/api/v3' }
                  else form.client = { name: 'piefed', baseUrl: '/api/alpha' }
                }
              }
              class="border-0 rounded-none! border-l"
            >
              <Option value="lemmyv3">Lemmy</Option>
              <Option value="piefedvalpha">Piefed</Option>
            </Select>
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
