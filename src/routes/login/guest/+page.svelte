<script lang="ts">
  import { preventDefault } from 'svelte/legacy'

  import { goto } from '$app/navigation'
  import { page } from '$app/state'
  import Header from '$lib/components/ui/layout/pages/Header.svelte'
  import { t } from '$lib/i18n/translations'
  import { LINKED_INSTANCE_URL } from '$lib/instance.svelte'
  import { mayBeIncompatible } from '$lib/lemmy.svelte'
  import { site, validateInstance } from '$lib/lemmy.svelte.js'
  import { DOMAIN_REGEX_FORMS } from '$lib/util.svelte'
  import { MINIMUM_VERSION } from '$lib/version'
  import { Button, Note, TextInput, toast } from 'mono-svelte'
  import { profile } from '$lib/auth.svelte'

  interface Props {
    ref?: string
    children?: import('svelte').Snippet
  }

  let { ref = page.url.searchParams.get('redirect') ?? '/', children }: Props =
    $props()

  let form = $state({
    instance: '',
    username: `${$t('account.guest')} ${profile.meta.profiles.filter(p => p.jwt == undefined).length + 1}`,
    loading: false,
  })

  async function addGuest() {
    form.loading = true
    if (!(await validateInstance(form.instance))) {
      toast({ content: $t('toast.failInstanceURL'), type: 'error' })
      form.loading = false
      return
    }

    const id = Math.max(...profile.meta.profiles.map(i => i.id)) + 1
    profile.meta.profiles.push({
      id: id,
      instance: form.instance,
      username: form.username,
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
      {#if site.data && mayBeIncompatible(MINIMUM_VERSION, site.data.version.replace('v', ''))}
        <Note>
          {$t('account.versionGate', {
            version: `v${MINIMUM_VERSION}`,
          })}
        </Note>
      {/if}
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
          class="flex-1"
        />
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
