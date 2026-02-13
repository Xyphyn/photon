<script lang="ts">
  import { goto } from '$app/navigation'
  import { resolve } from '$app/paths'
  import { page } from '$app/state'
  import { client } from '$lib/api/client.svelte'
  import { profile } from '$lib/app/auth'
  import { errorMessage } from '$lib/app/error'
  import { t } from '$lib/app/i18n'
  import ProfileButton from '$lib/feature/user/ProfileButton.svelte'
  import { Header } from '$lib/ui/layout'
  import SidebarButton from '$lib/ui/sidebar/SidebarButton.svelte'
  import { Button, Material, TextLoader, toast } from 'mono-svelte'
  import { Plus } from 'svelte-hero-icons/dist'
  import { expoOut } from 'svelte/easing'
  import { fly } from 'svelte/transition'

  interface Props {
    type?: 'post' | 'comment'
  }

  let { type = 'post' }: Props = $props()

  let _state = $state<'loading' | 'found' | 'error' | 'none'>('loading')
  let manual = $state(false)
  const fetched = $state.snapshot(profile.current.instance)

  $effect(() => {
    if (!manual) fetchOnHome()
  })

  $effect(() => {
    if (_state == 'error') manual = true
  })

  async function fetchOnHome() {
    const initialManual = manual
    _state = 'loading'
    try {
      const res = await client().resolveObject({
        q: `https://${page.params.instance}/${type}/${page.params.id}`,
      })

      if ((type == 'post' && !res.post) || (type == 'comment' && !res.comment))
        throw new Error('cant_find_object')
      if (initialManual != manual) return

      goto(
        resolve(`/${type}/[instance]/[id=integer]`, {
          instance: profile.current.instance,
          id:
            type == 'post'
              ? res.post!.post.id.toString()
              : res.comment!.comment.id.toString(),
        }),
        { replaceState: true },
      )
      _state = 'found'
    } catch (err) {
      toast({ content: errorMessage(err), type: 'error' })
      manual = true
      _state = 'error'
    }
  }
</script>

<div class="w-full h-full flex flex-col justify-center mx-auto max-w-xl gap-6">
  {#if !manual}
    <header class="space-y-1">
      <Header>
        <div class="grid w-full">
          {#if _state == 'loading'}
            <div
              in:fly={{ easing: expoOut, duration: 300, y: 16 }}
              out:fly={{ easing: expoOut, duration: 300, x: 16 }}
              style="grid-column: 1; grid-row: 1;"
            >
              <TextLoader class="text-3xl!">
                {$t('routes.postRedirect.automatic.title')}
              </TextLoader>
            </div>
          {:else if _state == 'found'}
            <div
              in:fly={{ easing: expoOut, duration: 300, x: -16 }}
              style="grid-column: 1; grid-row: 1;"
            >
              <TextLoader class="text-3xl!">
                {$t('routes.postRedirect.automatic.found')}
              </TextLoader>
            </div>
          {/if}
        </div>
      </Header>
      <p></p>
      <Button color="secondary" size="lg" onclick={() => (manual = true)}>
        {$t('common.cancel')}
      </Button>
    </header>
  {:else}
    <header class="space-y-1">
      <div
        class="font-mono bg-slate-100 dark:bg-zinc-950 rounded-xs p-0.5 px-1 w-max"
      >
        {page.params.instance}/{type}/{page.params.id}
      </div>
      <Header>
        {$t('routes.postRedirect.title')}
      </Header>
      <p>
        {$t('routes.postRedirect.description', {
          homeInstance: fetched,
        })}
      </p>
    </header>
    <div class="flex flex-row items-center gap-2 flex-wrap">
      {#if profile.current.jwt}
        <Button
          loading={_state == 'loading'}
          size="lg"
          color="primary"
          onclick={fetchOnHome}
        >
          {$t('routes.postRedirect.actions.fetch', {
            homeInstance: fetched,
          })}
        </Button>
      {/if}
      <Button size="lg" onclick={() => history.back()}>
        {$t('routes.postRedirect.actions.back')}
      </Button>
    </div>
    {#if profile.meta.profiles}
      {@const filtered = profile.meta.profiles.filter(
        (i) => i.instance == page.params.instance,
      )}
      <div class="space-y-1">
        <div class="font-medium text-sm">
          {$t('routes.postRedirect.actions.switch', {
            destInstance: page.params.instance,
          })}
        </div>
        <Material
          color="uniform"
          padding="sm"
          rounding="2xl"
          class="dark:bg-zinc-950 max-h-96 overflow-auto"
        >
          {#each filtered as profile (profile.id)}
            <ProfileButton prof={profile} />
          {/each}
          <SidebarButton
            href="/accounts/login/guest?redirect={page.url}"
            icon={Plus}
            class="rounded-lg"
          >
            {$t('account.addGuest')}
          </SidebarButton>
        </Material>
      </div>
    {/if}
  {/if}
</div>
