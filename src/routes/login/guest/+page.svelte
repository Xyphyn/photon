<script lang="ts">
  import { preventDefault } from 'svelte/legacy'

  import { goto } from '$app/navigation'
  import { page } from '$app/state'
  import { profileData } from '$lib/auth.svelte'
  import Header from '$lib/components/ui/layout/pages/Header.svelte'
  import { t } from '$lib/i18n/translations'
  import { LINKED_INSTANCE_URL } from '$lib/instance.svelte'
  import {
    mayBeIncompatible,
    site,
    validateInstance,
  } from '$lib/client/client.svelte'
  import { DOMAIN_REGEX_FORMS } from '$lib/util.svelte'
  import { MINIMUM_VERSION } from '$lib/version'
  import { Button, Note, Option, Select, TextInput, toast } from 'mono-svelte'
  import type { ClientType } from '$lib/client/client'

  interface Props {
    ref?: string
    children?: import('svelte').Snippet
  }

  let { ref = page.url.searchParams.get('redirect') ?? '/', children }: Props =
    $props()

  let data = $state({
    instance: '',
    username: `${$t('account.guest')} ${profileData.profiles.filter(p => p.jwt == undefined).length + 1}`,
    loading: false,
    client: { name: 'lemmy', baseUrl: '/api/v3' } as ClientType,
  })

  async function addGuest() {
    data.loading = true

    const result = await validateInstance(data.instance, data.client)
    if (!result) {
      toast({ content: $t('toast.failInstanceURL'), type: 'error' })
      data.loading = false
      return
    }

    const id = Math.max(...profileData.profiles.map(i => i.id)) + 1
    profileData.profiles.push({
      id: id,
      instance: data.instance,
      username: data.username,
      client: data.client,
    })
    profileData.profile = id

    toast({ content: $t('toast.addAccount'), type: 'success' })

    goto(ref)

    data.loading = false
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
        bind:value={data.username}
        placeholder="Guest 2"
        minlength={1}
        class="flex-1"
      ></TextInput>
      {#if !LINKED_INSTANCE_URL}
        <TextInput
          required
          label={$t('form.instance')}
          bind:value={data.instance}
          pattern={DOMAIN_REGEX_FORMS}
          placeholder="example.com"
          class="flex-1"
          oninput={() => {
            data.instance = data.instance.trim().toLowerCase()
            if (data.instance.includes('piefed')) {
              data.client.name = 'piefed'
              data.client.baseUrl = '/api/alpha'
            } else if (data.instance.includes('lemmy')) {
              data.client.name = 'lemmy'
              data.client.baseUrl = '/api/v3'
            }
          }}
        >
          {#snippet suffix()}
            <Select
              selectClass="h-9 border-t-0 border-b-0 border-r-0 rounded-l-none rounded-inherit dark:bg-zinc-950"
              class="self-end h-9"
              required
              bind:value={
                () => data.client.name,
                v => {
                  data.client.name = v
                  data.client.baseUrl = v === 'lemmy' ? '/api/v3' : '/api/alpha'
                }
              }
            >
              <Option value="lemmy">Lemmy</Option>
              <Option value="piefed">PieFed</Option>
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
      loading={data.loading}
      disabled={data.loading}
    >
      {$t('form.submit')}
    </Button>
  </form>
</div>
